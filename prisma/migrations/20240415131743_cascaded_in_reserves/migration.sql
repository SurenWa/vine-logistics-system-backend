-- DropForeignKey
ALTER TABLE `reserveproduct` DROP FOREIGN KEY `ReserveProduct_productId_fkey`;

-- DropForeignKey
ALTER TABLE `reserveproduct` DROP FOREIGN KEY `ReserveProduct_reserveId_fkey`;

-- AddForeignKey
ALTER TABLE `ReserveProduct` ADD CONSTRAINT `ReserveProduct_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReserveProduct` ADD CONSTRAINT `ReserveProduct_reserveId_fkey` FOREIGN KEY (`reserveId`) REFERENCES `Reserves`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
