import { Injectable } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_PUBLIC_KEY?.replace(/\\n/g, '\n'),
    });
  }

  async validate(payload: any) {
    return { userId: payload.id };
  }
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
