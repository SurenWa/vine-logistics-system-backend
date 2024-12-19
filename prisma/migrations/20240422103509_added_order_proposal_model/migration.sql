-- CreateTable
CREATE TABLE `OrderProposal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `businessId` INTEGER NULL,
    `supplierId` INTEGER NULL,
    `productId` INTEGER NULL,
    `orderedQuantity` INTEGER NULL,
    `receivedQuantity` INTEGER NULL,
    `pendingQuantity` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
