/*
  Warnings:

  - You are about to drop the column `categoryId` on the `orderproduct` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `orderproduct` DROP COLUMN `categoryId`,
    ADD COLUMN `businessId` INTEGER NULL;
