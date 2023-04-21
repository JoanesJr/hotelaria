import { PrismaReservationRepository } from '@/repositories/prisma/prisma-reservation-repository';
import { ReservationUseCase } from '../userCases/reservation';

export function makeReservationUseCase() {
    const repository = new PrismaReservationRepository();
    const reservationUseCase = new ReservationUseCase(repository);

    return reservationUseCase;
}