-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `Orders_userId_fkey`;

-- AddForeignKey
ALTER TABLE `Orders` ADD CONSTRAINT `Orders_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
