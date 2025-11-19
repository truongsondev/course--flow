import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from 'src/chat/chat.service';

@WebSocketGateway(3001, {
  cors: { origin: 'http://localhost:5173' },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  private userSockets = new Map<string, string>();

  constructor(private chatService: ChatService) {}

  @SubscribeMessage('register')
  register(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
    if (!userId) return;
    this.userSockets.set(userId, client.id);
    console.log('Registered:', userId, client.id);
  }

  @SubscribeMessage('sendMessage')
  async handleSend(@MessageBody() data: any) {
    const { fromUserId, toUserId, message } = data;
    const savedMessage = await this.chatService.sendMessage(
      fromUserId,
      toUserId,
      message,
    );

    // realtime
    this.sendToUser(toUserId, savedMessage);
  }

  @SubscribeMessage('seenMessage')
  async seenMessage(@MessageBody() body: any) {
    const { messageId, byUser } = body;

    const updated = await this.chatService.markAsSeen(messageId);

    const senderSocket = this.userSockets.get(updated.fromUserId);
    if (senderSocket) {
      this.server
        .to(senderSocket)
        .emit('messageSeen', { messageId, seenAt: updated.seenAt });
    }
  }

  // giúp component khác gọi trực tiếp
  sendToUser(userId: string, payload: any) {
    const socketId = this.userSockets.get(userId);
    if (socketId) {
      console.log('Chỗ này gọi');
      this.server.to(socketId).emit('receiveMessage', payload);
    }
  }
}
