-- CreateTable
CREATE TABLE "User" (
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
    "platforms" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "stock" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "minOrder" INTEGER NOT NULL DEFAULT 1
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderNumber" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "totalPrice" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "creationDate" TEXT NOT NULL,
    "shippingAddress" TEXT NOT NULL,
    "shippingCarrier" TEXT,
    "trackingNumber" TEXT
);

-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "result" TEXT,
    "updated" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "imageUrl" TEXT
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "type" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "SupportTicket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "isReadByAdmin" BOOLEAN NOT NULL DEFAULT false,
    "lastUpdate" TEXT NOT NULL,
    "messages" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ExtraFee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "features" TEXT NOT NULL,
    "popular" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "EventPopup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "imageUrl" TEXT NOT NULL,
    "link" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "InfluencerCode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "discountRate" REAL NOT NULL,
    "affiliateRate" REAL NOT NULL,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "totalEarnings" REAL NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "NavItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "order" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_key" ON "Product"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "InfluencerCode_code_key" ON "InfluencerCode"("code");
