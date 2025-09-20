-- AlterTable
ALTER TABLE "public"."Transaction" ADD COLUMN     "subcategoryId" TEXT;

-- CreateTable
CREATE TABLE "public"."Subcategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" TEXT,

    CONSTRAINT "Subcategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Subcategory" ADD CONSTRAINT "Subcategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "public"."Subcategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
