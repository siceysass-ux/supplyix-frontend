/*
  Warnings:

  - You are about to drop the column `isActive` on the `EventPopup` table. All the data in the column will be lost.
  - You are about to drop the column `link` on the `EventPopup` table. All the data in the column will be lost.
  - You are about to drop the column `features` on the `Plan` table. All the data in the column will be lost.
  - Added the required column `ctaLink` to the `EventPopup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ctaText` to the `EventPopup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `EventPopup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `EventPopup` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EventPopup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "ctaText" TEXT NOT NULL,
    "ctaLink" TEXT NOT NULL
);
INSERT INTO "new_EventPopup" ("id", "imageUrl") SELECT "id", "imageUrl" FROM "EventPopup";
DROP TABLE "EventPopup";
ALTER TABLE "new_EventPopup" RENAME TO "EventPopup";
CREATE TABLE "new_Plan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "durationText" TEXT NOT NULL DEFAULT '/ aylık',
    "popular" BOOLEAN NOT NULL DEFAULT false,
    "buttonText" TEXT NOT NULL DEFAULT 'Planı Seç'
);
INSERT INTO "new_Plan" ("id", "name", "popular", "price") SELECT "id", "name", "popular", "price" FROM "Plan";
DROP TABLE "Plan";
ALTER TABLE "new_Plan" RENAME TO "Plan";
CREATE UNIQUE INDEX "Plan_name_key" ON "Plan"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
