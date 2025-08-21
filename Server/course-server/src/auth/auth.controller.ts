import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { VerifyOtpDto } from 'src/dto/verify-otp.dto';
import { UserAuthDTO } from 'src/dto/user-auth.dto';
import { OtpTokenGuard } from 'src/guards/otp-token/otp-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  signUp(@Body() data: UserAuthDTO) {
    const { email, password } = data;
    console.log(email);
    return this.authService.signUp(email, password);
  }

  @Post('verify-otp')
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  verifyOtp(@Body() data: VerifyOtpDto) {
    const { email, otp } = data;
    return this.authService.verifyOtp(email, otp);
  }

  @Get('get-ttl')
  @UseGuards(OtpTokenGuard)
  getTTL(@Query('emailToken') emailToken: string) {
    return this.authService.getTTL(emailToken);
  }

  @Post('signin')
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  signIn(@Body() data: UserAuthDTO) {
    const { email, password } = data;
    console.log(email);
    return this.authService.signIn(email, password);
  }
}
