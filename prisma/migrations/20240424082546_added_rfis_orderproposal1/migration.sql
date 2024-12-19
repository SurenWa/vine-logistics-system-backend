/*
  Warnings:

  - You are about to drop the column `refId` on the `orderproposal` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[rfid]` on the table `OrderProposal` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `rfid` to the `OrderProposal` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `OrderProposal_refId_key` ON `orderproposal`;

-- AlterTable
ALTER TABLE `orderproposal` DROP COLUMN `refId`,
    ADD COLUMN `rfid` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `OrderProposal_rfid_key` ON `OrderProposal`(`rfid`);
