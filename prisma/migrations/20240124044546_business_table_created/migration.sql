/*
  Warnings:

  - You are about to drop the column `isActive` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `isActive`;

-- CreateTable
CREATE TABLE `Businesses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `businessName` VARCHAR(191) NOT NULL,
    `businessAddress` VARCHAR(191) NULL,
    `businessNumber` INTEGER NULL,
    `telephoneNumber` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
