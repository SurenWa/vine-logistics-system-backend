-- AlterTable
ALTER TABLE `user` ADD COLUMN `businessId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_businessId_fkey` FOREIGN KEY (`businessId`) REFERENCES `Businesses`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
