
import { PrismaTypeRoomRepository } from '@/repositories/prisma/prisma-typeRoom-repository';
import { TypeRoomUseCase } from '../userCases/typeRoom';

export function makeTypeRoomUseCase() {
    const repository = new PrismaTypeRoomRepository();
    const typeRoomUseCase = new TypeRoomUseCase(repository);

    return typeRoomUseCase;
}