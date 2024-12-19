-- AlterTable
ALTER TABLE `orderproduct` ADD COLUMN `costPriceExcludingVat` DECIMAL(65, 30) NULL,
    ADD COLUMN `retailPriceExcludingVat` DECIMAL(65, 30) NULL,
    ADD COLUMN `retailPriceIncludingVat` DECIMAL(65, 30) NULL;
