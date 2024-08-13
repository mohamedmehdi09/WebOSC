/*
  Warnings:

  - The primary key for the `Editor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Organization` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Subscription` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Tag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Announcement" (
    "announcement_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "editor_id" TEXT NOT NULL,
    "org_id" TEXT NOT NULL,
    CONSTRAINT "Announcement_editor_id_fkey" FOREIGN KEY ("editor_id") REFERENCES "Editor" ("editor_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Announcement_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "Organization" ("org_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Announcement" ("announcement_id", "body", "editor_id", "org_id", "title") SELECT "announcement_id", "body", "editor_id", "org_id", "title" FROM "Announcement";
DROP TABLE "Announcement";
ALTER TABLE "new_Announcement" RENAME TO "Announcement";
CREATE TABLE "new_Editor" (
    "editor_id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "org_id" TEXT NOT NULL,
    CONSTRAINT "Editor_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Editor_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "Organization" ("org_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Editor" ("editor_id", "org_id", "user_id") SELECT "editor_id", "org_id", "user_id" FROM "Editor";
DROP TABLE "Editor";
ALTER TABLE "new_Editor" RENAME TO "Editor";
CREATE UNIQUE INDEX "Editor_user_id_org_id_key" ON "Editor"("user_id", "org_id");
CREATE TABLE "new_Organization" (
    "org_id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "parent_org_id" TEXT,
    CONSTRAINT "Organization_parent_org_id_fkey" FOREIGN KEY ("parent_org_id") REFERENCES "Organization" ("org_id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Organization" ("name", "org_id", "parent_org_id") SELECT "name", "org_id", "parent_org_id" FROM "Organization";
DROP TABLE "Organization";
ALTER TABLE "new_Organization" RENAME TO "Organization";
CREATE TABLE "new_Subscription" (
    "subscription_id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "org_id" TEXT NOT NULL,
    CONSTRAINT "Subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Subscription_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "Organization" ("org_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Subscription" ("org_id", "subscription_id", "user_id") SELECT "org_id", "subscription_id", "user_id" FROM "Subscription";
DROP TABLE "Subscription";
ALTER TABLE "new_Subscription" RENAME TO "Subscription";
CREATE TABLE "new_Tag" (
    "tag_id" TEXT NOT NULL PRIMARY KEY,
    "org_id" TEXT NOT NULL,
    "tag_name" TEXT NOT NULL,
    CONSTRAINT "Tag_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "Organization" ("org_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Tag" ("org_id", "tag_id", "tag_name") SELECT "org_id", "tag_id", "tag_name" FROM "Tag";
DROP TABLE "Tag";
ALTER TABLE "new_Tag" RENAME TO "Tag";
CREATE TABLE "new_User" (
    "user_id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "isMale" BOOLEAN,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);
INSERT INTO "new_User" ("email", "isMale", "lastname", "name", "password", "user_id") SELECT "email", "isMale", "lastname", "name", "password", "user_id" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
