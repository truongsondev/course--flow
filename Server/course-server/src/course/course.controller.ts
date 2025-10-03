import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from 'src/dto/request/course/course.request.dto';

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

  @Post('create-course')
  @HttpCode(201)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  createCourse(@Body() courseData: CreateCourseDto) {
    return this.courseService.createCourse(courseData);
  }
}
