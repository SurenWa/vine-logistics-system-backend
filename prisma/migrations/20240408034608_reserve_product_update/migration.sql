/*
  Warnings:

  - You are about to drop the column `grandSum` on the `reserves` table. All the data in the column will be lost.
  - You are about to drop the column `totalSum` on the `reserves` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `reserveproduct` ADD COLUMN `reserveCostPriceExcludingVat` DECIMAL(65, 30) NULL,
    ADD COLUMN `reserveRetailPriceExcludingVat` DECIMAL(65, 30) NULL;

-- AlterTable
ALTER TABLE `reserves` DROP COLUMN `grandSum`,
    DROP COLUMN `totalSum`;
