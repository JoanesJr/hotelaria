import { PrismaReservationRepository } from '@/repositories/prisma/prisma-reservation-repository';
import { ReservationUseCase } from '../userCases/reservation';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { PrismaRoomRepository } from '@/repositories/prisma/prisma-room-repository';
import { PrismaParametersRepository } from '@/repositories/prisma/prisma-parameters-repository';

export function makeReservationUseCase() {
    const repository = new PrismaReservationRepository();
    const userRepository = new PrismaUsersRepository();
    const roomRepository = new PrismaRoomRepository();
    const parametersRepository = new PrismaParametersRepository();
    const reservationUseCase = new ReservationUseCase(repository, roomRepository, userRepository, parametersRepository);

    return reservationUseCase;
}