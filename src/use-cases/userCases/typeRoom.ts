import { TypeRoomRepository } from '@/repositories/typeRoom-repository';
import { TypeRoom } from '@prisma/client';
import { z } from 'zod';
import { TypeRoomAlreadyExistsError } from '../errors/typeRoom-already-exists-error';
import { DataNotFoundError } from '../errors/data-not-found-error';
import { Prisma } from '@prisma/client';

interface RegisterUseCaseRequest {
    name: string
}

interface RegisterUseCaseResponse {
    typeRoom: TypeRoom
}

interface EditDeleteUseCaseRequest {
    id: string
}

export class TypeRoomUseCase {

    constructor(private readonly repository: TypeRoomRepository) { }

    async findAll(): Promise<TypeRoom[] | null> {
        const typeRooms = await this.repository.findAll();

        return typeRooms;
    }

    async findById(id: string): Promise<TypeRoom | null> {
        const typeRoom = await this.repository.findById(id);

        return typeRoom;
    }


    async register({ name }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
        const registerValidationSchema = z.object({
            name: z.string().min(3)
        });

        const data = registerValidationSchema.parse({ name });

        const nameWithSameTypeRoom = await this.repository.findByName(data.name);

        if (nameWithSameTypeRoom) {
            throw new TypeRoomAlreadyExistsError();
        }


        const typeRoom = await this.repository.create(data);

        return { typeRoom };

    }

    async delete({ id }: EditDeleteUseCaseRequest) {
        const bodySchemaValidation = z.object({
            id: z.string()
        });

        const data = bodySchemaValidation.parse({ id });

        const existsTypeRoom = await this.repository.findById(data.id);

        if (!existsTypeRoom) {
            throw new DataNotFoundError();
        }

        const typeRoom = await this.repository.delete(data.id);

        return { typeRoom };
    }

    async update(id: string, data: Prisma.TypeRoomUpdateInput) {
        const validationSchema = z.object({
            name: z.string().min(3).optional()
        });

        const dataTypeRoom = validationSchema.parse(data);

        const typeRoomExists = await this.repository.findById(id);

        if (!typeRoomExists || !id) {
            throw new DataNotFoundError();
        }

        if (dataTypeRoom.name) {
            const nameAlreadyExists = await this.repository.findByName(dataTypeRoom.name);

            if (nameAlreadyExists && nameAlreadyExists.id != id) {
                throw new TypeRoomAlreadyExistsError();
            }
        }

        const updatedTypeRoom = await this.repository.update(id, dataTypeRoom);

        return updatedTypeRoom;
    }
}