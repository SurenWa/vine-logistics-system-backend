/*
  Warnings:

  - A unique constraint covering the columns `[businessName]` on the table `Businesses` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Businesses_businessName_key` ON `Businesses`(`businessName`);
