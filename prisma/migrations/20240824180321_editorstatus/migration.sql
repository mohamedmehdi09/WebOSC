-- CreateEnum
CREATE TYPE "EditorStatus" AS ENUM ('active', 'suspended');

-- CreateTable
CREATE TABLE "Organization" (
    "org_id" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "parent_org_id" TEXT,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("org_id")
);

-- CreateTable
CREATE TABLE "User" (
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "middlename" TEXT,
    "lastname" TEXT NOT NULL,
    "isMale" BOOLEAN,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "super" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Editor" (
    "editor_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "org_id" TEXT NOT NULL,
    "status" "EditorStatus" NOT NULL DEFAULT 'active',

    CONSTRAINT "Editor_pkey" PRIMARY KEY ("editor_id")
);

-- CreateTable
CREATE TABLE "Announcement" (
    "announcement_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "editor_id" TEXT NOT NULL,
    "org_id" TEXT NOT NULL,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("announcement_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Editor_user_id_org_id_key" ON "Editor"("user_id", "org_id");

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_parent_org_id_fkey" FOREIGN KEY ("parent_org_id") REFERENCES "Organization"("org_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Editor" ADD CONSTRAINT "Editor_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Editor" ADD CONSTRAINT "Editor_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "Organization"("org_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_editor_id_fkey" FOREIGN KEY ("editor_id") REFERENCES "Editor"("editor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "Organization"("org_id") ON DELETE RESTRICT ON UPDATE CASCADE;
