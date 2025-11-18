import { HttpException, Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { ChatGateway } from 'src/socket/events.gateway';

export interface ChatInfor {
  id: string;
  content: string;
  fromUserId: string;
  toUserId: string;
  sentAt: Date;
  full_name?: string;
  avt_url?: string;
}

@Injectable()
export class ChatService {
  constructor(@Inject('PRISMA_CLIENT') private readonly prisma: PrismaClient) {}

  async markAsSeen(messageId: string) {
    return this.prisma.chatMessage.update({
      where: { id: messageId },
      data: { seen: true, seenAt: new Date() },
    });
  }

  async sendMessage(fromUserId: string, toUserId: string, content: string) {
    if (!content.trim()) return;
    const saved = await this.prisma.chatMessage.create({
      data: {
        fromUserId,
        toUserId,
        content,
      },
      include: {
        fromUser: true,
        toUser: true,
      },
    });

    return saved;
  }

  async getAllMessages(userA: string, userB: string): Promise<ChatInfor[]> {
    if (!userA || !userB) {
      throw new HttpException('Invalid users', 400);
    }

    const msgs = await this.prisma.chatMessage.findMany({
      where: {
        OR: [
          { fromUserId: userA, toUserId: userB },
          { fromUserId: userB, toUserId: userA },
        ],
      },
      orderBy: { sentAt: 'asc' },
      include: {
        fromUser: true,
      },
    });

    return msgs.map((m) => ({
      id: m.id,
      content: m.content,
      fromUserId: m.fromUserId,
      toUserId: m.toUserId,
      sentAt: m.sentAt,
      full_name: m.fromUser.full_name ?? '',
      avt_url: m.fromUser.avt_url ?? '',
    }));
  }

  async getAllChat(userId: string): Promise<ChatInfor[]> {
    if (!userId) throw new HttpException('Invalid user', 400);

    const msgs = await this.prisma.chatMessage.findMany({
      where: {
        OR: [{ fromUserId: userId }, { toUserId: userId }],
      },
      orderBy: { sentAt: 'desc' },
      include: {
        fromUser: true,
        toUser: true,
      },
    });

    const lastChat = new Map<string, ChatInfor>();

    for (const m of msgs) {
      const otherId = m.fromUserId === userId ? m.toUserId : m.fromUserId;

      if (!lastChat.has(otherId)) {
        lastChat.set(otherId, {
          id: m.id,
          content: m.content,
          fromUserId: m.fromUserId,
          toUserId: m.toUserId,
          sentAt: m.sentAt,
          full_name:
            (m.fromUserId === userId ? m.toUser : m.fromUser).full_name ?? '',
          avt_url:
            (m.fromUserId === userId ? m.toUser : m.fromUser).avt_url ?? '',
        });
      }
    }

    return Array.from(lastChat.values());
  }
}
