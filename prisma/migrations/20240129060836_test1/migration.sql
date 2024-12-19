-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_businessId_fkey`;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_businessId_fkey` FOREIGN KEY (`businessId`) REFERENCES `Businesses`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
