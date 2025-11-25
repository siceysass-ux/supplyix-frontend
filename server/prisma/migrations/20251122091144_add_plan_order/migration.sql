-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Plan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "durationText" TEXT NOT NULL DEFAULT '/ aylık',
    "popular" BOOLEAN NOT NULL DEFAULT false,
    "buttonText" TEXT NOT NULL DEFAULT 'Planı Seç',
    "order" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Plan" ("buttonText", "durationText", "id", "name", "popular", "price") SELECT "buttonText", "durationText", "id", "name", "popular", "price" FROM "Plan";
DROP TABLE "Plan";
ALTER TABLE "new_Plan" RENAME TO "Plan";
CREATE UNIQUE INDEX "Plan_name_key" ON "Plan"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
