import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { OTPModule } from './kafka/otp.module';
import { DbModule } from './db/db.module';
import { JwtModule } from './jwt/jwt.module';
import { RedisModule } from './redis/redis.module';
import { CourseModule } from './course/course.module';

@Module({
  imports: [
    AuthModule,
    OTPModule,
    DbModule,
    JwtModule,
    RedisModule,
    CourseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
