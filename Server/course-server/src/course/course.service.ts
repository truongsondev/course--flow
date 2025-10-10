import { HttpException, Inject } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { CreateCourseDto } from 'src/dto/request/course/course.request.dto';
import { CourseEditResponse } from 'src/dto/response/course-edit-response';
import { MinioService } from 'src/minio/minio.service';
export class CourseService {
  constructor(
    @Inject('PRISMA_CLIENT') private readonly prisma: PrismaClient,
    private readonly minioService: MinioService,
  ) {}
  async getAllCourses() {
    try {
      const courses = await this.prisma.$queryRaw<any[]>`
        SELECT 
          c.id,
          c.title,
          c.price,
          c.videoUrl,
          c.thumbnailUrl,
          c.status,
          c.createdAt,
          CAST(COUNT(DISTINCT e.id) AS SIGNED INT) AS students,
          COALESCE(AVG(r.rating), 0) AS avgRating
        FROM courses c
        JOIN users u ON u.id = c.instructorId
        LEFT JOIN enrollments e ON e.courseId = c.id
        LEFT JOIN reviews r ON r.courseId = c.id
        GROUP BY c.id
        ORDER BY c.id;
      `;
      if (!courses) {
        throw new HttpException('No courses found', 404);
      }

      const formatted = courses.map((c: any) => ({
        ...c,
        students: Number(c.students),
        avgRating: Number(c.avgRating) === 0 ? 5 : Number(c.avgRating),
      }));
      return formatted;
    } catch (error) {
      console.log('error::::', error);
      throw new HttpException('Failed to fetch courses', 500);
    }
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

  async getCourseForEdit(courseId: string): Promise<CourseEditResponse> {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        category: true,
        requirements: true,
        sessions: {
          include: {
            lessons: true,
          },
          orderBy: {
            position: 'asc',
          },
        },
      },
    });

    if (!course) {
      throw new HttpException('Course not found', 404);
    }

    const result: CourseEditResponse = {
      id: course.id,
      title: course.title || '',
      description: course.description || '',
      price: course.price || 0,
      thumbnailUrl: course.thumbnailUrl || '',
      videoUrl: course.videoUrl || '',
      requirements: course.requirements.map((r) => r.text),
      sessions: course.sessions.map((s) => ({
        id: s.id,
        title: s.title,
        position: s.position,
        lessons: s.lessons.map((l) => ({
          id: l.id,
          title: l.title,
          doc_url: l.docUrl || '',
          video_url: l.videoUrl || '',
          position: l.position,
        })),
      })),
      status: course.status as 'published' | 'paused' | 'draft',
      category: {
        id: course.category?.id ?? '',
        name: course.category?.name ?? '',
      },
    };

    return result;
  }
  private attachFilesToMeta(meta: any, uploadedUrls: any[]) {
    const clone = structuredClone(meta);

    uploadedUrls.forEach(({ field, url }) => {
      const match = field.match(
        /^sessions\[(\d+)\]\[lessons\]\[(\d+)\]\[(video|doc)\]$/,
      );

      if (match) {
        const [_, i, j, type] = match.map((x) =>
          Number.isNaN(Number(x)) ? x : Number(x),
        );

        clone.sessions = clone.sessions || [];
        clone.sessions[i] = clone.sessions[i] || { lessons: [] };
        clone.sessions[i].lessons = clone.sessions[i].lessons || [];
        clone.sessions[i].lessons[j] = clone.sessions[i].lessons[j] || {};

        clone.sessions[i].lessons[j][`${type}_url`] = url;
      } else if (field === 'videoUrl') {
        clone.videoUrl = url;
      } else if (field === 'thumbnailUrl') {
        clone.thumbnailUrl = url;
      }
    });

    return clone;
  }

  async createCourse(files: Express.Multer.File[], meta: any) {
    const uploadedUrls = await Promise.all(
      files.map(async (file) => {
        const objectName = await this.minioService.uploadFile(
          'course-files',
          file,
        );

        const url = await this.minioService.getPresignedUrl(
          'course-files',
          objectName,
          3600 * 24 * 7,
        );
        return { field: file.fieldname, url };
      }),
    );

    // Gắn presigned URL vào meta
    const updatedMeta = this.attachFilesToMeta(meta, uploadedUrls);

    // Tạo course trong DB
    const course = await this.prisma.course.create({
      data: {
        title: updatedMeta.title,
        description: updatedMeta.description,
        categoryId: updatedMeta.category_id,
        instructorId: updatedMeta.instructorId,
        price: updatedMeta.price,
        thumbnailUrl: updatedMeta.thumbnailUrl,
        videoUrl: updatedMeta.videoUrl,
        status: updatedMeta.status,
        requirements: {
          create: (updatedMeta.requirements ?? []).map((req) => ({
            text: req,
          })),
        },
        sessions: {
          create: (updatedMeta.sessions ?? []).map((s) => ({
            title: s.title,
            position: s.position,
            lessons: {
              create: (s.lessons ?? []).map((l) => ({
                title: l.title,
                position: l.position,
                docUrl: l.doc_url,
                videoUrl: l.video_url,
              })),
            },
          })),
        },
      },
      include: {
        requirements: true,
        sessions: { include: { lessons: true } },
      },
    });

    if (!course) {
      throw new HttpException('Course creation failed', 500);
    }

    return course;
  }
}
