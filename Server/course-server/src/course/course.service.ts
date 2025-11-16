import { HttpException, Inject } from '@nestjs/common';
import e from 'express';
import { PrismaClient } from 'generated/prisma';
import { CourseEditResponse } from 'src/dto/response/course-edit-response';
import { ElasticService } from 'src/elasticsearch/elasticsearch.service';
import { MinioService } from 'src/minio/minio.service';
export class CourseService {
  constructor(
    @Inject('PRISMA_CLIENT') private readonly prisma: PrismaClient,
    private readonly minioService: MinioService,
    private readonly elastic: ElasticService,
  ) {}

  async indexCourse(course: any) {
    await this.elastic.index('courses', course.id, course);
  }
  async getAllCoursesForInstructor(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      // temperaty comment to code
      // if (user?.role !== 'instructor') {
      //   throw new HttpException('Access denied', 403);
      // }
      const courses = await this.prisma.course.findMany({
        where: {
          instructorId: user?.id || '',
        },
        select: {
          id: true,
          title: true,
          price: true,
          thumbnailUrl: true,
          videoUrl: true,
          requirements: true,
          sessions: true,
          createdAt: true,
          status: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // if (!courses || courses.length === 0) {
      //   throw new HttpException('No courses found', 404);
      // }
      return courses.map((c: any) => ({
        ...c,
        students: Number(c.students),
        avgRating: Number(c.avgRating) === 0 ? 5 : Number(c.avgRating),
      }));
    } catch (error) {
      console.error('error::::', error);
      throw new HttpException(
        error.message || 'Fail to fetch course',
        error.status || 500,
      );
    }
  }

  async searchCourses(keyword: string) {
    await this.elastic.ensureIndexExists('courses');
    const courseInElas = await this.elastic.search('courses', {
      multi_match: {
        query: keyword,
        fields: ['title', 'description', 'instructorName'],
        fuzziness: 'AUTO',
      },
    });
    if (!courseInElas || courseInElas.length <= 0) {
      const courseInDb = await this.prisma.course.findMany();
      if (courseInDb) {
        courseInDb.forEach((course) => {
          this.indexCourse(course);
        });
      }
      return courseInDb;
    }
    return courseInElas;
  }

  async getAllCourses(limit: number, page: number) {
    try {
      const safeLimit = Number(limit) > 0 ? Number(limit) : 10;
      const safePage = Number(page) > 0 ? Number(page) : 1;
      const offset = (safePage - 1) * safeLimit;

      const totalCoursesResult = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT COUNT(*) AS count FROM courses;
    `);
      const totalCourses = Number(totalCoursesResult[0]?.count || 0);
      const totalPages = Math.ceil(totalCourses / safeLimit);

      const courses = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT 
        c.id,
        c.title,
        c.price,
        c.thumbnailUrl,
        c.status,
        cr.name AS category,
        COUNT(DISTINCT e.id) AS students,
        COALESCE(AVG(r.rating), 0) AS avgRating
      FROM courses c
      JOIN users u ON u.id = c.instructorId
      LEFT JOIN categories cr ON cr.id = c.categoryId
      LEFT JOIN enrollments e ON e.courseId = c.id
      LEFT JOIN reviews r ON r.courseId = c.id
      GROUP BY c.id, cr.name
      ORDER BY c.id DESC
      LIMIT ${safeLimit} OFFSET ${offset};
    `);

      if (!courses || courses.length === 0) {
        throw new HttpException('No courses found', 404);
      }

      const formattedCourses = courses.map((c: any) => ({
        ...c,
        students: Number(c.students),
        avgRating: Number(c.avgRating) === 0 ? 5 : Number(c.avgRating),
      }));

      return {
        data: formattedCourses,
        meta: {
          page: safePage,
          limit: safeLimit,
          totalPages,
          totalCourses,
        },
      };
    } catch (error) {
      console.error('error::::', error);
      throw new HttpException('Failed to fetch courses', 500);
    }
  }

  async getReview(courseId: string) {
    const reviews = await this.prisma.review.findMany({
      where: {
        courseId: courseId,
      },
      include: {
        user: { select: { full_name: true } },
      },
    });
    return reviews;
  }
  async getCourseDetail(courseId: string, userId: string | undefined) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        instructor: { select: { full_name: true, id: true } },
        category: { select: { id: true, name: true } },
        requirements: { select: { text: true } },
        reviews: {
          select: {
            rating: true,
            comment: true,
            createdAt: true,
            user: { select: { full_name: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        enrollments: { select: { userId: true } },
        sessions: {
          include: {
            lessons: {
              select: {
                id: true,
                title: true,
                duration: true,
                videoUrl: true,
                docUrl: true,
                position: true,
              },
              orderBy: { position: 'asc' },
            },
          },
          orderBy: { position: 'asc' },
        },
      },
    });

    if (!course) throw new HttpException('Course not found', 404);

    const avgRating =
      course.reviews.length > 0
        ? course.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
          course.reviews.length
        : 0;

    const totalDuration = course.sessions.reduce((acc, session) => {
      const lessonSum = session.lessons.reduce(
        (sum, l) => sum + (l.duration || 0),
        0,
      );
      return acc + lessonSum;
    }, 0);

    const studentCount = course.enrollments.length;
    const isEnrolled =
      userId === undefined
        ? false
        : course.enrollments.some((e) => e.userId === userId);

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      instructorName: course.instructor.full_name,
      instructorId: course.instructor.id,
      thumbnailUrl: course.thumbnailUrl,
      videoUrl: course.videoUrl,
      price: course.price,
      requirements: course.requirements.map((r) => r.text),
      avgRating: Number(avgRating.toFixed(1)),
      studentCount,
      totalDuration,
      sessions: course.sessions.map((s) => ({
        id: s.id,
        title: s.title,
        position: s.position,
        lessons: s.lessons.map((l) => ({
          id: l.id,
          title: l.title,
          duration: l.duration || 0,
          videoUrl: l.videoUrl,
          docUrl: l.docUrl,
          position: l.position,
        })),
      })),

      isEnrolled,
      reviews: course.reviews.map((r) => ({
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt.toISOString(),
        user: { full_name: r.user.full_name },
      })),
      category: course.category
        ? { id: course.category.id, name: course.category.name }
        : null,
      createdAt: course.createdAt.toISOString(),
    };
  }

