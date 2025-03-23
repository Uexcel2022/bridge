/*
  Warnings:

  - The `cv` column on the `applyForJob` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `name` to the `applyForJob` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `applyForJob` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "applyForJob" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL,
DROP COLUMN "cv",
ADD COLUMN     "cv" TEXT[];
