
import { PrismaAccountRepository } from '@/repositories/prisma/prisma-account-repository';
import { AccountUseCase } from '../userCases/account';
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-checkIn-repository';

export function makeAccountsUseCase() {
    const repository = new PrismaAccountRepository();
    const checkInRepository = new PrismaCheckInsRepository();
    const checkinUseCase = new AccountUseCase(repository, checkInRepository);

    return checkinUseCase;
}