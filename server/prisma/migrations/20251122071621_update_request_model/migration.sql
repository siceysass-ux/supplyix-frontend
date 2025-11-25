/*
  Warnings:

  - You are about to drop the column `details` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `updated` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `userEmail` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `userName` on the `Request` table. All the data in the column will be lost.
  - Added the required column `explanation` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN "avatar" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Request" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
INSERT INTO "new_Request" ("id", "result", "status", "type") SELECT "id", "result", "status", "type" FROM "Request";
DROP TABLE "Request";
ALTER TABLE "new_Request" RENAME TO "Request";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
