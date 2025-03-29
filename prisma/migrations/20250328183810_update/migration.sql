/*
  Warnings:

  - You are about to drop the column `email` on the `Jobs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Jobs" DROP COLUMN "email",
ALTER COLUMN "jobTitle" DROP DEFAULT;
