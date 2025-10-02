import { HttpException, Inject } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';

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
}
