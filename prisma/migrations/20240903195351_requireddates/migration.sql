/*
  Warnings:

  - Made the column `created_at` on table `Announcement` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ends_at` on table `Announcement` required. This step will fail if there are existing NULL values in that column.
  - Made the column `publishes_at` on table `Announcement` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `Announcement` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Announcement" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "ends_at" SET NOT NULL,
ALTER COLUMN "publishes_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;
