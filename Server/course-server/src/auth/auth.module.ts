import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { logLevel, Partitioners } from 'kafkajs';
import { DbModule } from 'src/db/db.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    DbModule,
    ClientsModule.register([
      {
        name: 'OTP_KAFKA',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'auth-service',
            brokers: ['localhost:9092'],
            logLevel: logLevel.INFO,
          },
          consumer: {
            groupId: 'auth-service-consumer',
            allowAutoTopicCreation: true, // Đọc cái message mới nhất từ topic
          },
          producer: {
            createPartitioner: Partitioners.LegacyPartitioner,
          },
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class AuthModule {}
