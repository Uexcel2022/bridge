/*
  Warnings:

  - You are about to drop the `applyForJob` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "applyForJob" DROP CONSTRAINT "applyForJob_jobId_fkey";

-- DropForeignKey
ALTER TABLE "applyForJob" DROP CONSTRAINT "applyForJob_userId_fkey";

-- DropTable
DROP TABLE "applyForJob";

-- CreateTable
CREATE TABLE "ApplyForJob" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "coverLetter" TEXT,
    "linkedin" TEXT,
    "experience" INTEGER NOT NULL DEFAULT 0,
    "quoteSalary" INTEGER NOT NULL DEFAULT 0,
    "cv" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "jobId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ApplyForJob_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ApplyForJob" ADD CONSTRAINT "ApplyForJob_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplyForJob" ADD CONSTRAINT "ApplyForJob_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
