import { AddressRepository } from '@/repositories/address-repository';
import { Address, Prisma } from '@prisma/client';
import { z } from 'zod';
import { AddressAlreadyExistsError } from '../errors/address-already-exists-error';
import { DataNotFoundError } from '../errors/data-not-found-error';

interface AddressUseCaseRequest {
    street: string
    neighborhood: string
    cep: string
    userId: string
}

interface AddressUseCaseResponse {
    address: Address
}

interface EditDeleteUseCaseRequest {
    id: string
}

export class AddressUseCase {
    constructor(private readonly repository: AddressRepository) { }

    async findAll(): Promise<Address[] | null> {
        const addresses = await this.repository.findAll();

        return addresses;
    }

    async findById(id: string): Promise<Address | null> {
        const address = await this.repository.findById(id);

        return address;
    }


    async register(dt: AddressUseCaseRequest): Promise<AddressUseCaseResponse> {

        const addressValidationSchema = z.object({
            street: z.string().min(3),
            neighborhood: z.string().min(2),
            cep: z.string(),
            userId: z.string()
        });

        const data = addressValidationSchema.parse(dt);
        const addressWithSameUser = await this.repository.findByUser(data.userId);

        if (addressWithSameUser) {
            throw new AddressAlreadyExistsError();
        }

        const address = await this.repository.create({
            street: data.street,
            neighborhood: data.neighborhood,
            cep: data.cep,
            userId: data.userId,
            created_at: new Date()
        });

        return { address };
    }

    async update(id: string, data: Prisma.AddressUpdateInput) {
        const validationSchema = z.object({
            street: z.string().min(3).optional(),
            neighborhood: z.string().min(2).optional(),
            cep: z.string().optional(),
            userId: z.string().optional()
        });

        const dataAddress = validationSchema.parse(data);

        const addressExists = await this.repository.findById(id);

        if (!addressExists || !id) {
            throw new DataNotFoundError();
        }

        const updatedAddress = await this.repository.update(id, dataAddress);

        return { address: updatedAddress };
    }

    async delete(id: string) {
        const bodySchemaValidation = z.object({
            id: z.string()
        });

        const data = bodySchemaValidation.parse({ id });

        const existsAddress = await this.repository.findById(data.id);

        if (!existsAddress) {
            throw new DataNotFoundError();
        }

        const address = await this.repository.delete(data.id);

        return address;
    }


}