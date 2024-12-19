/*
  Warnings:

  - You are about to drop the column `rfid` on the `orderproposal` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `OrderProposal_rfid_key` ON `orderproposal`;

-- AlterTable
ALTER TABLE `orderproposal` DROP COLUMN `rfid`;
