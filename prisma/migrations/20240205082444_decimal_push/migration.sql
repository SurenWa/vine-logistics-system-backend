/*
  Warnings:

  - You are about to alter the column `costPriceExcludingVat` on the `products` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(65,30)`.
  - You are about to alter the column `markupPercent` on the `products` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(65,30)`.
  - You are about to alter the column `retailPriceExcludingVat` on the `products` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(65,30)`.
  - You are about to alter the column `retailPriceIncludingVat` on the `products` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE `products` MODIFY `costPriceExcludingVat` DECIMAL(65, 30) NULL,
    MODIFY `markupPercent` DECIMAL(65, 30) NULL,
    MODIFY `retailPriceExcludingVat` DECIMAL(65, 30) NULL,
    MODIFY `retailPriceIncludingVat` DECIMAL(65, 30) NULL;
