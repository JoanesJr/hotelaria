import { prismaTst as prisma } from '@/lib/prisma-tst';
import { Prisma, CheckIn } from '@prisma/client';
import { CheckInRepository } from '../checkin-repository';

export class PrismaTstCheckInsRepository implements CheckInRepository {

    async findAll(): Promise<CheckIn[] | null> {
        const checkIn = await prisma.checkIn.findMany();

        return checkIn;
    }

    async findById(id: string): Promise<CheckIn | null> {
        const checkIn = await prisma.checkIn.findUnique({
            where: {
                id
            }
        });

        return checkIn;
    }

    async findByReservation(reservationId: string) {
        const checkin = await prisma.checkIn.findUnique({
            where: {
                reservationId
            }
        });

        return checkin;
    }

    async create(data: Prisma.CheckInCreateInput): Promise<CheckIn> {
        const checkIn = await prisma.checkIn.create({
            data
        });

        return checkIn;
    }

    async delete(id: string): Promise<CheckIn> {
        const checkIn = await prisma.checkIn.delete({
            where: {
                id
            }
        });

        return checkIn;
    }

    async deleteAll() {
        await prisma.checkIn.deleteMany();
    }
}