-- CreateTable
CREATE TABLE "profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "location" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "bio" TEXT,
    "website" TEXT,
    "socials" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "profile_userId_key" ON "profile"("userId");
