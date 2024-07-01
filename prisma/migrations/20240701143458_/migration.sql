/*
  Warnings:

  - A unique constraint covering the columns `[userId,followingId]` on the table `FollowMap` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FollowMap_userId_followingId_key" ON "FollowMap"("userId", "followingId");
