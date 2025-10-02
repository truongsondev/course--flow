import { Controller, Get, HttpCode, Post } from '@nestjs/common';
import { CourseService } from './course.service';

@Controller()
export class CoursesController {
  constructor(private readonly courseService: CourseService) {}

  @Get('courses')
  @HttpCode(200)
  getAllCourses() {
    console.log('clgt');
    return this.courseService.getAllCourses();
  }

  @Get('categories')
  @HttpCode(200)
  getAllCategories() {
    return this.courseService.getAllCategories();
  }
}
