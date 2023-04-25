import { describe, expect, it, beforeEach, afterAll } from 'vitest';
import { UserUseCase } from '../user';
import { UserAlreadyExistsError } from '../../errors/user-already-exists-error';
import { CpfIsInvalidError } from '../../errors/cpf-is-invalid-error';
import { MajorityError } from '../../errors/majority-error';
import { DataNotFoundError } from '@/use-cases/errors/data-not-found-error';
import { PrismaTstUsersRepository } from '@/repositories/prisma-tst/prisma-tst-users-repository';
import { MaritalStatus } from '@/http/controllers/users';
import { exec as execCallback } from 'node:child_process';
import { promisify } from 'node:util';

const exec = promisify(execCallback);

const usersRepository = new PrismaTstUsersRepository();
const sut = new UserUseCase(usersRepository);


async function cleanModel() {
    await exec('npx prisma migrate reset --force');
}

describe('RegisterUser Use Case', () => {

    beforeEach(async () => {
        await cleanModel();
    });



    it('should be register users', async () => {
        const { user } = await sut.register({
            name: 'Joanes de Jesus Nunes Junior',
            email: 'example@email.com',
            password: 'teste1234',
            birthday: new Date('2002-04-30'),
            cpf: '12345678901',
            privilege: 'basic',
            maritalStatus: MaritalStatus.solteiro
        });

        expect(user.id).toEqual(expect.any(String));
    });

    it('should not be register with same email or cpf', async () => {
        const data = {
            name: 'Joanes de Jesus Nunes Junior',
            email: 'example@email.com',
            password: 'teste1234',
            birthday: new Date('2002-04-30'),
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
            birthday: new Date('2002-04-30'),
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
    beforeEach(async () => {
        await cleanModel();
    });



    it('should be delete user', async () => {
        const { user } = await sut.register({
            name: 'Joanes de Jesus Nunes Junior',
            email: 'example@email.com',
            password: 'teste1234',
            birthday: new Date('2002-04-30'),
            cpf: '12345678901',
            privilege: 'basic',
            maritalStatus: MaritalStatus.solteiro
        });

        const userDelete = await sut.delete(user.id);
        const findUserDelete = await sut.findById(user.id);


        expect(findUserDelete).toBeNull();
    });

    it('should not be delete not exists user id', async () => {

        await expect(() => sut.delete('id-not-found')).rejects.toBeInstanceOf(DataNotFoundError);
    });
});

describe('UpdateUser Use Case', () => {
    beforeEach(async () => {
        await cleanModel();
    });


    it('should be update user', async () => {
        const { user } = await sut.register({
            name: 'Joanes de Jesus Nunes Junior',
            email: 'example@email.com',
            password: 'teste1234',
            birthday: new Date('2002-04-30'),
            cpf: '12345678901',
            privilege: 'basic',
            maritalStatus: MaritalStatus.casado
        });

        const userUpdated = await sut.update(user.id, {
            name: 'Joanes'
        });

        const getUserUpdated = await sut.findById(user.id);

        expect(getUserUpdated.name).toEqual('Joanes');
    });

    it('should not be update user when  id not exists', async () => {

        await expect(sut.update('id-not-found', { name: 'Joanes' })).rejects.toBeInstanceOf(DataNotFoundError);
    });

    it('should not be update user when email already exists other user', async () => {
        await sut.register({
            name: 'Joanes de Jesus Nunes Junior',
            email: 'example@email.com',
            password: 'teste1234',
            birthday: new Date('2002-04-30'),
            cpf: '12345678901',
            privilege: 'basic',
            maritalStatus: MaritalStatus.casado
        });

        const { user } = await sut.register({
            name: 'Joanes de Jesus Nunes Junior',
            email: 'example2@email.com',
            password: 'teste1234',
            birthday: new Date('2002-04-30'),
            cpf: '12345678902',
            privilege: 'basic',
            maritalStatus: MaritalStatus.casado
        });


        await expect(sut.update(user.id, { email: 'example@email.com' })).rejects.toBeInstanceOf(UserAlreadyExistsError);
    });
});