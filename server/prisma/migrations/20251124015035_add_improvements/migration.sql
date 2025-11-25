/*
  Warnings:

  - Added the required column `displayId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `displayId` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "FavoriteCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "productIds" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FavoriteCategory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "displayId" TEXT,
    "userId" TEXT NOT NULL,
    "creationDate" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "shippingAddress" TEXT NOT NULL,
    "products" TEXT NOT NULL,
    "subtotal" TEXT NOT NULL,
    "shippingTotal" TEXT NOT NULL,
    "total" TEXT NOT NULL,
    "trackingNumber" TEXT,
    "shippingCarrier" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Order" ("createdAt", "creationDate", "id", "products", "shippingAddress", "shippingCarrier", "shippingTotal", "status", "subtotal", "total", "trackingNumber", "updatedAt", "userId") SELECT "createdAt", "creationDate", "id", "products", "shippingAddress", "shippingCarrier", "shippingTotal", "status", "subtotal", "total", "trackingNumber", "updatedAt", "userId" FROM "Order";

-- Generate displayId for existing orders
UPDATE "new_Order" SET "displayId" = '#S' || substr(id, -4) WHERE "displayId" IS NULL;

DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE UNIQUE INDEX "Order_displayId_key" ON "Order"("displayId");
CREATE TABLE "new_Request" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "displayId" TEXT,
    "type" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "result" TEXT,
    "response" TEXT,
    "title" TEXT,
    "productName" TEXT,
    "imageUrls" TEXT,
    "referenceLink" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Request_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Request" ("createdAt", "explanation", "id", "imageUrls", "productName", "referenceLink", "response", "result", "status", "title", "type", "updatedAt", "userId") SELECT "createdAt", "explanation", "id", "imageUrls", "productName", "referenceLink", "response", "result", "status", "title", "type", "updatedAt", "userId" FROM "Request";

-- Generate displayId for existing requests based on type
UPDATE "new_Request" SET "displayId" = '#' || CASE WHEN type = 'Tedarik' THEN 'T' ELSE 'D' END || substr(id, -4) WHERE "displayId" IS NULL;

DROP TABLE "Request";
ALTER TABLE "new_Request" RENAME TO "Request";
CREATE UNIQUE INDEX "Request_displayId_key" ON "Request"("displayId");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "phone" TEXT,
    "tcKimlik" TEXT,
    "vergiKimlik" TEXT,
    "referans" TEXT,
    "plan" TEXT,
    "status" TEXT NOT NULL,
    "registrationDate" TEXT NOT NULL,
    "subscriptionStartDate" TEXT NOT NULL,
    "subscriptionEndDate" TEXT NOT NULL,
    "totalSpent" REAL NOT NULL DEFAULT 0,
    "lastLogin" TEXT NOT NULL,
    "platforms" TEXT NOT NULL,
    "avatar" TEXT,
    "referralCode" TEXT NOT NULL,
    "referredBy" TEXT,
    "referralCount" INTEGER NOT NULL DEFAULT 0,
    "referralRewards" INTEGER NOT NULL DEFAULT 0,
    "autoRenew" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_User" ("avatar", "email", "id", "lastLogin", "name", "password", "phone", "plan", "platforms", "referans", "referralCode", "referralCount", "referralRewards", "referredBy", "registrationDate", "role", "status", "subscriptionEndDate", "subscriptionStartDate", "tcKimlik", "totalSpent", "vergiKimlik") SELECT "avatar", "email", "id", "lastLogin", "name", "password", "phone", "plan", "platforms", "referans", "referralCode", "referralCount", "referralRewards", "referredBy", "registrationDate", "role", "status", "subscriptionEndDate", "subscriptionStartDate", "tcKimlik", "totalSpent", "vergiKimlik" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_referralCode_key" ON "User"("referralCode");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteCategory_userId_name_key" ON "FavoriteCategory"("userId", "name");
