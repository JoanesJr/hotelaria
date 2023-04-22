import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-checkIn-repository';
import { PrismaReservationRepository } from '@/repositories/prisma/prisma-reservation-repository';
import { CheckInUseCase } from '../userCases/checkin';


export function makeCheckInUseCase() {
    const checkinRepository = new PrismaCheckInsRepository();
    const reservationRepository = new PrismaReservationRepository();
    const checkinUseCase = new CheckInUseCase(checkinRepository, reservationRepository);

    return checkinUseCase;
}