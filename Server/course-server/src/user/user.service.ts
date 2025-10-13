import { HttpException, Inject } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { UserUpdate } from 'src/dto/request/user/user-update.dto';
import * as bcrypt from 'bcrypt';
export class UserService {
  constructor(@Inject('PRISMA_CLIENT') private readonly prisma: PrismaClient) {}
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
}
