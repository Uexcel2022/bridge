/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Posts" DROP COLUMN "createdAt",
ALTER COLUMN "createAt" SET DEFAULT CURRENT_TIMESTAMP;
