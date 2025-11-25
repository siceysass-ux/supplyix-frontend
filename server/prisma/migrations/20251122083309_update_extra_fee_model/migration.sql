/*
  Warnings:

  - You are about to drop the column `isPaid` on the `ExtraFee` table. All the data in the column will be lost.
  - Added the required column `item` to the `ExtraFee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `ExtraFee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ExtraFee` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ExtraFee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "description" TEXT,
    "amount" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ExtraFee" ("amount", "date", "description", "id", "userId") SELECT "amount", "date", "description", "id", "userId" FROM "ExtraFee";
DROP TABLE "ExtraFee";
ALTER TABLE "new_ExtraFee" RENAME TO "ExtraFee";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
