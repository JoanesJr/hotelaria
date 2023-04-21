import { StatusReservation } from '@/use-cases/userCases/reservation';
import { Reservation, Prisma } from '@prisma/client';

export interface ReservationRepository {
    findById(id: string): Promise<Reservation | null>
    findAll(): Promise<Reservation[] | null>
    findReservation(roomId: string, entryDate: string | Date): Promise<Reservation | null>
    create(data: { userId: string, roomId: string, entryDate: Date | string, exitDate: Date | string, status: string }): Promise<Reservation>
    delete(id: string): Promise<Reservation>;
    update(id: string, data: Prisma.UserUpdateInput | { userId?: string, roomId?: string, entryDate?: Date | string, exitDate?: Date | string, status?: string }): Promise<Reservation>
}