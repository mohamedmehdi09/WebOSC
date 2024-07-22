-- CreateTable
CREATE TABLE "Organization" (
    "org_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "parent_org_id" INTEGER,
    CONSTRAINT "Organization_parent_org_id_fkey" FOREIGN KEY ("parent_org_id") REFERENCES "Organization" ("org_id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "user_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "isMale" BOOLEAN NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Editor" (
    "editor_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "org_id" INTEGER NOT NULL,
    CONSTRAINT "Editor_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Editor_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "Organization" ("org_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Subscription" (
    "subscription_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "org_id" INTEGER NOT NULL,
    CONSTRAINT "Subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Subscription_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "Organization" ("org_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tag" (
    "tag_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "org_id" INTEGER NOT NULL,
    "tag_name" TEXT NOT NULL,
    CONSTRAINT "Tag_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "Organization" ("org_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Announcement" (
    "announcement_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "editor_id" INTEGER NOT NULL,
    "org_id" INTEGER NOT NULL,
    CONSTRAINT "Announcement_editor_id_fkey" FOREIGN KEY ("editor_id") REFERENCES "Editor" ("editor_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Announcement_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "Organization" ("org_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Link" (
    "link_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "announcement_id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "Link_announcement_id_fkey" FOREIGN KEY ("announcement_id") REFERENCES "Announcement" ("announcement_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Editor_user_id_org_id_key" ON "Editor"("user_id", "org_id");
