/*
  Warnings:

  - A unique constraint covering the columns `[refId]` on the table `OrderProposal` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `refId` to the `OrderProposal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `orderproposal` ADD COLUMN `refId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `OrderProposal_refId_key` ON `OrderProposal`(`refId`);
