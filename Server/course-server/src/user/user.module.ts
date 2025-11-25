import { Module } from '@nestjs/common';

import { DbModule } from 'src/db/db.module';
import { UsersController } from './user.controller';
import { UserService } from './user.service';
import { UploadModule } from 'src/minio/minio.module';
import { MinioService } from 'src/minio/minio.service';

@Module({
  imports: [DbModule, UploadModule],
  controllers: [UsersController],
  providers: [UserService, MinioService],
})
export class UserModule {}
