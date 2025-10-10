import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { CoursesController } from './course.controller';
import { CourseService } from './course.service';
import { MinioService } from 'src/minio/minio.service';

@Module({
  imports: [DbModule],
  controllers: [CoursesController],
  providers: [CourseService, MinioService],
})
export class CourseModule {}
