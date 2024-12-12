import { Prisma, User } from '@prisma/client';

export interface UsersRepository {
    findById(id: string): Promise<User | null>
    findByEmail(email: string): Promise<User | null>
    findByUniques(cpf: string, rg: string, email: string): Promise<User | null>
    findByCpf(cpf: string): Promise<User | null>
    findAll(): Promise<User[] | null>
    create(data: Prisma.UserCreateInput): Promise<User>
    delete(id: string): Promise<User>;
    update(id: string, data: Prisma.UserUpdateInput): Promise<User>
}