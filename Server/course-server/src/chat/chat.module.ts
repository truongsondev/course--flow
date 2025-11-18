import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { DbModule } from 'src/db/db.module';
import { ChatGateway } from 'src/socket/events.gateway';

@Module({
  imports: [DbModule],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  exports: [ChatService],
})
export class ChatModule {}
