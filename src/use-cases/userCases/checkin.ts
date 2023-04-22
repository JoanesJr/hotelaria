import { CheckIn } from '@prisma/client';
import { z } from 'zod';
import { DataNotFoundError } from '../errors/data-not-found-error';
import { CheckInAlreadyExistsError } from '../errors/checkin-already-exists-error';
import { CheckInRepository } from '@/repositories/checkin-repository';
import { ReservationRepository } from '@/repositories/reservation-repository';
import { StatusReservation } from './reservation';
import { CheckInReservationNotConfirmedError } from '../errors/checkin-reservation-not-confirmed-error';

interface CheckInUseCaseRequest {
    reservationId: string
}

interface CheckInUseCaseResponse {
    checkIn: CheckIn
}

export class CheckInUseCase {

    constructor(private readonly repository: CheckInRepository, private readonly reservationRepository: ReservationRepository) { }

    async findAll(): Promise<CheckIn[] | null> {
        const checkins = await this.repository.findAll();

        return checkins;
    }

    async findById(id: string): Promise<CheckIn | null> {
        const checkin = await this.repository.findById(id);

        return checkin;
    }

    async findByReservation(reservationId: string): Promise<CheckIn | null> {
        const checkin = await this.repository.findByReservation(reservationId);

        return checkin;
    }

    async register(dt: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
        const registerValidationSchema = z.object({
            reservationId: z.string()
        });

        const data = registerValidationSchema.parse(dt);

        const nameWithSameReservation = await this.repository.findByReservation(data.reservationId);

        if (nameWithSameReservation) {
            throw new CheckInAlreadyExistsError();
        }

        const statusReservation = await this.reservationRepository.findById(data.reservationId);

        if (statusReservation.status != StatusReservation.confirmed) {
            throw new CheckInReservationNotConfirmedError();
        }


        const checkIn = await this.repository.create(data);

        return { checkIn };

    }

    async delete(id: string) {
        const bodySchemaValidation = z.object({
            id: z.string()
        });

        const data = bodySchemaValidation.parse({ id });

        const existsCheckin = await this.repository.findById(data.id);

        if (!existsCheckin) {
            throw new DataNotFoundError();
        }

        const checkin = await this.repository.delete(data.id);

        return checkin;
    }
}