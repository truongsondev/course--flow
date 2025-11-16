import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('chat-list/:id')
  async getAllChat(@Param('id') id: string) {
    return await this.chatService.getAllChat(id);
  }

  @Get('messages/:instructorId/:studentId')
  async getChatMessages(
    @Param('instructorId') instructorId: string,
    @Param('studentId') studentId: string,
  ) {
    return await this.chatService.getAllMessages(instructorId, studentId);
  }

  @Post('send')
  sendMessage(@Body() body: any) {
    return this.chatService.sendMessage(
      body.instructorId,
      body.studentId,
      body.message,
      body.fromUserId,
    );
  }
}
