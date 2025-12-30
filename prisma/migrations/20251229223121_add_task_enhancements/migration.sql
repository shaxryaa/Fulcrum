/*
  Warnings:

  - You are about to drop the column `category` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `timeEstimate` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `currentStreak` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `dailyHighlight` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "category",
DROP COLUMN "timeEstimate";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "currentStreak",
DROP COLUMN "dailyHighlight",
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "headerImage" TEXT,
ADD COLUMN     "profilePicture" TEXT;

-- CreateIndex
CREATE INDEX "Task_dueDate_idx" ON "Task"("dueDate");
