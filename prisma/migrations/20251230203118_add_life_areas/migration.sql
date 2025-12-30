-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dob" TIMESTAMP(3),
ADD COLUMN     "gender" TEXT;

-- CreateTable
CREATE TABLE "LifeArea" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LifeArea_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LifeArea_userId_idx" ON "LifeArea"("userId");

-- CreateIndex
CREATE INDEX "LifeArea_createdAt_idx" ON "LifeArea"("createdAt");

-- AddForeignKey
ALTER TABLE "LifeArea" ADD CONSTRAINT "LifeArea_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
