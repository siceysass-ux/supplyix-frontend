-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    "autoRenew" BOOLEAN NOT NULL DEFAULT true,
    "hasUsedTrial" BOOLEAN NOT NULL DEFAULT false,
    "resetPasswordToken" TEXT,
    "resetPasswordExpires" DATETIME,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerificationToken" TEXT,
    "emailVerificationExpires" DATETIME
);
INSERT INTO "new_User" ("autoRenew", "avatar", "email", "emailVerificationExpires", "emailVerificationToken", "emailVerified", "id", "lastLogin", "name", "password", "phone", "plan", "platforms", "referans", "referralCode", "referralCount", "referralRewards", "referredBy", "registrationDate", "resetPasswordExpires", "resetPasswordToken", "role", "status", "subscriptionEndDate", "subscriptionStartDate", "tcKimlik", "totalSpent", "vergiKimlik") SELECT "autoRenew", "avatar", "email", "emailVerificationExpires", "emailVerificationToken", "emailVerified", "id", "lastLogin", "name", "password", "phone", "plan", "platforms", "referans", "referralCode", "referralCount", "referralRewards", "referredBy", "registrationDate", "resetPasswordExpires", "resetPasswordToken", "role", "status", "subscriptionEndDate", "subscriptionStartDate", "tcKimlik", "totalSpent", "vergiKimlik" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_referralCode_key" ON "User"("referralCode");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
