import { UsersRepository } from '@/repositories/users-repository';
import { hash } from 'bcryptjs';
import { Prisma, User } from '@prisma/client';
import { UserAlreadyExistsError } from '../errors/user-already-exists-error';
import { CpfIsInvalidError } from '../errors/cpf-is-invalid-error';
import { differenceInYears } from 'date-fns';
import { MajorityError } from '../errors/majority-error';
import { z } from 'zod';
import { DataNotFoundError } from '../errors/data-not-found-error';



interface RegisterUseCaseRequest {
    name: string
    email: string
    password: string
    cpf: string
    birthday: string | Date
    privilege: string
}

interface UseCaseResponse {
    user: User
}

interface EditDeleteUseCaseRequest {
    id: string
}

export class UserUseCase {

    constructor(private usersRepository: UsersRepository) { }

    async findAll(): Promise<User[] | null> {
        const users = await this.usersRepository.findAll();

        return users;
    }

    async findById(id: string): Promise<User | null> {
        const user = await this.usersRepository.findById(id);

        return user;
    }

    async findByCpf(cpf: string): Promise<User | null> {
        const user = await this.usersRepository.findByCpf(cpf);

        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.usersRepository.findByEmail(email);

        return user;
    }

    async register({ name, email, password, cpf, birthday, privilege = 'basic' }: RegisterUseCaseRequest): Promise<UseCaseResponse> {
        const password_hash = await hash(password, 6);

        const userWithSameEmail = await this.usersRepository.findByEmail(email);
        const userWithSameCpf = await this.usersRepository.findByCpf(cpf);
        const age = differenceInYears(new Date(), new Date(birthday));

        if (cpf.length != 11) {
            throw new CpfIsInvalidError();
        }

        if (age < 18) {
            throw new MajorityError();
        }

        if (userWithSameEmail || userWithSameCpf) {
            throw new UserAlreadyExistsError();
        }


        const user = await this.usersRepository.create({
            name,
            email,
            password_hash,
            cpf,
            birthday,
            privilege
        });


        return { user };

    }

    async delete(id: string) {
        const bodySchemaValidation = z.object({
            id: z.string()
        });

        const data = bodySchemaValidation.parse({ id });

        const existsUser = await this.usersRepository.findById(data.id);

        if (!existsUser) {
            throw new DataNotFoundError();
        }

        const user = await this.usersRepository.delete(data.id);

        return { user };
    }

    async update(id: string, data: Prisma.UserUpdateInput) {
        const validationSchema = z.object({
            name: z.string().min(3).optional(),
            email: z.string().email().optional(),
            cpf: z.string().min(11).max(11).optional(),
            password: z.string().optional(),
            privilege: z.string().optional(),
            birthday: z.string().datetime().optional()
        });

        const dataUser = validationSchema.parse(data);

        const userExists = await this.usersRepository.findById(id);

        if (!userExists || !id) {
            throw new DataNotFoundError();
        }

        if (dataUser.email) {
            const emailAlreadyExists = await this.usersRepository.findByEmail(dataUser.email);

            if (emailAlreadyExists && emailAlreadyExists.id != id) {
                throw new UserAlreadyExistsError();
            }
        }

        if (dataUser.cpf) {
            const cpfAlreadyExists = await this.usersRepository.findByCpf(dataUser.cpf);

            if (cpfAlreadyExists && cpfAlreadyExists.id != id) {
                throw new UserAlreadyExistsError();
            }
        }

        const updatedUser = await this.usersRepository.update(id, dataUser);

        return updatedUser;
    }

}