import { HttpException, Inject } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { UserUpdate } from 'src/dto/request/user/user-update.dto';
import * as bcrypt from 'bcrypt';
import { MinioService } from 'src/minio/minio.service';
import { lastValueFrom } from 'rxjs';
import { ClientKafka } from '@nestjs/microservices';
export class UserService {
  constructor(
    @Inject('PRISMA_CLIENT') private readonly prisma: PrismaClient,
    private readonly minioService: MinioService,
    @Inject('OTP_KAFKA') private readonly kafka: ClientKafka,
  ) {}
  updateProfile = async (userId, full_name, bio) => {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new HttpException('User not found!', 404);
      }

      if (![full_name, bio].some(Boolean)) {
        throw new HttpException('No data to update!', 400);
      }

      const updateData: {
        userId: string;
        full_name: string;
        bio: string;
      } = {
        userId: userId,
        full_name: full_name,
        bio: bio,
      };

      if (full_name?.trim()) {
        if (full_name.length < 3 || full_name.length > 50) {
          throw new HttpException('Full name must be 3–50 characters.', 400);
        }

        if (!/^[a-zA-Z\sÀ-ỹ]+$/.test(full_name)) {
          throw new HttpException(
            'Full name contains invalid characters!',
            400,
          );
        }

        updateData.full_name = full_name.trim();
      }

      if (bio?.trim()) {
        if (bio.length < 10 || bio.length > 300) {
          throw new HttpException('Bio must be 10–300 characters.', 400);
        }

        updateData.bio = bio.trim();
      }

      const updated = await this.prisma.user.update({
        where: { id: userId },
        data: updateData,
      });

      return {
        message: 'Profile updated successfully!',
        user: updated,
      };
    } catch (err) {
      console.error(err);
      throw new HttpException('Internal server error.', 500);
    }
  };

  async getUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        courses: {
          include: {
            category: { select: { name: true } },
            reviews: true,
            enrollments: true,
          },
        },
        enrollments: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                price: true,
                status: true,
                category: { select: { name: true } },
                instructor: { select: { full_name: true } },
              },
            },
          },
        },
        reviews: true,
        courseProgress: {
          include: {
            course: { select: { id: true, title: true } },
            lastLesson: { select: { id: true, title: true, position: true } },
          },
        },
      },
    });

    if (!user) throw new HttpException('User không tồn tại', 404);

    // Chuẩn hóa dữ liệu trả về cho frontend
    return {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      role: user.role,
      bio: user.bio,
      avt_url: user.avt_url,
      createdAt: user.createdAt,
      courses: user.courses.map((c) => ({
        id: c.id,
        title: c.title,
        category: c.category?.name,
        price: c.price,
        status: c.status,
        studentsCount: c.enrollments.length,
        rating:
          c.reviews.length > 0
            ? c.reviews.reduce((acc, r) => acc + r.rating, 0) / c.reviews.length
            : null,
      })),
      enrolledCourses: user.enrollments.map((e) => ({
        id: e.course.id,
        title: e.course.title,
        instructor: e.course.instructor?.full_name,
        price: e.course.price,
        category: e.course.category?.name,
        status: e.course.status,
      })),
      progress: user.courseProgress.map((p) => ({
        courseId: p.courseId,
        courseTitle: p.course.title,
        progressPercentage: p.progressPercentage,
        lastLesson: p.lastLesson
          ? {
              id: p.lastLesson.id,
              title: p.lastLesson.title,
              position: p.lastLesson.position,
            }
          : null,
      })),
    };
  }

  async updateUserProfile(
    userId: string,
    data: any,
    avatar?: Express.Multer.File,
  ) {
    const { fullName, bio, email } = data;

    let avatarUrl: string | undefined = undefined;

    if (avatar) {
      const objectName = await this.minioService.uploadFile(
        'user-file',
        avatar,
      );

      avatarUrl = await this.minioService.getPresignedUrl(
        'user-file',
        objectName,
        3600 * 24 * 7,
      );
    }

    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(fullName && { full_name: fullName }),
        ...(bio && { bio }),
        ...(email && { email }),

        ...(avatarUrl && { avt_url: avatarUrl }),
      },
      select: {
        id: true,
        email: true,
        full_name: true,
        bio: true,
        avt_url: true,
        role: true,
        user_verified: true,
        createdAt: true,
      },
    });
  }

  async getStudentsOfInstructor(instructorId: string) {
    if (!instructorId) throw new Error('Missing instructorId');

    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        course: {
          instructorId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            password: true,
            full_name: true,
            bio: true,
            role: true,
          },
        },
      },
    });

    const uniqueStudents = new Map();
    enrollments.forEach((e) => {
      if (e.user.role === 'student') {
        uniqueStudents.set(e.user.id, {
          id: e.user.id,
          email: e.user.email,
          password: e.user.password,
          full_name: e.user.full_name || '',
          bio: e.user.bio || '',
        });
      }
    });

    return Array.from(uniqueStudents.values());
  }

  async getUserChat(userId: string) {
    if (!userId) {
      throw new HttpException('User invalid', 400);
    }
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        full_name: true,
        avt_url: true,
      },
    });
    return user;
  }

  async becomeInstructor(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { role: 'instructor' },
    });
    return updatedUser;
  }

  async forgetPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    const generatePassword = Math.random().toString(8).slice(-8);
    if (user?.email) {
      lastValueFrom(
        this.kafka.emit('forget.send', {
          email: user.email,
          generatePassword: generatePassword,
          ts: new Date().toISOString(),
        }),
      );
    }
    const hashedPassword = await bcrypt.hash(generatePassword, 10);
    const updatedUser = await this.prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });
    return {
      message: 'New password has been sent to your email',
      user: updatedUser,
    };
  }

  async resetPassword(
    userId: string,
    newPassword: string,
    oldPassword: string,
  ) {
    if (!userId) {
      throw new HttpException('UserId is required', 400);
    }
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    const isPasswordMatching = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatching) {
      throw new HttpException('Old password is incorrect', 400);
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
    return {
      message: 'Password has been reset successfully',
      user: updatedUser,
    };
  }
}
