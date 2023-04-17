import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { describe, expect, it, beforeEach } from 'vitest';
import { UserUseCase } from '../user';
import { UsersRepository } from '@/repositories/users-repository';
import { AddressRepository } from '@/repositories/address-repository';
import { AddressAlreadyExistsError } from '../../errors/address-already-exists-error';
import { InMemoryAddresssRepository } from '@/repositories/in-memory/in-memory-address-repository';
import { AddressUseCase } from '../address';

let usersRepository: UsersRepository;
let sut: UserUseCase;
let addressRepository: AddressRepository;
let sutAddress: AddressUseCase;

describe('Register Address Use Case', () => {

    beforeEach(() => {
        addressRepository = new InMemoryAddresssRepository();
        usersRepository = new InMemoryUsersRepository();
        sutAddress = new AddressUseCase(addressRepository);
        sut = new UserUseCase(usersRepository);
    });

    it('should be add address', async () => {
        const { user } = await sut.register({
            name: 'Joanes de Jesus Nunes Junior',
            email: 'example@email.com',
            password: 'teste1234',
            birthday: '2002-04-30T00:00:00',
            cpf: '12345678901',
            privilege: 'basic'
        });

        const data = {
            street: 'Rua A',
            neighborhood: 'Bairro A',
            cep: '45936000',
            userId: user.id,
            created_at: new Date()
        };

        const { address } = await sutAddress.register(data);

        expect(address.id).toEqual(expect.any(String));
    });

    it('should not be add more than 1 address to same user', async () => {
        const { user } = await sut.register({
            name: 'Joanes de Jesus Nunes Junior',
            email: 'example@email.com',
            password: 'teste1234',
            birthday: '2002-04-30T00:00:00',
            cpf: '12345678901',
            privilege: 'basic'
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