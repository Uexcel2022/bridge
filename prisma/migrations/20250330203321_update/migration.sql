-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passwordChangeToken" TEXT,
ADD COLUMN     "passwordChangeTokenExpires" TIMESTAMP(3);
