import { Controller, Get, HttpCode, Post } from '@nestjs/common';
import { CourseService } from './course.service';

@Controller('courses')
export class CoursesController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  @HttpCode(200)
  getAllCourses() {
    console.log('clgt');
    return this.courseService.getAllCourses();
  }
}
