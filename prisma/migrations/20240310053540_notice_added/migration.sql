-- AlterTable
ALTER TABLE `products` ADD COLUMN `previousStockBalance` INTEGER NULL;

-- CreateTable
CREATE TABLE `Notices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` VARCHAR(191) NULL,
    `username` VARCHAR(191) NULL,
    `message` VARCHAR(191) NULL,
    `pdfUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NoticeProducts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NULL,
    `noticeId` INTEGER NULL,

    INDEX `NoticeProducts_productId_noticeId_idx`(`productId`, `noticeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `NoticeProducts` ADD CONSTRAINT `NoticeProducts_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Products`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NoticeProducts` ADD CONSTRAINT `NoticeProducts_noticeId_fkey` FOREIGN KEY (`noticeId`) REFERENCES `Notices`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
