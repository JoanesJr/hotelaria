-- CreateTable
CREATE TABLE "item" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "info" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "item_pkey" PRIMARY KEY ("id")
);
