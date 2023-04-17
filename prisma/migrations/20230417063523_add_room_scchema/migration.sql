-- CreateTable
CREATE TABLE "room" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "info" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'aberto',
    "typeRoomId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "room_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "room" ADD CONSTRAINT "room_typeRoomId_fkey" FOREIGN KEY ("typeRoomId") REFERENCES "type_room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
