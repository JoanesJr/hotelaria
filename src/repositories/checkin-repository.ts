import { Prisma, CheckIn } from '@prisma/client';

export interface CheckInRepository {
    findById(id: string): Promise<CheckIn | null>
    findAll(): Promise<CheckIn[] | null>
    findByReservation(reservationId: string): Promise<CheckIn | null>
    create(data: Prisma.CheckInCreateInput | { reservationId: string }): Promise<CheckIn>
    delete(id: string): Promise<CheckIn>;
}