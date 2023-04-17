import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { UserUseCase } from '../userCases/user';

export function makeUserUseCase() {
    const usersRepository = new PrismaUsersRepository();
    const registerUserCase = new UserUseCase(usersRepository);

    return registerUserCase;
}