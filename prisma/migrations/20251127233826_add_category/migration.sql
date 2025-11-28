/*
  Warnings:

  - The values [income,expense,equity] on the enum `VaultType` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('expense', 'income');

-- AlterEnum
BEGIN;
CREATE TYPE "VaultType_new" AS ENUM ('asset', 'liability');
ALTER TABLE "Vault" ALTER COLUMN "type" TYPE "VaultType_new" USING ("type"::text::"VaultType_new");
ALTER TYPE "VaultType" RENAME TO "VaultType_old";
ALTER TYPE "VaultType_new" RENAME TO "VaultType";
DROP TYPE "public"."VaultType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Entry" ADD COLUMN     "amountBase" DECIMAL(18,2),
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'EUR',
ADD COLUMN     "exchangeRate" DECIMAL(18,6);

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'EUR';

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CategoryType" NOT NULL,
    "icon" TEXT,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
