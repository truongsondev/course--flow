import { HttpException, Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { ChatGateway } from 'src/socket/events.gateway';

export interface ChatInfor {
  id: string;
  message: string;
  fromUserId: string;
  sentAt: Date;
  full_name?: string;
  avt_url?: string;
}

@Injectable()
export class ChatService {
  constructor(
    @Inject('PRISMA_CLIENT') private readonly prisma: PrismaClient,
    private readonly chatGateway: ChatGateway,
  ) {}

  // ============================
  // SEND MESSAGE
  // ============================
  async sendMessage(
    instructorId: string,
    studentId: string,
    message: string,
    fromUserId: string,
  ) {
    if (!message.trim()) return;

    const saved = await this.prisma.instructorMsg.create({
      data: {
        instructorId,
        studentId,
        message,
        fromUserId,
      },
    });

    // realtime
    this.chatGateway.sendToUser(studentId, {
      id: saved.id,
      message: saved.message,
      fromUserId: saved.fromUserId,
      sentAt: saved.sentAt,
    });

    return saved;
  }

  // ============================
  // LẤY LỊCH SỬ CHAT GIỮA 2 USER
  // ============================
  async getAllMessages(
    instructorId: string,
    studentId: string,
  ): Promise<ChatInfor[]> {
    if (!instructorId || !studentId) {
      throw new HttpException('Invalid user or instructor', 400);
    }

    const msgs = await this.prisma.instructorMsg.findMany({
      where: {
        instructorId,
        studentId,
      },
      orderBy: {
        sentAt: 'asc', // phải ASC để chat hiển thị đúng thứ tự
      },
      include: {
        student: true,
      },
    });

    return msgs.map((m) => ({
      id: m.id,
      message: m.message,
      fromUserId: m.fromUserId,
      sentAt: m.sentAt,
      full_name: m.student.full_name ?? '',
      avt_url: m.student.avt_url ?? '',
    }));
  }

  // ============================
  // LẤY DANH SÁCH CUỘC CHAT MỚI NHẤT
  // ============================
  async getAllChat(instructorId: string): Promise<ChatInfor[]> {
    if (!instructorId) {
      throw new HttpException('Invalid user', 400);
    }

    const msgs = await this.prisma.instructorMsg.findMany({
      where: { instructorId },
      orderBy: { sentAt: 'desc' },
      include: { student: true },
    });

    const map = new Map<string, ChatInfor>();

    for (const m of msgs) {
      if (!map.has(m.studentId)) {
        map.set(m.studentId, {
          id: m.id,
          message: m.message,
          fromUserId: m.fromUserId,
          sentAt: m.sentAt,
          full_name: m.student.full_name ?? '',
          avt_url: m.student.avt_url ?? '',
        });
      }
    }

    return Array.from(map.values());
  }
}
