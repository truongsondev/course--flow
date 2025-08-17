import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(201)
  signIn(@Body() data: { email: string; password: string }) {
    const { email, password } = data;
    return this.authService.signUp(email, password);
  }

  @Post('verify-otp')
  @HttpCode(200)
  verifyOtp(@Body() data: { email: string; otp: string }) {
    const { email, otp } = data;
    return this.authService.verifyOtp(email, otp);
  }
}
