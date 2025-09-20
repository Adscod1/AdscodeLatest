/*
  Warnings:

  - Added the required column `userId` to the `store` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_store" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "tagline" TEXT,
    "description" TEXT,
    "category" TEXT,
    "regNumber" TEXT,
    "yearEstablished" INTEGER,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "zip" TEXT,
    "website" TEXT,
    "logo" TEXT,
    "banner" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "store_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_store" ("address", "banner", "category", "city", "country", "createdAt", "description", "email", "id", "logo", "name", "phone", "regNumber", "state", "tagline", "updatedAt", "website", "yearEstablished", "zip") SELECT "address", "banner", "category", "city", "country", "createdAt", "description", "email", "id", "logo", "name", "phone", "regNumber", "state", "tagline", "updatedAt", "website", "yearEstablished", "zip" FROM "store";
DROP TABLE "store";
ALTER TABLE "new_store" RENAME TO "store";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
