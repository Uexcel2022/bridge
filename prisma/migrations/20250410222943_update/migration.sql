/*
  Warnings:

  - You are about to drop the column `companyId` on the `Job` table. All the data in the column will be lost.
  - Added the required column `recruiterId` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_companyId_fkey";

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "companyId",
ADD COLUMN     "recruiterId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Recruiter" ALTER COLUMN "publicId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "Recruiter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
