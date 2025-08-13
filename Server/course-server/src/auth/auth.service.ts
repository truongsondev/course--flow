import { HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  signUp(email: string): string {
    // Find user by email
    const userExists = false;
    if (!userExists) {
      throw new HttpException('User not found', 404);
    }
    // sendOtp
    this.sendOtp(email, this.generateOtp(email));
    return `User with email ${email} signed up successfully.`;
  }

  generateOtp(email: string): string {
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log(`Generated OTP for ${email}: ${otp}`);
    return otp + '';
  }

  sendOtp(email: string, opt: string) {
    // send otp
  }

  signIn(email: string): string {
    // Find user by email
    const userExists = false;
    if (!userExists) {
      throw new HttpException('User not found', 404);
    }

    // send otp
    this.sendOtp(email, this.generateOtp(email));
    // verify otp

    // generate token

    //return token

    return `User with email ${email} signed up successfully.`;
  }
}
