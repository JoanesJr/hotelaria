import { Room, Prisma } from '@prisma/client';

export interface RoomRepository {
    findById(id: string): Promise<Room | null>
    findAll(): Promise<Room[] | null>
    create(data: Prisma.RoomCreateInput | { name: string, info: string, typeRoomId: string, status: string }): Promise<Room | { id: string, name: string, info: string, userId: string, created_at: Date, status: string }>
    findByTypeRoom(typeRoomId: string): Promise<Room | null>
    delete(id: string): Promise<Room>;
    update(id: string, data: Prisma.UserUpdateInput | { name: string, info: string, typeRoomId: string, status: string }): Promise<Room>
}