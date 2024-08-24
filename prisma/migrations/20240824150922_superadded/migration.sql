-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "user_id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "middlename" TEXT,
    "lastname" TEXT NOT NULL,
    "isMale" BOOLEAN,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "super" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("email", "isMale", "lastname", "middlename", "name", "password", "user_id") SELECT "email", "isMale", "lastname", "middlename", "name", "password", "user_id" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
