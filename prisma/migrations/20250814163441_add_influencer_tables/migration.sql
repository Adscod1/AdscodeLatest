-- CreateTable
CREATE TABLE "influencer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "country" TEXT,
    "city" TEXT,
    "primaryNiche" TEXT NOT NULL,
    "secondaryNiches" TEXT,
    "bio" TEXT,
    "websiteUrl" TEXT,
    "ratePerPost" TEXT,
    "brandCollaborations" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "applicationDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvalDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "influencer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "influencer_social" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "influencerId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "followers" TEXT,
    "url" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "influencer_social_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES "influencer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "influencer_userId_key" ON "influencer"("userId");
