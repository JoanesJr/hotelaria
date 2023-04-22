-- CreateTable
CREATE TABLE "parameters" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "maxReserve" INTEGER NOT NULL,
    "maxDaysOfReserve" INTEGER NOT NULL,

    CONSTRAINT "parameters_pkey" PRIMARY KEY ("id")
);
