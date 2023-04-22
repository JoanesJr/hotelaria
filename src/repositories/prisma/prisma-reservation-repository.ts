import { prisma } from '@/lib/prisma';
import { Reservation, Prisma, } from '@prisma/client';
import { ReservationRepository } from '../reservation-repository';
import { StatusReservation } from '@/use-cases/userCases/reservation';

export class PrismaReservationRepository implements ReservationRepository {
    async findReservation(roomId: string, entryDate: string | Date): Promise<Reservation> {
        const reservartion = await prisma.reservation.findFirst({
            where: {
                entryDate: {
                    gte: entryDate
                },
                exitDate: {
                    lte: entryDate
                },
                roomId: roomId
            }
        });

        return reservartion;
    }

    async findByUser(userId: string) {
        const reservartion = await prisma.reservation.findMany({
            where: {
                userId: userId,
                status: {
                    not: {
                        equals: StatusReservation.canceled
                    }
                }
            },
            include: {
                CheckIn: {
                    where: {
                        id: {
                            not: undefined
                        }
                    }
                },
            }
        });

        return reservartion.length;
    }

    async findAll(): Promise<Reservation[] | null> {
        const reservation = await prisma.reservation.findMany();

        return reservation;
    }

    async findById(id: string): Promise<Reservation | null> {
        const reservation = await prisma.reservation.findUnique({
            where: {
                id
            }
        });

        return reservation;
    }

    async create(data: { userId: string, roomId: string, entryDate: Date | string, exitDate: Date | string, status: string }) {
        const reservation = await prisma.reservation.create({
            data,
        });

        return reservation;
    }

    async delete(id: string): Promise<Reservation> {
        const reservation = await prisma.reservation.delete({
            where: {
                id
            }
        });

        return reservation;
    }

    async update(id: string, data: Prisma.ReservationUpdateInput): Promise<Reservation> {
        const reservation = await prisma.reservation.update({
            data,
            where: {
                id
            }
        });

        return reservation;
    }
}