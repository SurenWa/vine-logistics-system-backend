-- AlterTable
ALTER TABLE `reserveproduct` ADD COLUMN `currentRetailPriceIncludingVat` DECIMAL(65, 30) NULL;

-- AlterTable
ALTER TABLE `reserves` MODIFY `reserveNumber` VARCHAR(191) NOT NULL;
