import { ItemsRepository } from '@/repositories/items-repository';
import { Item } from '@prisma/client';
import { z } from 'zod';
import { ItemAlreadyExistsError } from '../errors/item-already-exists-error';
import { DataNotFoundError } from '../errors/data-not-found-error';
import { Prisma } from '@prisma/client';

interface RegisterUseCaseRequest {
    name: string,
    info: string,
    price: number
}

interface RegisterUseCaseResponse {
    item: Item
}

interface EditDeleteUseCaseRequest {
    id: string
}

export class ItemUseCase {

    constructor(private readonly repository: ItemsRepository) { }

    async findAll(): Promise<Item[] | null> {
        const items = await this.repository.findAll();

        return items;
    }

    async findById(id: string): Promise<RegisterUseCaseResponse | null> {
        const item = await this.repository.findById(id);

        return { item };
    }

    async register(request: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
        const registerValidationSchema = z.object({
            name: z.string().min(3),
            info: z.string().optional(),
            price: z.number()
        });

        const data = registerValidationSchema.parse(request);

        const nameWithSameItem = await this.repository.findByName(data.name);

        if (nameWithSameItem) {
            throw new ItemAlreadyExistsError();
        }


        const item = await this.repository.create(data);

        return { item };

    }

    async delete(id: string) {
        const bodySchemaValidation = z.object({
            id: z.string()
        });

        const data = bodySchemaValidation.parse({ id });

        const existsItem = await this.repository.findById(data.id);

        if (!existsItem) {
            throw new DataNotFoundError();
        }

        const item = await this.repository.delete(data.id);

        return { item };
    }

    async update(id: string, data: Prisma.ItemUpdateInput) {
        const validationSchema = z.object({
            name: z.string().min(3),
            info: z.string().optional(),
            price: z.number().optional()
        });

        const dataItem = validationSchema.parse(data);

        const itemExists = await this.repository.findById(id);

        if (!itemExists || !id) {
            throw new DataNotFoundError();
        }

        if (dataItem.name) {
            const nameAlreadyExists = await this.repository.findByName(dataItem.name);

            if (nameAlreadyExists && nameAlreadyExists.id != id) {
                throw new ItemAlreadyExistsError();
            }
        }

        const updatedItem = await this.repository.update(id, dataItem);

        return { item: updatedItem };
    }
}