/*
  Warnings:

  - A unique constraint covering the columns `[orderNumber]` on the table `Orders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `OrderProduct` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderNumber` to the `Orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `orderproduct` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `orders` ADD COLUMN `orderNumber` INTEGER NOT NULL,
    ADD COLUMN `totalSum` DECIMAL(65, 30) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Orders_orderNumber_key` ON `Orders`(`orderNumber`);
