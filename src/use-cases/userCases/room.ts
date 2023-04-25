import { RoomRepository } from '@/repositories/room-repository';
import { Room, Prisma } from '@prisma/client';
import { z } from 'zod';
import { RoomAlreadyExistsError } from '../errors/room-already-exists-error';
import { DataNotFoundError } from '../errors/data-not-found-error';

interface RoomUseCaseRequest {
    name: string
    info: string
    status: StatusRoom
    typeRoomId: string
}

interface RoomUseCaseResponse {
    room: Room
}

export enum StatusRoom {
    aberto = 'Aberto',
    ocupado = 'Ocupado',
    indisponivel = 'Indisponivel'
}

export class RoomUseCase {
    constructor(private readonly repository: RoomRepository) { }

    async findAll(): Promise<Room[] | null> {
        const rooms = await this.repository.findAll();

        return rooms;
    }

    async findById(id: string): Promise<RoomUseCaseResponse | null> {
        const room = await this.repository.findById(id);

        return { room };
    }


    async register(dt: RoomUseCaseRequest): Promise<RoomUseCaseResponse> {

        const roomValidationSchema = z.object({
            name: z.string().min(3),
            info: z.string().min(5),
            status: z.enum(Object.values(StatusRoom)),
            typeRoomId: z.string()
        });

        const data = roomValidationSchema.parse(dt);
        const roomWithSameCategory = await this.repository.findByTypeRoom(data.typeRoomId);

        if (roomWithSameCategory) {
            throw new RoomAlreadyExistsError();
        }

        const room = await this.repository.create({
            name: data.name,
            info: data.info,
            status: data.status,
            typeRoomId: data.typeRoomId
        });

        return { room };
    }

    async update(id: string, data: Prisma.RoomUpdateInput) {
        const validationSchema = z.object({
            name: z.string().min(3).optional(),
            info: z.string().min(5).optional(),
            status: z.enum(Object.values(StatusRoom)).optional(),
            typeRoomId: z.string().optional()
        });

        const dataRoom = validationSchema.parse(data);

        const roomExists = await this.repository.findById(id);

        if (!roomExists || !id) {
            throw new DataNotFoundError();
        }

        const updatedRoom = await this.repository.update(id, dataRoom);

        return { room: updatedRoom };
    }

    async delete(id: string) {
        const bodySchemaValidation = z.object({
            id: z.string()
        });

        const data = bodySchemaValidation.parse({ id });

        const existsRoom = await this.repository.findById(data.id);

        if (!existsRoom) {
            throw new DataNotFoundError();
        }

        const room = await this.repository.delete(data.id);

        return { room };
    }


}