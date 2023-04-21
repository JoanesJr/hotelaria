
import { Reservation, Prisma, User } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { ReservationRepository } from '../reservation-repository';
import { StatusReservation } from '@/use-cases/userCases/reservation';

export class InMemoryReservationRepository implements ReservationRepository {

    public items: Reservation[] = [];

    async findReservation(roomId: string, entryDate: string | Date): Promise<Reservation | null> {
        const reservationWithSameRoom = this.items.find((item) => item.roomId === roomId);

        if (reservationWithSameRoom) {
            const entryDateReservation = new Date(reservationWithSameRoom.entryDate);
            const exitDateReservation = new Date(reservationWithSameRoom.exitDate);
            const dateCompare = new Date(entryDate);

            if (dateCompare >= entryDateReservation && dateCompare <= exitDateReservation) {
                return reservationWithSameRoom;
            }
        }

        return null;

    }

    async findAll(): Promise<Reservation[]> {
        return this.items;
    }

    async findById(id: string) {
        const reservation = this.items.find((item) => item.id === id);

        if (!reservation) {
            return null;
        }

        return reservation;
    }

    async create(data: { userId: string; roomId: string; entryDate: Date; exitDate: Date; status: string; }): Promise<Reservation> {
        const reservation = {
            id: randomUUID(),
            userId: data.userId,
            roomId: data.roomId,
            entryDate: data.entryDate,
            exitDate: data.exitDate,
            status: StatusReservation.notConfirmed,
            created_at: new Date()
        };

        this.items.push(reservation);

        return reservation;
    }


    async delete(id: string) {
        const reservationes = this.items.filter((item) => item.id != id);
        const reservation = this.items.filter((item) => item.id == id)[0];

        this.items = reservationes;

        return reservation;
    }

    async update(id: string, data: Prisma.ReservationUpdateInput | { userId?: string, roomId?: string, entryDate?: Date | string, exitDate?: Date | string, status?: string }) {

        const typeRoomOld = this.items.filter(user => user.id == id)[0];
        const indexReservation = this.items.indexOf(typeRoomOld);

        const mergeObject = Object.assign(typeRoomOld, data);

        this.items[indexReservation] = mergeObject;

        return mergeObject;

    }
}