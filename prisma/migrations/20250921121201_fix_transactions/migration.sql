/*
  Warnings:

  - You are about to drop the column `category` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Transaction" DROP COLUMN "category",
ALTER COLUMN "from" DROP NOT NULL,
ALTER COLUMN "to" DROP NOT NULL,
ALTER COLUMN "tag" DROP NOT NULL;
