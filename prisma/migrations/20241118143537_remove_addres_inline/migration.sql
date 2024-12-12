/*
  Warnings:

  - You are about to drop the column `number` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `streeth` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "number",
DROP COLUMN "streeth";
