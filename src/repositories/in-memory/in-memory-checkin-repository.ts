import { CheckInRepository } from '@/repositories/checkin-repository';
import { CheckIn, Prisma } from '@prisma/client';
import { randomUUID } from 'node:crypto';

export class InMemoryCheckInsRepository implements CheckInRepository {
    public checkins: CheckIn[] = [];

    async findAll(): Promise<CheckIn[]> {
        return this.checkins;
    }

    async findById(id: string) {
        const checkin = this.checkins.find((checkin) => checkin.id === id);

        if (!checkin) {
            return null;
        }

        return checkin;
    }

    async findByReservation(reservationId: string) {
        const checkin = this.checkins.find((checkin) => checkin.reservationId === reservationId);

        if (!checkin) {
            return null;
        }

        return checkin;
    }

    async create(data: { reservationId: string }) {
        const checkin = {
            id: randomUUID(),
            reservationId: data.reservationId
        };

        this.checkins.push(checkin);

        return checkin;
    }

    async delete(id: string) {
        const checkins = this.checkins.filter((checkin) => checkin.id != id);
        const checkin = this.checkins.filter((checkin) => checkin.id == id)[0];

        this.checkins = checkins;

        return checkin;
    }
}