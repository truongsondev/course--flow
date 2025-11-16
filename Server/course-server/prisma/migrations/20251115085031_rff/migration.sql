/*
  Warnings:

  - Added the required column `fromUserId` to the `instructor_msgs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `instructor_msgs` ADD COLUMN `fromUserId` VARCHAR(191) NOT NULL;
