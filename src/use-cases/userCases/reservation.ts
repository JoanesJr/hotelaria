import { ReservationRepository } from '@/repositories/reservation-repository';
import { Reservation, Prisma } from '@prisma/client';
import { z } from 'zod';
import { ReservationAlreadyExistsError } from '../errors/reservartion-already-exists-error';
import { DataNotFoundError } from '../errors/data-not-found-error';
import { differenceInDays } from 'date-fns';
import { ReservationInvalidError } from '../errors/reservartion-invalid-error';
import { ReservationLimitError } from '../errors/reservartion-limit-error copy';

export enum StatusReservation {
    notConfirmed = 'Nao Confirmada',
    confirmed = 'Confirmada',
    canceled = 'Cancelada'
}

interface ReservationUseCaseRequest {
    userId: string
    roomId: string
    entryDate: Date | string
    exitDate: Date | string
    status: StatusReservation
}

interface ReservationUseCaseResponse {
    reservation: Reservation
}


export class ReservationUseCase {
    constructor(private readonly repository: ReservationRepository) { }

    async findAll(): Promise<Reservation[] | null> {
        const reservationes = await this.repository.findAll();

        return reservationes;
    }

    async findById(id: string): Promise<Reservation | null> {
        const reservation = await this.repository.findById(id);

        return reservation;
    }


    async register(dt: ReservationUseCaseRequest): Promise<ReservationUseCaseResponse> {
        const maxDaysReservated = 7;

        const reservationValidationSchema = z.object({
            userId: z.string(),
            roomId: z.string(),
            entryDate: z.string().datetime(),
            exitDate: z.string().datetime(),
            status: z.enum(Object.values(StatusReservation))
        });

        const data = reservationValidationSchema.parse(dt);
        const daysReservation = differenceInDays(new Date(data.exitDate), new Date(data.entryDate));

        if (daysReservation < 1) {
            throw new ReservationInvalidError();
        }

        if (daysReservation > maxDaysReservated) {
            throw new ReservationLimitError();
        }

        const reservationAlreadyExists = await this.repository.findReservation(data.roomId, data.entryDate);

        if (reservationAlreadyExists) {
            throw new ReservationAlreadyExistsError();
        }

        const reservation = await this.repository.create({
            userId: data.userId,
            roomId: data.roomId,
            entryDate: data.entryDate,
            exitDate: data.exitDate,
            status: data.status,
        });

        return { reservation };
    }

    async update(id: string, data: Prisma.ReservationUpdateInput) {

        const existThisReservation = await this.repository.findById(id);

        if (!existThisReservation || !id) {
            throw new DataNotFoundError();
        }
        const maxDaysReservated = 7;

        const validationSchema = z.object({
            userId: z.string().optional(),
            roomId: z.string().optional(),
            entryDate: z.string().datetime().optional(),
            exitDate: z.string().datetime().optional(),
            status: z.enum(Object.values(StatusReservation)).optional()
        });

        const dataReservation = validationSchema.parse(data);

        const reservationAlreadyExists = await this.repository.findReservation(dataReservation.roomId, dataReservation.entryDate);

        if (reservationAlreadyExists && reservationAlreadyExists.id != id) {
            throw new ReservationAlreadyExistsError();
        }


        if (dataReservation.entryDate || dataReservation.exitDate) {
            let daysReservation = 1;

            if (dataReservation.entryDate && dataReservation.exitDate) {
                daysReservation = differenceInDays(new Date(dataReservation.exitDate), new Date(dataReservation.entryDate));
            }

            if (dataReservation.entryDate && !dataReservation.exitDate) {
                daysReservation = differenceInDays(new Date(existThisReservation.exitDate), new Date(dataReservation.entryDate));
            }

            if (!dataReservation.entryDate && dataReservation.exitDate) {
                daysReservation = differenceInDays(new Date(dataReservation.exitDate), new Date(existThisReservation.entryDate));
            }



            if (daysReservation < 1) {
                throw new ReservationInvalidError();
            }

            if (daysReservation > maxDaysReservated) {
                throw new ReservationLimitError();
            }
        }


        const updatedReservation = await this.repository.update(id, dataReservation);

        return { reservation: updatedReservation };
    }

    async delete(id: string) {
        const bodySchemaValidation = z.object({
            id: z.string()
        });

        const data = bodySchemaValidation.parse({ id });

        const existsReservation = await this.repository.findById(data.id);

        if (!existsReservation) {
            throw new DataNotFoundError();
        }

        const reservation = await this.repository.delete(data.id);

        return reservation;
    }

    async findReservation(dt: { roomId: string, entryDate: Date }) {
        const reservationValidationSchema = z.object({
            roomId: z.string(),
            entryDate: z.string().datetime(),
        });

        const data = reservationValidationSchema.parse(dt);

        const reservation = await this.repository.findReservation(data.roomId, data.entryDate);

        return { reservation };
    }


}