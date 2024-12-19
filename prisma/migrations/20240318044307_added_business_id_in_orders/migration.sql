-- AlterTable
ALTER TABLE `orders` ADD COLUMN `businessId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Orders` ADD CONSTRAINT `Orders_businessId_fkey` FOREIGN KEY (`businessId`) REFERENCES `Businesses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
