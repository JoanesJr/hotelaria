/*
  Warnings:

  - A unique constraint covering the columns `[checkInId]` on the table `account` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "account_checkInId_key" ON "account"("checkInId");
