/*
  Warnings:

  - Added the required column `balance` to the `Wallet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Wallet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Transaction" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "public"."Wallet" ADD COLUMN     "balance" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;
