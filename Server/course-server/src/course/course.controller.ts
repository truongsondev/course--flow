import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CourseReview } from 'src/dto/request/course/course.review.dto';

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

    await this.courseService.createCourse(files, meta);

    return { message: 'Course created' };
  }

  @Get('course-for-edit/:courseId')
  @HttpCode(200)
  getCourseForEdit(@Param('courseId') courseId: string) {
    return this.courseService.getCourseForEdit(courseId);
  }

  @Put('course-edit')
  @HttpCode(200)
  @UseInterceptors(AnyFilesInterceptor())
  editCourse(
    @Body() course: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log(course);
    const meta = JSON.parse(course.meta);
    return this.courseService.editCourse(meta, files);
  }

  @Post('review-course')
  @HttpCode(200)
  reviewCourse(@Body() reviewInfor: CourseReview) {
    const { courseId, userId, rating, comment } = { ...reviewInfor };
    return this.courseService.addReview(userId, courseId, rating, comment);
  }
}
