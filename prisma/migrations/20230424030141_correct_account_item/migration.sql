-- DropForeignKey
ALTER TABLE "item" DROP CONSTRAINT "item_accountId_fkey";

-- CreateTable
CREATE TABLE "AccountItem" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "accountId" TEXT,

    CONSTRAINT "AccountItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AccountItem" ADD CONSTRAINT "AccountItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountItem" ADD CONSTRAINT "AccountItem_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
