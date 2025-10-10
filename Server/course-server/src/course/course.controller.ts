import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller()
export class CoursesController {
  constructor(private readonly courseService: CourseService) {}

  @Get('courses')
  @HttpCode(200)
  getAllCourses() {
    try {
      return this.courseService.getAllCourses();
    } catch (error) {
      console.log(error);
    }
  }

  @Get('categories')
  @HttpCode(200)
  getAllCategories() {
    return this.courseService.getAllCategories();
  }

  @Post('create-course')
  @HttpCode(201)
  @UseInterceptors(AnyFilesInterceptor())
  async createCourse(
    @Body() courseData: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const meta = JSON.parse(courseData.meta);

    // Upload all files

    // Lưu vào DB (service của bạn)
    await this.courseService.createCourse(files, meta);

    return { message: 'Course created' };
  }

  @Get('course-for-edit/:courseId')
  @HttpCode(200)
  getCourseForEdit(@Param('courseId') courseId: string) {
    return this.courseService.getCourseForEdit(courseId);
  }
}
