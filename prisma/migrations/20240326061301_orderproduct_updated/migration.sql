-- AlterTable
ALTER TABLE `orderproduct` ADD COLUMN `categoryId` INTEGER NULL,
    ADD COLUMN `userId` INTEGER NULL,
    ADD COLUMN `username` VARCHAR(191) NULL;
