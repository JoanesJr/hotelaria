import { AddressRepository } from '@/repositories/address-repository';
import { Address } from '@prisma/client';
import { z } from 'zod';
import { AddressAlreadyExistsError } from '../errors/address-already-exists-error';

interface AddressUseCaseRequest {
    street: string
    neighborhood: string
    cep: string
    userId: string
}

interface AddressUseCaseResponse {
    address: Address
}

export class AddressUseCase {
    constructor(private readonly repository: AddressRepository) { }

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


}