import { RoomRepository } from '@/repositories/room-repository';
import { Room, Prisma } from '@prisma/client';
import { z } from 'zod';
import { RoomAlreadyExistsError } from '../errors/room-already-exists-error';
import { DataNotFoundError } from '../errors/data-not-found-error';

interface RoomUseCaseRequest {
    street: string
    neighborhood: string
    cep: string
    userId: string
}

interface RoomUseCaseResponse {
    room: Room
}

interface EditDeleteUseCaseRequest {
    id: string
}

export class RoomUseCase {
    constructor(private readonly repository: RoomRepository) { }

    async findAll(): Promise<Room[] | null> {
        const roomes = await this.repository.findAll();

        return roomes;
    }

    async findById(id: string): Promise<Room | null> {
        const room = await this.repository.findById(id);

        return room;
    }


    async register(dt: RoomUseCaseRequest): Promise<RoomUseCaseResponse> {

        const roomValidationSchema = z.object({
            street: z.string().min(3),
            neighborhood: z.string().min(2),
            cep: z.string(),
            userId: z.string()
        });

        const data = roomValidationSchema.parse(dt);
        const roomWithSameUser = await this.repository.findByUser(data.userId);

        if (roomWithSameUser) {
            throw new RoomAlreadyExistsError();
        }

        const room = await this.repository.create({
            street: data.street,
            neighborhood: data.neighborhood,
            cep: data.cep,
            userId: data.userId,
            created_at: new Date()
        });

        return { room };
    }

    async update(id: string, data: Prisma.RoomUpdateInput) {
        const validationSchema = z.object({
            street: z.string().min(3).optional(),
            neighborhood: z.string().min(2).optional(),
            cep: z.string().optional(),
            userId: z.string().optional()
        });

        const dataRoom = validationSchema.parse(data);

        const roomExists = await this.repository.findById(id);

        if (!roomExists || !id) {
            throw new DataNotFoundError();
        }

        const updatedRoom = await this.repository.update(id, dataRoom);

        return { typeRoom: updatedRoom };
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

        return room;
    }


}