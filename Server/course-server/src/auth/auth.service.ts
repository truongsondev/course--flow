import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { PrismaClient } from 'generated/prisma';
import { lastValueFrom } from 'rxjs';
import * as bcrypt from 'bcrypt';
import { ROLES } from 'src/enum/roles';
import Redis from 'ioredis';
import JWTClient from 'src/jwt/jwt';
import { generateKeyPairSync } from 'crypto';
import ImageKit from 'imagekit';

@Injectable()
export class AuthService {
  constructor(
    @Inject('OTP_KAFKA') private readonly kafka: ClientKafka,
    @Inject('PRISMA_CLIENT') private readonly prisma: PrismaClient,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    @Inject('JWT_CLIENT') private readonly jwtClient: JWTClient,
  ) {}

  async onModuleInit() {
    console.log('connecting to kafka...');
    await this.kafka.connect();
  }
  async signUp(email: string, password: string) {
    const otp = this.generateOtp();
    try {
      const otpToken = await this.prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({ where: { email } });
        if (user && user.user_verified) {
          throw new HttpException('User already exists', HttpStatus.CONFLICT);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await tx.user.upsert({
          where: { email },
          update: {
            otp,
            otp_expiry: new Date(Date.now() + 60 * 1000),
            otp_verified: false,
            otp_attempts: user ? user.otp_attempts + 1 : 0,
            password: hashedPassword,
          },
          create: {
            email,
            role: ROLES.GUEST,
            otp,
            otp_expiry: new Date(Date.now() + 5 * 60 * 1000),
            password: hashedPassword,
          },
        });

        const tokenOtp = await bcrypt.hash(email, 10);
        const ttl = 60;
        const key = `otp:email:${tokenOtp}`;
        await this.redis.set(key, tokenOtp, 'EX', ttl);

        await lastValueFrom(
          this.kafka.emit('otp.send', {
            email,
            otp,
            ts: new Date().toISOString(),
          }),
        );

        return tokenOtp;
      });
      return { otpToken: otpToken };
    } catch (error) {
      console.log(error);
      const errorMessage =
        error instanceof HttpException ? error.getResponse() : error.message;
      const status =
        error instanceof HttpException
          ? error.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
      throw new HttpException(errorMessage, status);
    }
  }

  generateOtp(): string {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp + '';
  }
  /**
   * Send OTP via Kafka (fire-and-forget)
   * Topic: "otp.send"
   * Payload: { email, otp, ts }
   */
  async verifyOtp(email: string, otp: string) {
    if (!email) {
      throw new HttpException('Email invalid', HttpStatus.BAD_REQUEST);
    }

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (!user.otp || !user.otp_expiry) {
      throw new HttpException(
        'No OTP found. Please request a new one.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (user.otp_expiry < new Date()) {
      throw new HttpException('OTP expired', HttpStatus.BAD_REQUEST);
    }

    if (user.otp_attempts >= 3) {
      throw new HttpException('OTP attempts exceeded', HttpStatus.BAD_REQUEST);
    }
    if (user.otp !== otp) {
      await this.prisma.user.update({
        where: { email },
        data: { otp_attempts: { increment: 1 } },
      });
      throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
    }

    await this.prisma.user.update({
      where: { email },
      data: {
        otp_verified: true,
        otp: null,
        otp_expiry: null,
        otp_attempts: 0,
        role: ROLES.STUDENT,
        user_verified: true,
      },
    });
    return { message: 'OTP verified successfully.' };
  }

  async getTTL(tokenEmail: string) {
    const ttl = await this.redis.ttl(`otp:email:${tokenEmail}`);
    if (ttl === -2) {
      throw new HttpException('Token not found', 404);
    }
    if (ttl === -1) {
      throw new HttpException('Token has no expiration', 400);
    }
    return { ttl: ttl };
  }

  async signIn(email: string, passwordReq: string) {
    const userExists = await this.prisma.user.findUnique({ where: { email } });
    if (!userExists) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isMatched = await bcrypt.compare(passwordReq, userExists.password);
    if (!isMatched) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    if (!userExists.user_verified) {
      throw new HttpException(
        'Email has been registered but not verified, please verify',
        HttpStatus.CONFLICT,
      );
    }

    const privateKey = process.env.JWT_PRIVATE_KEY?.replace(/\\n/g, '\n') || '';

    const { accessToken, refreshToken } = await this.jwtClient.createTokenPair(
      privateKey,
      { id: userExists.id },
    );

    if (!accessToken || !refreshToken) {
      throw new HttpException('Create token failed', HttpStatus.BAD_REQUEST);
    }

    const {
      password,
      otp,
      otp_expiry,
      otp_verified,
      otp_attempts,
      ...safeUser
    } = userExists;

    return {
      accessToken,
      refreshToken,
      user: safeUser,
    };
  }

  getSignature() {
    const imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || '',
    });
    const signature = imagekit.getAuthenticationParameters();
    return signature;
  }

  async getRole(userId: string | undefined) {
    if (!userId) throw new BadRequestException('userId is required');

    try {
      const { role } = await this.prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: { role: true },
      });
      return role;
    } catch (e) {
      throw new NotFoundException('User not found');
    }
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new HttpException('Refresh token is required', 401);
    }
    const publicKey = process.env.JWT_PUBLIC_KEY?.replace(/\\n/g, '\n') || '';
    const privateKey = process.env.JWT_PRIVATE_KEY?.replace(/\\n/g, '\n') || '';
    const payload = await this.jwtClient.verifyToken(refreshToken, publicKey);
    if (!payload) {
      throw new HttpException('Invalid refresh token', 401);
    }
    const { accessToken, refreshToken: newRefreshToken } =
      await this.jwtClient.createTokenPair(privateKey, {
        id: (payload as any).id,
      });
    return { accessToken, refreshToken: newRefreshToken };
  }
}
