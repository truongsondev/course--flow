/*
  Warnings:

  - You are about to drop the `chat_messages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `chat_messages` DROP FOREIGN KEY `chat_messages_receiverId_fkey`;

-- DropForeignKey
ALTER TABLE `chat_messages` DROP FOREIGN KEY `chat_messages_senderId_fkey`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `avt_url` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `chat_messages`;
