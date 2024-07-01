-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FollowMap" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "followingId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "deletedAt" DATETIME,
    CONSTRAINT "FollowMap_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FollowMap_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_FollowMap" ("createdAt", "deletedAt", "followingId", "id", "updatedAt", "userId") SELECT "createdAt", "deletedAt", "followingId", "id", "updatedAt", "userId" FROM "FollowMap";
DROP TABLE "FollowMap";
ALTER TABLE "new_FollowMap" RENAME TO "FollowMap";
CREATE UNIQUE INDEX "FollowMap_userId_followingId_key" ON "FollowMap"("userId", "followingId");
CREATE TABLE "new_Tweet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "deletedAt" DATETIME,
    CONSTRAINT "Tweet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Tweet" ("content", "createdAt", "deletedAt", "id", "updatedAt", "userId") SELECT "content", "createdAt", "deletedAt", "id", "updatedAt", "userId" FROM "Tweet";
DROP TABLE "Tweet";
ALTER TABLE "new_Tweet" RENAME TO "Tweet";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "deletedAt" DATETIME
);
INSERT INTO "new_User" ("createdAt", "deletedAt", "id", "password", "updatedAt", "username") SELECT "createdAt", "deletedAt", "id", "password", "updatedAt", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
