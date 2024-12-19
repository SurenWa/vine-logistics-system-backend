-- AlterTable
ALTER TABLE `suppliers` MODIFY `postalCode` VARCHAR(191) NULL,
    MODIFY `customerNumber` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `rfid` VARCHAR(191) NULL;
