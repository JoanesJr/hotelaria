

import { PrismaAccountItemRepository } from '@/repositories/prisma/prisma-account-item-repository';
import { AccountItemUseCase } from '../userCases/account-item';
import { PrismaAccountRepository } from '@/repositories/prisma/prisma-account-repository';

export function makeAccountItemUseCase() {
    const repository = new PrismaAccountItemRepository();
    const accountRepository = new PrismaAccountRepository();
    const accountItemUseCase = new AccountItemUseCase(repository, accountRepository);

    return accountItemUseCase;
}