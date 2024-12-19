/*
  Warnings:

  - Added the required column `createdBy` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `createdBy` ENUM('SUPERADMIN', 'ADMIN', 'USER') NOT NULL;

-- CreateTable
CREATE TABLE `Manufacturers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `webAddress` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `businessId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Suppliers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `telephone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `postalCode` INTEGER NULL,
    `place` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `customerNumber` INTEGER NULL,
    `bankAccount` INTEGER NULL,
    `webAddress` VARCHAR(191) NULL,
    `paymentInformation` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `businessId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `year` INTEGER NULL,
    `barCode` INTEGER NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `costPriceExcludingVat` INTEGER NULL,
    `markupPercent` INTEGER NULL,
    `retailPriceExcludingVat` INTEGER NULL,
    `retailPriceIncludingVat` INTEGER NULL,
    `stockBalance` INTEGER NULL,
    `minimumStockBalance` INTEGER NULL,
    `maximumStockBalance` INTEGER NULL,
    `manufacturerId` INTEGER NULL,
    `categoryId` INTEGER NULL,
    `supplierId` INTEGER NULL,
    `businessId` INTEGER NULL,
    `createdBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Manufacturers` ADD CONSTRAINT `Manufacturers_businessId_fkey` FOREIGN KEY (`businessId`) REFERENCES `Businesses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Suppliers` ADD CONSTRAINT `Suppliers_businessId_fkey` FOREIGN KEY (`businessId`) REFERENCES `Businesses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Products` ADD CONSTRAINT `Products_manufacturerId_fkey` FOREIGN KEY (`manufacturerId`) REFERENCES `Manufacturers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Products` ADD CONSTRAINT `Products_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Products` ADD CONSTRAINT `Products_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `Suppliers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Products` ADD CONSTRAINT `Products_businessId_fkey` FOREIGN KEY (`businessId`) REFERENCES `Businesses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
