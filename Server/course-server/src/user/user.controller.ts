import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
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
}
