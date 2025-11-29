import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { DbModule } from 'src/db/db.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { logLevel, Partitioners } from 'kafkajs';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
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
            allowAutoTopicCreation: true,
          },
          producer: {
            createPartitioner: Partitioners.LegacyPartitioner,
          },
        },
      },
    ]),
  ],
})
export class PaymentModule {}
