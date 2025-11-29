import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class UsersController {
  constructor(private userService: UserService) {}

  @Get('profile/:userId')
  getUserProfile(@Param('userId') userId: string) {
    return this.userService.getUserProfile(userId);
  }

  @Patch('update-profile/:id')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateUser(
    @Param('id') id: string,
    @UploadedFile() avatar: Express.Multer.File,
    @Body() body: { email?: string; fullName?: string; bio?: string },
  ) {
    return this.userService.updateUserProfile(id, body, avatar);
  }

  @Get('student/:instructorId')
  async getStudent(@Param('instructorId') instructorId: string) {
    return this.userService.getStudentsOfInstructor(instructorId || '');
  }

  @Get('chat-user/:id')
  async getUserChat(@Param('id') id: string) {
    return this.userService.getUserChat(id);
  }

  @Get('become-intructor/:userId')
  async becomeInstructor(@Param('userId') userId: string) {
    return this.userService.becomeInstructor(userId);
  }

  @Post('auth/forget-password')
  async forgetPassword(@Body() body: { email: string }) {
    return this.userService.forgetPassword(body.email);
  }

  @Post('auth/reset-password')
  async resetPassword(
    @Body() body: { userId: string; oldPassword: string; newPassword: string },
  ) {
    return this.userService.resetPassword(
      body.userId,
      body.newPassword,
      body.oldPassword,
    );
  }
}
