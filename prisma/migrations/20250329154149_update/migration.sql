/*
  Warnings:

  - You are about to drop the column `confirmPassword` on the `User` table. All the data in the column will be lost.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Qualifications" DROP CONSTRAINT "Qualifications_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "confirmPassword",
ADD COLUMN     "role" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Qualifications" ADD CONSTRAINT "Qualifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
