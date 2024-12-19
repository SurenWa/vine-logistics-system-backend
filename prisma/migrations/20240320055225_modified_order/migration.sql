-- DropForeignKey
ALTER TABLE `cartproduct` DROP FOREIGN KEY `CartProduct_cartId_fkey`;

-- AlterTable
ALTER TABLE `orderproduct` ADD COLUMN `quantity` INTEGER NULL,
    ADD COLUMN `totalQuantityAfterOrder` INTEGER NULL,
    ADD COLUMN `totalQuantityBeforeOrder` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `CartProduct` ADD CONSTRAINT `CartProduct_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `Carts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
