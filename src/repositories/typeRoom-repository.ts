import { Prisma, TypeRoom } from '@prisma/client';

export interface TypeRoomRepository {
    findById(id: string): Promise<TypeRoom | null>
    findByName(name: string): Promise<TypeRoom | null>;
    findAll(): Promise<TypeRoom[] | null>
    create(data: Prisma.TypeRoomCreateInput): Promise<TypeRoom>
    delete(id: string): Promise<TypeRoom>;
    update(id: string, data: Prisma.TypeRoomUpdateInput): Promise<TypeRoom>
}