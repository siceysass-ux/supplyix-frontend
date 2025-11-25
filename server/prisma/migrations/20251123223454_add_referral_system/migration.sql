/*
  Warnings:

  - The required column `referralCode` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- CreateTable
CREATE TABLE "ReferralReward" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "rewardType" TEXT NOT NULL,
    "seen" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ReferralReward_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SupportTicket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ticketNumber" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "isReadByAdmin" BOOLEAN NOT NULL DEFAULT false,
    "isReadByUser" BOOLEAN NOT NULL DEFAULT true,
    "lastUpdate" TEXT NOT NULL,
    "messages" TEXT NOT NULL
);
INSERT INTO "new_SupportTicket" ("id", "isReadByAdmin", "isReadByUser", "lastUpdate", "messages", "status", "subject", "userEmail", "userId", "userName") SELECT "id", "isReadByAdmin", "isReadByUser", "lastUpdate", "messages", "status", "subject", "userEmail", "userId", "userName" FROM "SupportTicket";
DROP TABLE "SupportTicket";
ALTER TABLE "new_SupportTicket" RENAME TO "SupportTicket";
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
    "referralRewards" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_User" ("avatar", "email", "id", "lastLogin", "name", "password", "phone", "plan", "platforms", "referans", "registrationDate", "role", "status", "subscriptionEndDate", "subscriptionStartDate", "tcKimlik", "totalSpent", "vergiKimlik") SELECT "avatar", "email", "id", "lastLogin", "name", "password", "phone", "plan", "platforms", "referans", "registrationDate", "role", "status", "subscriptionEndDate", "subscriptionStartDate", "tcKimlik", "totalSpent", "vergiKimlik" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_referralCode_key" ON "User"("referralCode");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
