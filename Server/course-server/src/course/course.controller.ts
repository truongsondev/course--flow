import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CourseReview } from 'src/dto/request/course/course.review.dto';
import { CreateNoteDto } from 'src/dto/request/course/course-note.request.dto';
import { JwtAuthGuard } from 'src/guards/auth/jwt-strategy.guard';

@Controller()
export class CoursesController {
  constructor(private readonly courseService: CourseService) {}

  @Get('categories')
  @HttpCode(200)
  getAllCategories() {
    return this.courseService.getAllCategories();
  }

  @Post('create-course')
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  getCourseForEdit(@Param('courseId') courseId: string) {
    return this.courseService.getCourseForEdit(courseId);
  }

  @Get('courses/:instructorId')
  @HttpCode(200)
  getAllCoursesForInstructor(@Param('instructorId') instructorId: string) {
    try {
      return this.courseService.getAllCoursesForInstructor(instructorId);
    } catch (error) {
      console.log(error);
    }
  }

  @Get('course/home/:limit/:pageNumber')
  @HttpCode(200)
  getCourseForHome(
    @Param('limit') limit: number,
    @Param('pageNumber') pageNumber: number,
  ) {
    return this.courseService.getAllCourses(limit, pageNumber);
  }

  @Get('course-detail/:courseId/:userId')
  @HttpCode(200)
  getCourse(
    @Param('courseId') courseId: string,
    @Param('userId') userId?: string,
  ) {
    return this.courseService.getCourseDetail(courseId, userId);
  }

  @Get('review/:courseId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  getReivew(@Param('courseId') courseId: string) {
    return this.courseService.getReview(courseId);
  }

  @Get('course-watch/:courseId/:userId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  getCourseForWatch(
    @Param('courseId') courseId: string,
    @Param('userId') userId: string,
  ) {
    return this.courseService.getCourseForWatch(courseId, userId);
  }

  @Put('course-edit')
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  reviewCourse(@Body() reviewInfor: CourseReview) {
    const { courseId, userId, rating, comment } = { ...reviewInfor };
    return this.courseService.addReview(userId, courseId, rating, comment);
  }

  @Post('create-note')
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  createNote(@Body() body: CreateNoteDto) {
    const { userId, courseId, noteData, noteId } = body;
    return this.courseService.createNote(userId, courseId, noteData, noteId);
  }

  @Patch('mark-done-lecture')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  markLectureCompleted(@Body('lessionId') lessionId: string) {
    console.log('lessionId::', lessionId);
    return this.courseService.markLectureCompleted(lessionId);
  }

  @Get('search-courses')
  @HttpCode(200)
  searchCourses(@Query('query') query: string) {
    return this.courseService.searchCourses(query);
  }

  @Get('my-courses/:userId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  getMyCourses(
    @Param('userId') userId: string,
    @Query('limit') limit?: number,
    @Query('c') c?: string,
  ) {
    return this.courseService.getMyCourses(userId, { limit, c });
  }

  @Get('dashboard/:id')
  async getDashboard(@Param('id') id: string) {
    const stats = await this.courseService.getDashboardStats(id);
    const performance = await this.courseService.getCoursePerformance(id);
    const activity = await this.courseService.getRecentActivity(id);

    return {
      stats,
      performance,
      activity,
    };
  }
}
