-- CreateTable
CREATE TABLE "product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "vendor" TEXT,
    "tags" TEXT,
    "price" REAL NOT NULL,
    "comparePrice" REAL,
    "costPerItem" REAL,
    "weight" REAL,
    "weightUnit" TEXT,
    "length" REAL,
    "width" REAL,
    "height" REAL,
    "sizeUnit" TEXT,
    "countryOfOrigin" TEXT,
    "harmonizedSystemCode" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "storeId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "product_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "store" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "product_variation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "stock" INTEGER NOT NULL,
    "productId" TEXT NOT NULL,
    CONSTRAINT "product_variation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "product_image" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    CONSTRAINT "product_image_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "product_video" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    CONSTRAINT "product_video_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
