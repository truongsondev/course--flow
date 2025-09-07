import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { CoursesController } from './course.controller';
import { CourseService } from './course.service';

@Module({
  imports: [DbModule],
  controllers: [CoursesController],
  providers: [CourseService],
})
export class CourseModule {}
