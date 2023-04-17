
import { AddressUseCase } from '../userCases/address';
import { PrismaAddresssRepository } from '@/repositories/prisma/prisma-address-repository';

export function makeAddressUseCase() {
    const repository = new PrismaAddresssRepository();
    const addressUseCase = new AddressUseCase(repository);

    return addressUseCase;
}