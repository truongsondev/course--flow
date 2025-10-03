import { HttpException, Inject } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { CreateCourseDto } from 'src/dto/request/course/course.request.dto';

export class CourseService {
  constructor(@Inject('PRISMA_CLIENT') private readonly prisma: PrismaClient) {}
  async getAllCourses() {
    const courses = await this.prisma.$queryRaw`
    SELECT 
      c.*, 
      u.name,
      COALESCE(AVG(cr.rating), 0) AS avg_rating
    FROM courses c
    JOIN users u ON u.user_id = c.user_id
    LEFT JOIN courses_review cr ON cr.course_id = c.course_id
    GROUP BY c.course_id, u.name
    ORDER BY c.course_id;
  `;
    console.log(courses);

    return courses;
  }

  async getAllCategories() {
    const categories = await this.prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return categories;
  }

  async createCourse(courseData: CreateCourseDto) {
    // const course = await this.prisma.course.create({
    //   data: {
    //     title: courseData.title,
    //     description: courseData.description,
    //     categoryId: courseData.category_id,
    //     price: courseData.price,
    //     thumbnailUrl: courseData.thumbnailUrl,
    //     videoUrl: courseData.videoUrl,
    //     status: courseData.status,
    //     requirements: {
    //       create: (courseData.requirements ?? []).map((req) => ({
    //         text: req,
    //       })),
    //     },
    //     sessions: {
    //       create: courseData.sessions.map((s) => ({
    //         title: s.title,
    //         position: s.position,
    //         lessons: {
    //           create: s.lessons.map((l) => ({
    //             title: l.title,
    //             position: l.position,
    //             doc_url: l.doc_url,
    //             video_url: l.video_url,
    //           })),
    //         },
    //       })),
    //     },
    //   },
    //   include: {
    //     requirements: true,
    //     sessions: {
    //       include: { lessons: true },
    //     },
    //   },
    // });
  }
}
