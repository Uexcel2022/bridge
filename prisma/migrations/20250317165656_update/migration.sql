/*
  Warnings:

  - You are about to drop the column `qualification` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `school` on the `Users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Users_email_key";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "qualification",
DROP COLUMN "school",
ADD COLUMN     "primaryEmail" TEXT;

-- CreateTable
CREATE TABLE "Qualifications" (
    "id" SERIAL NOT NULL,
    "school" TEXT NOT NULL,
    "qualification" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Qualifications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Qualifications" ADD CONSTRAINT "Qualifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
