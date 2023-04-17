import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { describe, expect, it, beforeEach } from 'vitest';
import { UserUseCase } from '../user';
import { UserAlreadyExistsError } from '../../errors/user-already-exists-error';
import { CpfIsInvalidError } from '../../errors/cpf-is-invalid-error';
import { MajorityError } from '../../errors/majority-error';
import { UsersRepository } from '@/repositories/users-repository';
import { DataNotFoundError } from '@/use-cases/errors/data-not-found-error';

let usersRepository: UsersRepository;
let sut: UserUseCase;

describe('RegisterUser Use Case', () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new UserUseCase(usersRepository);
    });

    it('should be register users', async () => {
        const { user } = await sut.register({
            name: 'Joanes de Jesus Nunes Junior',
            email: 'example@email.com',
            password: 'teste1234',
            birthday: '2002-04-30T00:00:00',
            cpf: '12345678901',
            privilege: 'basic'
        });

        expect(user.id).toEqual(expect.any(String));
    });

    it('should not be register with same email or cpf', async () => {
        const data = {
            name: 'Joanes de Jesus Nunes Junior',
            email: 'example@email.com',
            password: 'teste1234',
            birthday: '2002-04-30T00:00:00',
            cpf: '12345678901',
            privilege: 'basic'
        };

        await sut.register(data);

        data.cpf = '12345678902';

        await expect(() => sut.register(data)).rejects.toBeInstanceOf(UserAlreadyExistsError);
    });


    it('should not be register with invalid cpf', async () => {
        const data = {
            name: 'Joanes de Jesus Nunes Junior',
            email: 'example@email.com',
            password: 'teste1234',
            birthday: '2002-04-30T00:00:00',
            cpf: '1234567890',
            privilege: 'basic'
        };


        await expect(() => sut.register(data)).rejects.toBeInstanceOf(CpfIsInvalidError);
    });

    it('should not be register with less 18 yerars old', async () => {
        const data = {
            name: 'Joanes de Jesus Nunes Junior',
            email: 'example@email.com',
            password: 'teste1234',
            birthday: new Date(),
            cpf: '12345678901',
            privilege: 'basic'
        };

        await expect(() => sut.register(data)).rejects.toBeInstanceOf(MajorityError);
    });
});

describe('DeleteUser Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new UserUseCase(usersRepository);
    });

    it('should be delete user', async () => {
        const { user } = await sut.register({
            name: 'Joanes de Jesus Nunes Junior',
            email: 'example@email.com',
            password: 'teste1234',
            birthday: '2002-04-30T00:00:00',
            cpf: '12345678901',
            privilege: 'basic'
        });

        const userDelete = await sut.delete(user.id);
        const newUsers = await sut.findAll();
        const existsUser = newUsers.filter((user) => user.id === userDelete.user.id);

        expect(existsUser).toHaveLength(0);
    });

    it('should not be delete not exists user id', async () => {

        await expect(() => sut.delete('id-not-found')).rejects.toBeInstanceOf(DataNotFoundError);
    });
});

describe('UpdateUser Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new UserUseCase(usersRepository);
    });

    it('should be update user', async () => {
        const { user } = await sut.register({
            name: 'Joanes de Jesus Nunes Junior',
            email: 'example@email.com',
            password: 'teste1234',
            birthday: '2002-04-30T00:00:00',
            cpf: '12345678901',
            privilege: 'basic'
        });

        const userUpdated = await sut.update(user.id, {
            name: 'Joanes'
        });

        const getUserUpdated = await sut.findById(user.id);

        expect(getUserUpdated.name).toEqual('Joanes');
    });

    it('should not be update user when  id not exists', async () => {
        const { user } = await sut.register({
            name: 'Joanes de Jesus Nunes Junior',
            email: 'example@email.com',
            password: 'teste1234',
            birthday: '2002-04-30T00:00:00',
            cpf: '12345678901',
            privilege: 'basic'
        });


        await expect(sut.update('id-not-found', { name: 'Joanes' })).rejects.toBeInstanceOf(DataNotFoundError);
    });

    it('should not be update user when email already exists other user', async () => {
        await sut.register({
            name: 'Joanes de Jesus Nunes Junior',
            email: 'example@email.com',
            password: 'teste1234',
            birthday: '2002-04-30T00:00:00',
            cpf: '12345678901',
            privilege: 'basic'
        });

        const { user } = await sut.register({
            name: 'Joanes de Jesus Nunes Junior',
            email: 'example2@email.com',
            password: 'teste1234',
            birthday: '2002-04-30T00:00:00',
            cpf: '12345678902',
            privilege: 'basic'
        });


        await expect(sut.update(user.id, { email: 'example@email.com' })).rejects.toBeInstanceOf(UserAlreadyExistsError);
    });
});