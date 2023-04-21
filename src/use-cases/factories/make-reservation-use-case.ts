import { PrismaReservationRepository } from '@/repositories/prisma/prisma-reservation-repository';
import { ReservationUseCase } from '../userCases/reservation';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { PrismaRoomRepository } from '@/repositories/prisma/prisma-room-repository';

export function makeReservationUseCase() {
    const repository = new PrismaReservationRepository();
    const userRepository = new PrismaUsersRepository();
    const roomRepository = new PrismaRoomRepository();
    const reservationUseCase = new ReservationUseCase(repository, roomRepository, userRepository);

    return reservationUseCase;
}