import { Module } from '@nestjs/common';

import { DbModule } from 'src/db/db.module';
import { UsersController } from './user.controller';
import { UserService } from './user.service';
import { UploadModule } from 'src/minio/minio.module';
import { MinioService } from 'src/minio/minio.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { logLevel, Partitioners } from 'kafkajs';

@Module({
  imports: [
    DbModule,
    UploadModule,
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
  controllers: [UsersController],
  providers: [UserService, MinioService],
})
export class UserModule {}