  async getCourseForWatch(courseId: string, userId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        description: true,
        sessions: {
          orderBy: { position: 'asc' },
          select: {
            id: true,
            title: true,
            position: true,
            lessons: {
              orderBy: { position: 'asc' },
              select: {
                id: true,
                title: true,
                videoUrl: true,
                docUrl: true,
                lessionStatus: true,
                duration: true,
                position: true,
              },
            },
          },
        },
      },
    });

    if (!course) return null;

    const enrollment = await this.prisma.enrollment.findFirst({
      where: {
        userId,
        courseId,
      },
    });

    const isEnrolled = !!enrollment;

    if (!isEnrolled) {
      return {
        ...course,
        isEnrolled: false,
        message: 'User chưa đăng ký khóa học này.',
      };
    }

    const note = await this.prisma.courseNote.findFirst({
      where: { userId, courseId },
      select: { id: true, note: true, createdAt: true },
    });

    const progress = await this.prisma.courseProgress.findFirst({
      where: { userId, courseId },
      select: {
        id: true,
        progressPercentage: true,
        lastLessonId: true,
        updatedAt: true,
      },
    });

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      sessions: course.sessions.map((s) => ({
        id: s.id,
        title: s.title,
        position: s.position,
        lessons: s.lessons.map((l) => ({
          id: l.id,
          title: l.title,
          videoUrl: l.videoUrl,
          docUrl: l.docUrl,
          lessionStatus: l.lessionStatus,
          duration: l.duration,
          position: l.position,
        })),
      })),
      isEnrolled: true,
      note: note || null,
      progress: progress
        ? {
            progressPercentage: Number(progress.progressPercentage),
            lastLessonId: progress.lastLessonId,
            updatedAt: progress.updatedAt,
          }
        : { progressPercentage: 0, lastLessonId: null },
    };
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
                duration: l.duration,
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
    this.indexCourse(course);
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

  async createNote(userId, courseId, note, noteId) {
    if (!userId || !courseId || !note?.trim()) {
      throw new HttpException('Invalid input data', 400);
    }
    const noteAvilable = await this.prisma.courseNote.findFirst({
      where: {
        id: noteId,
      },
    });
    if (noteAvilable) {
      const updatedNote = await this.prisma.courseNote.update({
        where: { id: noteId },
        data: { note: note.trim() },
      });
      return updatedNote;
    }

    const cleanNote = note.trim();

    const [user, course] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId } }),
      this.prisma.course.findUnique({ where: { id: courseId } }),
    ]);
    if (!user) throw new HttpException('User not found.', 404);
    if (!course) throw new HttpException('Course not found.', 404);

    const enrollment = await this.prisma.enrollment.findFirst({
      where: { userId, courseId },
    });
    if (!enrollment) {
      throw new HttpException(
        'User have not yet registed for this course',
        400,
      );
    }

    const newNote = await this.prisma.courseNote.create({
      data: {
        userId,
        courseId,
        note: cleanNote,
      },
    });

    return newNote;
  }

  async getCourseStatistics() {
    try {
      const courses = await this.prisma.course.findMany({
        include: {
          enrollments: true,
          instructor: { select: { full_name: true, email: true } },
        },
      });

      if (!courses || courses.length === 0) {
        return {
          message: 'No course in system.',
          totalCourses: 0,
          totalRevenue: 0,
          data: [],
        };
      }

      const data: {
        id: string;
        title: string;
        instructor: string;
        price: number;
        studentCount: number;
        revenue: number;
        status: string;
        createdAt: Date;
      }[] = [];

      let totalRevenue = 0;

      for (const course of courses) {
        let studentCount = 0;
        let revenue = 0;

        if (course.enrollments && course.enrollments.length > 0) {
          studentCount = course.enrollments.length;

          if (course.price && course.price > 0) {
            revenue = course.price * studentCount;
          } else {
            revenue = 0;
          }
        } else {
          studentCount = 0;
          revenue = 0;
        }

        if (course.status === 'draft') {
          continue;
        }

        totalRevenue += revenue;

        data.push({
          id: course.id,
          title: course.title,
          instructor: course.instructor?.full_name ?? 'Not update',
          price: course.price,
          studentCount,
          revenue,
          status: course.status,
          createdAt: course.createdAt,
        });
      }

      if (data.length === 0) {
        return {
          message: 'All course is draf state.',
          totalCourses: 0,
          totalRevenue: 0,
          data: [],
        };
      }

      return {
        totalCourses: data.length,
        totalRevenue,
        data,
      };
    } catch (error) {
      console.error('[CourseStatisticsService] error:', error);

      if (error.code === 'P1001') {
        throw new Error('No connect to database.');
      } else if (error.code === 'P2002') {
        throw new Error('duplicate or error unique key.');
      } else {
        throw new Error('External server.');
      }
    }
  }

  async completeLesson(userId: string, lessonId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        session: {
          include: { course: true },
        },
      },
    });

    if (!lesson) throw new Error('Lesson not found or delete.');

    const courseId = lesson.session.course.id;

    const enrolled = await this.prisma.enrollment.findFirst({
      where: { userId, courseId },
    });

    if (!enrolled)
      throw new Error('User have not yet registed for this course');

    const totalLessons = await this.prisma.lesson.count({
      where: { session: { courseId } },
    });

    if (totalLessons === 0) throw new Error('This course not yet lession');

    let progress = await this.prisma.courseProgress.findFirst({
      where: { userId, courseId },
    });

    if (!progress) {
      progress = await this.prisma.courseProgress.create({
        data: {
          userId,
          courseId,
          lastLessonId: lessonId,
          progressPercentage: new this.prisma.Decimal(0),
        },
      });
    }

    await this.prisma.lesson.update({
      where: { id: lessonId },
      data: { lessionStatus: true },
    });

    const completedCount = await this.prisma.lesson.count({
      where: {
        session: { courseId },
        lessionStatus: true,
      },
    });

    const percentage = (completedCount / totalLessons) * 100;

    const updated = await this.prisma.courseProgress.update({
      where: { id: progress.id },
      data: {
        lastLessonId: lessonId,
        progressPercentage: new this.prisma.Decimal(percentage.toFixed(2)),
        updatedAt: new Date(),
      },
    });

    if (updated) {
      throw new HttpException(
        'Progress have not yet updated, please try again!',
        400,
      );
    }

    return {
      message: `Lesson "${lesson.title}" finish course.`,
      progress: `${percentage.toFixed(2)}%`,
      lastLesson: lesson.title,
    };
  }

  async markLectureCompleted(idLecture: string) {
    console.log(idLecture);
    const lesson = await this.prisma.lesson.update({
      where: { id: idLecture },
      data: { lessionStatus: true },
    });
    if (!lesson) {
      throw new HttpException('Lesson not found', 404);
    }
    return lesson;
  }

  async getMyCourses(
    userId: string,
    { limit, c }: { limit?: number; c?: string },
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.role === 'instructor') {
      const instructorCourses = await this.prisma.course.findMany({
        where: { instructorId: userId },
        include: {
          category: true,
          enrollments: true,
          reviews: true,
        },
        orderBy: { createdAt: 'desc' },
      });
      return instructorCourses;
    }

    if (user.role === 'student') {
      const enrollments = await this.prisma.enrollment.findMany({
        where: {
          userId: userId,
          ...(c
            ? {
                course: {
                  is: {
                    categoryId: c,
                  },
                },
              }
            : {}),
        },
        include: {
          course: {
            include: {
              instructor: { select: { full_name: true } },
              sessions: {
                include: {
                  lessons: {
                    select: { lessionStatus: true },
                  },
                },
              },
              category: { select: { name: true } },
            },
          },
        },
        orderBy: { enrolledAt: 'desc' },
      });

      return enrollments.map((enroll) => {
        const lessons = enroll.course.sessions.flatMap((s) => s.lessons);
        const totalLessons = lessons.length;
        const completed = lessons.filter((l) => l.lessionStatus).length;
        const progressPercentage =
          totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;

        return {
          id: enroll.course.id,
          title: enroll.course.title,
          thumbnailUrl: enroll.course.thumbnailUrl,
          description: enroll.course.description,
          instructorName: enroll.course.instructor?.full_name ?? '',
          category: enroll.course.category?.name,
          createAt: enroll.enrolledAt,
          progressPercentage,
        };
      });
    }

    return [];
  }

  async getDashboardStats(instructorId: string) {
    // tổng khóa học
    const totalCourses = await this.prisma.course.count({
      where: { instructorId },
    });

    // tổng học viên độc nhất
    const students = await this.prisma.enrollment.findMany({
      where: { course: { instructorId } },
      select: { userId: true },
    });
    const totalStudents = new Set(students.map((s) => s.userId)).size;

    // tổng đơn hàng (enrollment có status = paid)
    const totalOrders = await this.prisma.enrollment.count({
      where: {
        course: { instructorId },
        status: 'paid',
      },
    });

    // tổng revenue (giả sử mỗi đơn hàng = course.price)
    const paidEnrollments = await this.prisma.enrollment.findMany({
      where: {
        course: { instructorId },
        status: 'paid',
      },
      include: { course: true },
    });

    const totalRevenue = paidEnrollments.reduce(
      (sum, e) => sum + e.course.price,
      0,
    );

    return {
      totalCourses,
      totalStudents,
      totalOrders,
      totalRevenue,
    };
  }

  // ------------------------------------------------------
  // 2. Thống kê chi tiết per course
  // ------------------------------------------------------
  async getCoursePerformance(instructorId: string) {
    const courses = await this.prisma.course.findMany({
      where: { instructorId },
      include: {
        enrollments: true,
        reviews: true,
        courseProgress: true,
      },
    });

    return courses.map((c) => {
      const studentCount = c.enrollments.length;

      const avgRating =
        c.reviews.length === 0
          ? 0
          : c.reviews.reduce((s, r) => s + r.rating, 0) / c.reviews.length;

      // completion = % học viên có progressPercentage >= 80%
      const completed = c.courseProgress.filter(
        (p) => Number(p.progressPercentage) >= 80,
      ).length;

      const completionRate =
        studentCount === 0 ? 0 : Math.round((completed / studentCount) * 100);

      return {
        id: c.id,
        title: c.title,
        studentCount,
        avgRating,
        completionRate,
      };
    });
  }

  // ------------------------------------------------------
  // 3. Recent activity (gộp từ enrollment, review, progress, note)
  // ------------------------------------------------------
  async getRecentActivity(instructorId: string) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { course: { instructorId } },
      include: { user: true, course: true },
      orderBy: { enrolledAt: 'desc' },
      take: 5,
    });

    const reviews = await this.prisma.review.findMany({
      where: { course: { instructorId } },
      include: { user: true, course: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const progresses = await this.prisma.courseProgress.findMany({
      where: { course: { instructorId } },
      include: { user: true, course: true, lastLesson: true },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    });

    const notes = await this.prisma.courseNote.findMany({
      where: { course: { instructorId } },
      include: { user: true, course: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const activity = [
      ...enrollments.map((e) => ({
        id: `en-${e.id}`,
        text: `${e.user.full_name} enrolled in "${e.course.title}"`,
        time: e.enrolledAt,
      })),
      ...reviews.map((r) => ({
        id: `re-${r.id}`,
        text: `${r.user.full_name} rated "${r.course.title}" ${r.rating}★`,
        time: r.createdAt,
      })),
      ...progresses.map((p) => ({
        id: `pr-${p.id}`,
        text: `${p.user.full_name} progressed in "${p.course.title}"`,
        time: p.updatedAt,
      })),
      ...notes.map((n) => ({
        id: `no-${n.id}`,
        text: `${n.user.full_name} wrote a note in "${n.course.title}"`,
        time: n.createdAt,
      })),
    ];

    // sort by time desc
    activity.sort((a, b) => b.time.getTime() - a.time.getTime());

    return activity.slice(0, 10);
  }
}
