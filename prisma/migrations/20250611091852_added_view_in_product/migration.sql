-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_product" (
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
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "product_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "store" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_product" ("category", "comparePrice", "costPerItem", "countryOfOrigin", "createdAt", "description", "harmonizedSystemCode", "height", "id", "length", "price", "sizeUnit", "status", "storeId", "tags", "title", "updatedAt", "vendor", "weight", "weightUnit", "width") SELECT "category", "comparePrice", "costPerItem", "countryOfOrigin", "createdAt", "description", "harmonizedSystemCode", "height", "id", "length", "price", "sizeUnit", "status", "storeId", "tags", "title", "updatedAt", "vendor", "weight", "weightUnit", "width" FROM "product";
DROP TABLE "product";
ALTER TABLE "new_product" RENAME TO "product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
