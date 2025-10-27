/*
  Warnings:

  - You are about to drop the `UserSettings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."UserSettings" DROP CONSTRAINT "UserSettings_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'EUR',
ADD COLUMN     "firstDayOfWeek" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "locale" TEXT NOT NULL DEFAULT 'en';

-- DropTable
DROP TABLE "public"."UserSettings";
