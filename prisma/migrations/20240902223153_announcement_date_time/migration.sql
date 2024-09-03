-- AlterTable
ALTER TABLE "Announcement" ADD COLUMN     "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ends_at" TIMESTAMP(3),
ADD COLUMN     "publishes_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3);
