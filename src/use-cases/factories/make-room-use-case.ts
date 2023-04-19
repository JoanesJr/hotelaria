
import { PrismaRoomRepository } from '@/repositories/prisma/prisma-room-repository';
import { RoomUseCase } from '../userCases/room';

export function makeRoomUseCase() {
    const repository = new PrismaRoomRepository();
    const roomUseCase = new RoomUseCase(repository);

    return roomUseCase;
}