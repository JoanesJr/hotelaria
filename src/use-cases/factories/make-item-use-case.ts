import { PrismaItemsRepository } from '@/repositories/prisma/prisma-items-repository';
import { ItemUseCase } from '../userCases/item';

export function makeItemUseCase() {
    const itemsRepository = new PrismaItemsRepository();
    const registerItemCase = new ItemUseCase(itemsRepository);

    return registerItemCase;
}