import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { PrismaClient } from 'generated/prisma';
import { lastValueFrom } from 'rxjs';
import * as bcrypt from 'bcrypt';
import { ROLES } from 'src/enum/roles';
@Injectable()
export class AuthService {
  constructor(
    @Inject('OTP_KAFKA') private readonly kafka: ClientKafka,
    @Inject('PRISMA_CLIENT') private readonly prisma: PrismaClient, // Assuming PrismaClient is injected
  ) {}

  async onModuleInit() {
    console.log('connecting to kafka...');
    await this.kafka.connect();
  }
  async signUp(email: string, password: string) {
    const otp = this.generateOtp();

    try {
      await this.prisma.$transaction(async (tx) => {
        const user = await tx.users.findUnique({ where: { email } });
        console.log(user);
        if (user && user.user_verified) {
          console.log('cgrt');
          throw new HttpException('User already exists', HttpStatus.CONFLICT);
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await tx.users.upsert({
          where: { email },
          update: {
            otp,
            otp_expiry: new Date(Date.now() + 60 * 1000),
            otp_verified: false,
            otp_attempts: 0,
            password: hashedPassword,
          },
          create: {
            email,
            role_id: 1,
            otp,
            otp_expiry: new Date(Date.now() + 5 * 60 * 1000),
            password: hashedPassword,
          },
        });
      });

      const payload = { email, otp, ts: new Date().toISOString() };
      await lastValueFrom(this.kafka.emit('otp.send', payload));

      return {
        message: 'OTP sent successfully. Please check your email.',
      };
    } catch (error) {
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
    const user = await this.prisma.users.findUnique({ where: { email } });

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
      await this.prisma.users.update({
        where: { email },
        data: { otp_attempts: { increment: 1 } },
      });
      throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
    }
    const role = await this.prisma.roles.findUnique({
      where: {
        name: ROLES.STUDENT,
      },
    });
    console.log(role);
    // OTP hợp lệ
    await this.prisma.users.update({
      where: { email },
      data: {
        otp_verified: true,
        otp: null,
        otp_expiry: null,
        otp_attempts: 0,
        role_id: role?.role_id || 2,
        user_verified: true,
      },
    });
    return { message: 'OTP verified successfully.' };
  }

  signIn(email: string): string {
    // Find user by email
    const userExists = false;
    if (!userExists) {
      throw new HttpException('User not found', 404);
    }

    // send otp
    // verify otp

    // generate token

    //return token

    return `User with email ${email} signed up successfully.`;
  }
}
