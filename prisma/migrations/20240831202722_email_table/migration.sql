/*
  Warnings:

  - You are about to drop the column `emailVerificationPhrase` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailVerificationPhrase",
DROP COLUMN "emailVerified";

-- CreateTable
CREATE TABLE "Email" (
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerificationPhrase" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Email_email_key" ON "Email"("email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_email_fkey" FOREIGN KEY ("email") REFERENCES "Email"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
