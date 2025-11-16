import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(3001, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Map userId -> socketId
  private userSockets = new Map<string, string>();

  handleConnection(client: Socket) {
    console.log(`Socket Connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) {
        this.userSockets.delete(userId);
        console.log(`User ${userId} disconnected`);
      }
    }
  }

  @SubscribeMessage('register')
  register(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
    if (!userId) return;

    this.userSockets.set(userId, client.id);

    console.log(`User ${userId} registered with socket ${client.id}`);
  }

  // Hàm server gọi để gửi realtime
  sendToUser(userId: string, payload: any) {
    const socketId = this.userSockets.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('receiveMessage', payload);
    } else {
      console.log(`⚠ User ${userId} offline → only saved to DB`);
    }
  }
}
