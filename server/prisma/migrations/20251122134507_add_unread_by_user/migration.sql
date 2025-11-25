-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SupportTicket" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
INSERT INTO "new_SupportTicket" ("id", "isReadByAdmin", "lastUpdate", "messages", "status", "subject", "userEmail", "userId", "userName") SELECT "id", "isReadByAdmin", "lastUpdate", "messages", "status", "subject", "userEmail", "userId", "userName" FROM "SupportTicket";
DROP TABLE "SupportTicket";
ALTER TABLE "new_SupportTicket" RENAME TO "SupportTicket";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
