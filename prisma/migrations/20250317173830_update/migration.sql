/*
  Warnings:

  - A unique constraint covering the columns `[primaryEmail]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `createdAt` to the `Qualifications` table without a default value. This is not possible if the table is not empty.
  - Made the column `primaryEmail` on table `Users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Qualifications" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "primaryEmail" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Users_primaryEmail_key" ON "Users"("primaryEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");
