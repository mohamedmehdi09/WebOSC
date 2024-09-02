-- CreateEnum
CREATE TYPE "PasswordResetStatus" AS ENUM ('pending', 'completed', 'expired');

-- CreateTable
CREATE TABLE "PasswordReset" (
    "reset_passcode" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" "PasswordResetStatus" NOT NULL DEFAULT 'pending',

    CONSTRAINT "PasswordReset_pkey" PRIMARY KEY ("reset_passcode")
);

-- AddForeignKey
ALTER TABLE "PasswordReset" ADD CONSTRAINT "PasswordReset_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
