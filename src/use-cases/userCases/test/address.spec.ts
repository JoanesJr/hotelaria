import { describe, expect, it, beforeEach } from 'vitest';
import { UserUseCase } from '../user';
import { AddressAlreadyExistsError } from '../../errors/address-already-exists-error';
import { AddressUseCase } from '../address';
import { DataNotFoundError } from '@/use-cases/errors/data-not-found-error';
import { PrismaTstUsersRepository } from '@/repositories/prisma-tst/prisma-tst-users-repository';
import { PrismaTstAddresssRepository } from '@/repositories/prisma-tst/prisma-tst-address-repository';
import { MaritalStatus } from '@/http/controllers/users';
import { exec as execCallback } from 'node:child_process';
import { promisify } from 'node:util';

const exec = promisify(execCallback);

const usersRepository = new PrismaTstUsersRepository();
const sut = new UserUseCase(usersRepository);
const addressRepository = new PrismaTstAddresssRepository();
const sutAddress = new AddressUseCase(addressRepository);


async function cleanModel() {
    await exec('npx prisma migrate reset --force');
}

describe('Register Address Use Case', () => {

    beforeEach(async () => {
        await cleanModel();
    });

    it('should be add address', async () => {
        const { user } = await sut.register({
            name: 'Joanes de Jesus Nunes Junior',
            email: 'example@email.com',
            password: 'teste1234',
            birthday: new Date('2002-04-30'),
            cpf: '12345678901',
            privilege: 'basic',
            maritalStatus: MaritalStatus.casado
        });

        const data = {
            street: 'Rua A',
            neighborhood: 'Bairro A',
            cep: '45936000',
            userId: user.id,
        };

        const { address } = await sutAddress.register(data);

        expect(address.id).toEqual(expect.any(String));
    });

    it('should not be add more than 1 address to same user', async () => {
        const { user } = await sut.register({
            name: 'Joanes de Jesus Nunes Junior',
            email: 'example@email.com',
            password: 'teste1234',
            birthday: new Date('2002-04-30'),
            cpf: '12345678901',
            privilege: 'basic',
            maritalStatus: MaritalStatus.casado
        });

        const data = {
            street: 'Rua A',
            neighborhood: 'Bairro A',
            cep: '45936000',
            userId: user.id,
            created_at: new Date()
        };

        const { address } = await sutAddress.register(data);

        await expect(() => sutAddress.register(data)).rejects.toBeInstanceOf(AddressAlreadyExistsError);
    });


});

describe('UpdateAddress Use Case', () => {
    beforeEach(async () => {
        await cleanModel();
    });

    it('should be update address', async () => {
        const { user } = await sut.register({
            name: 'Joanes de Jesus Nunes Junior',
            email: 'example@email.com',
            password: 'teste1234',
            birthday: new Date('2002-04-30'),
            cpf: '12345678901',
            privilege: 'basic',
            maritalStatus: MaritalStatus.casado
        });

        const data = {
            street: 'Rua A',
            neighborhood: 'Bairro A',
            cep: '45936000',
            userId: user.id,
        };



        const { address } = await sutAddress.register(data);

        await sutAddress.update(address.id, { street: 'Rua B' });

        const getAddressUpdated = await sutAddress.findById(address.id);

        expect(getAddressUpdated.street).toEqual('Rua B');
    });

    it('should not be update address when  id not exists', async () => {

        await expect(sutAddress.update('id-not-found', { street: 'Joanes' })).rejects.toBeInstanceOf(DataNotFoundError);
    });
});

describe('DeleteAddress Use Case', () => {
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
            maritalStatus: MaritalStatus.casado
        });

        const data = {
            street: 'Rua A',
            neighborhood: 'Bairro A',
            cep: '45936000',
            userId: user.id,
        };

        const { address } = await sutAddress.register(data);

        const addressDelete = await sutAddress.delete(address.id);
        const newAddress = await sutAddress.findById(addressDelete.id);

        expect(newAddress).toBeNull();
    });

    it('should not be delete not exists address id', async () => {

        await expect(() => sutAddress.delete('id-not-found')).rejects.toBeInstanceOf(DataNotFoundError);
    });
});