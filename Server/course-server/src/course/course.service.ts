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

    const updatedMeta = this.attachFilesToMeta(meta, uploadedUrls);

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

  async editCourse(meta: any, files: any): Promise<any> {
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
    console.log(meta);
    const updatedMeta = this.attachFilesToMeta(meta, uploadedUrls);

    const existingCourse = await this.prisma.course.findUnique({
      where: { id: meta.idCourse },
      include: {
        sessions: { include: { lessons: true } },
        requirements: true,
      },
    });

    if (!existingCourse) {
      throw new HttpException('Course not found', 404);
    }

    await this.prisma.courseRequirement.deleteMany({
      where: {
        courseId: meta.idCourse,
      },
    });
    await this.prisma.lesson.deleteMany({
      where: {
        session: { courseId: meta.idCourse },
      },
    });
    await this.prisma.session.deleteMany({
      where: { courseId: meta.idCourse },
    });

    const updatedCourse = await this.prisma.course.update({
      where: { id: meta.idCourse },
      data: {
        title: updatedMeta.title,
        description: updatedMeta.description,
        categoryId: updatedMeta.category_id,
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
        category: true,
        requirements: true,
        sessions: { include: { lessons: true } },
      },
    });

    return updatedCourse;
  }

  async addReview(
    userId: string,
    courseId: string,
    rating: number,
    comment?: string,
  ) {
    try {
      const course = await this.prisma.course.findUnique({
        where: { id: courseId },
      });
      if (!course) {
        throw new Error('Course not found!');
      }

      const enrolled = await this.prisma.enrollment.findFirst({
        where: { userId, courseId },
      });

      if (!enrolled) {
        throw new Error('You must enrolling before review');
      }

      const existingReview = await this.prisma.review.findFirst({
        where: { userId, courseId },
      });

      if (existingReview) {
        if (rating < 1 || rating > 5) {
          throw new Error('Point must be between 1 to 5');
        }

        const updated = await this.prisma.review.update({
          where: { id: existingReview.id },
          data: { rating, comment, updatedAt: new Date() },
        });

        return { message: 'Review success', data: updated };
      } else {
        if (rating < 1) {
          rating = 1;
        } else if (rating > 5) {
          rating = 5;
        }

        const review = await this.prisma.review.create({
          data: {
            userId,
            courseId,
            rating,
            comment: comment,
          },
        });

        return { message: 'Review success', data: review };
      }
    } catch (error) {
      console.error('Lỗi khi thêm đánh giá:', error);
      throw new Error(error.message || 'Error when reviewing!');
    }
  }

  async updateProgress(userId: string, courseId: string, lessonId: string) {
    try {
      const course = await this.prisma.course.findUnique({
        where: { id: courseId },
        include: { sessions: { include: { lessons: true } } },
      });

      if (!course) {
        throw new Error('Course not found!');
      }

      const enrollment = await this.prisma.enrollment.findFirst({
        where: { userId, courseId },
      });

      if (!enrollment) {
        throw new Error('You must enroll before tracking progress!');
      }

      const lessonFound = course.sessions
        .flatMap((s) => s.lessons)
        .find((l) => l.id === lessonId);

      if (!lessonFound) {
        throw new Error('Invalid lesson or it does not belong to this course!');
      }

      const totalLessons = course.sessions.reduce(
        (sum, s) => sum + s.lessons.length,
        0,
      );

      if (totalLessons === 0) {
        throw new Error('This course does not have any lessons yet!');
      }

      let progress = await this.prisma.courseProgress.findFirst({
        where: { userId, courseId },
      });

      let completedLessons = 0;

      if (!progress) {
        progress = await this.prisma.courseProgress.create({
          data: {
            userId,
            courseId,
            lastLessonId: lessonId,
            progressPercentage: 0,
          },
        });
      }

      if (progress.lastLessonId === lessonId) {
        return { message: 'You have already completed this lesson!' };
      } else {
        const completed = await this.prisma.courseNote.findMany({
          where: { userId, courseId },
        });

        completedLessons = completed.length;
        const newProgress = ((completedLessons + 1) / totalLessons) * 100;

        let progressPercentage = newProgress;
        if (progressPercentage > 100) {
          progressPercentage = 100;
        } else if (progressPercentage < 0) {
          progressPercentage = 0;
        }

        const updatedProgress = await this.prisma.courseProgress.update({
          where: { id: progress.id },
          data: {
            lastLessonId: lessonId,
            progressPercentage: progressPercentage,
            updatedAt: new Date(),
          },
        });

        if (progressPercentage === 100) {
          return {
            message: 'Congratulations! You have completed the course!',
            progress: updatedProgress,
          };
        } else if (progressPercentage > 80) {
          return {
            message: 'Almost there! Keep going, you are close to finishing!',
            progress: updatedProgress,
          };
        } else if (progressPercentage > 50) {
          return {
            message: 'You are more than halfway through the course!',
            progress: updatedProgress,
          };
        } else if (progressPercentage > 25) {
          return {
            message: 'Good job! You are making great progress!',
            progress: updatedProgress,
          };
        } else {
          return {
            message: 'You just got started, keep learning!',
            progress: updatedProgress,
          };
        }
      }
    } catch (error) {
      console.error('Error while updating progress:', error);
      throw new Error(error.message || 'Failed to update progress!');
    }
  }
}
