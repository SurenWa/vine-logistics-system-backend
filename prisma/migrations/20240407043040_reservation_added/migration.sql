-- AlterTable
ALTER TABLE `products` ADD COLUMN `onTheWayInQuantity` INTEGER NULL,
    ADD COLUMN `reservationAvailable` INTEGER NULL,
    ADD COLUMN `reservedQuantity` INTEGER NULL;

-- CreateTable
CREATE TABLE `Reserves` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reserveNumber` INTEGER NOT NULL,
    `reservationDate` DATETIME(3) NULL,
    `message` VARCHAR(191) NULL,
    `userId` INTEGER NULL,
    `businessId` INTEGER NULL,
    `totalSum` DECIMAL(65, 30) NULL,
    `grandSum` DECIMAL(65, 30) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Reserves_reserveNumber_key`(`reserveNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReserveProduct` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `username` VARCHAR(191) NULL,
    `productId` INTEGER NULL,
    `reserveId` INTEGER NULL,
    `businessId` INTEGER NULL,
    `categoryId` INTEGER NULL,
    `quantity` INTEGER NULL,
    `reserveRetailPriceIncludingVat` DECIMAL(65, 30) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ReserveProduct_productId_reserveId_idx`(`productId`, `reserveId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Reserves` ADD CONSTRAINT `Reserves_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reserves` ADD CONSTRAINT `Reserves_businessId_fkey` FOREIGN KEY (`businessId`) REFERENCES `Businesses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReserveProduct` ADD CONSTRAINT `ReserveProduct_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Products`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReserveProduct` ADD CONSTRAINT `ReserveProduct_reserveId_fkey` FOREIGN KEY (`reserveId`) REFERENCES `Reserves`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
