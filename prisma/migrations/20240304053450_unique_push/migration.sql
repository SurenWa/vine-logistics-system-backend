/*
  Warnings:

  - A unique constraint covering the columns `[barCode]` on the table `Products` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pinCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Products_barCode_key` ON `Products`(`barCode`);

-- CreateIndex
CREATE UNIQUE INDEX `User_pinCode_key` ON `User`(`pinCode`);
