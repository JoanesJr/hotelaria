import { describe, expect, it, beforeEach } from 'vitest';
import { exec as execCallback } from 'node:child_process';
import { promisify } from 'node:util';
import { CreateUserUseCase } from '../create-user-useCase';
import { PrismaUsersRepository } from '@/repositories/prisma-tst/prisma-users-repository';
import { PrismaPrivilegeRepository } from '@/repositories/prisma-tst/prisma-privilege-repository';
import { AlreadyExistsError } from '../../../errors/already-exists-error';

const exec = promisify(execCallback);

const usersRepository = new PrismaUsersRepository();
const privilegeRepository = new PrismaPrivilegeRepository();
const sut = new CreateUserUseCase(usersRepository);


async function cleanModel() {
    await exec('npx prisma migrate reset --force');
}

async function createAndReturnPrivilege() {
    await privilegeRepository.create({ name: 'basic', });
    const privilege = await privilegeRepository.findAll();
    return privilege[0];
}

describe('CreateUser Use Case', () => {
    beforeEach(async () => {
        await cleanModel();
    });


    it('should be createUser with success', async () => {
        const privilege = await createAndReturnPrivilege();
        const objUser = {
            name: 'Joanes',
            surname: 'Nunes Junior Lebarch',
            email: 'example@email.com',
            password_hash: 'teste1234',
            birthday: new Date('2002-04-30'),
            cpf: '12345678901',
            rg: '1627245678',
            privilege: privilege,
            active: true,
            address: {
                complement: '',
                neighboor: 'Gazinelandia',
                number: 70,
                reference: 'Próximo a Santos',
                streeth: 'Rua Itapebi',
            }
        };

        const user = await sut.execute(objUser);

        expect(user.id).toEqual(expect.any(String));
    });

    it('should not be register with same email', async () => {
        const privilege = await createAndReturnPrivilege();
        const objUser = {
            name: 'Joanes',
            surname: 'Nunes Junior Lebarch',
            email: 'example@email.com',
            password_hash: 'teste1234',
            birthday: new Date('2002-04-30'),
            cpf: '12345678901',
            rg: '1627245678',
            privilege: privilege,
            active: true,
            address: {
                complement: '',
                neighboor: 'Gazinelandia',
                number: 70,
                reference: 'Próximo a Santos',
                streeth: 'Rua Itapebi',
            }
        };
        const objUserTwo = {
            name: 'Joanes',
            surname: 'Nunes Junior Lebarch',
            email: 'example@email.com',
            password_hash: 'teste1234',
            birthday: new Date('2002-04-30'),
            cpf: '12345678909',
            rg: '1627245679',
            privilege: privilege,
            active: true,
            address: {
                create: {
                    complement: '',
                    neighboor: 'Gazinelandia',
                    number: 70,
                    reference: 'Próximo a Santos',
                    streeth: 'Rua Itapebi',
                }
            },
        };

        await sut.execute(objUser);
        await expect(() => sut.execute(objUserTwo)).rejects.toBeInstanceOf(AlreadyExistsError);
    });

    it('should not be register with same cpf', async () => {
        const privilege = await createAndReturnPrivilege();
        const objUser = {
            name: 'Joanes',
            surname: 'Nunes Junior Lebarch',
            email: 'example@email.com',
            password_hash: 'teste1234',
            birthday: new Date('2002-04-30'),
            cpf: '12345678901',
            rg: '1627245678',
            privilege: privilege,
            active: true,
            address: {
                complement: '',
                neighboor: 'Gazinelandia',
                number: 70,
                reference: 'Próximo a Santos',
                streeth: 'Rua Itapebi',
            }
        };
        const objUserTwo = {
            name: 'Joanes',
            surname: 'Nunes Junior Lebarch',
            email: 'example1@email.com',
            password_hash: 'teste1234',
            birthday: new Date('2002-04-30'),
            cpf: '12345678901',
            rg: '1627245679',
            privilege: privilege,
            active: true,
            address: {
                complement: '',
                neighboor: 'Gazinelandia',
                number: 70,
                reference: 'Próximo a Santos',
                streeth: 'Rua Itapebi',
            }
        };

        await sut.execute(objUser);
        await expect(() => sut.execute(objUserTwo)).rejects.toBeInstanceOf(AlreadyExistsError);
    });

    it('should not be register with same rg', async () => {
        const privilege = await createAndReturnPrivilege();
        const objUser = {
            name: 'Joanes',
            surname: 'Nunes Junior Lebarch',
            email: 'example@email.com',
            password_hash: 'teste1234',
            birthday: new Date('2002-04-30'),
            cpf: '12345678901',
            rg: '1627245678',
            privilege: privilege,
            active: true,
            address: {
                complement: '',
                neighboor: 'Gazinelandia',
                number: 70,
                reference: 'Próximo a Santos',
                streeth: 'Rua Itapebi',
            }
        };
        const objUserTwo = {
            name: 'Joanes',
            surname: 'Nunes Junior Lebarch',
            email: 'example1@email.com',
            password_hash: 'teste1234',
            birthday: new Date('2002-04-30'),
            cpf: '12345678909',
            rg: '1627245678',
            privilege: privilege,
            active: true,
            address: {
                complement: '',
                neighboor: 'Gazinelandia',
                number: 70,
                reference: 'Próximo a Santos',
                streeth: 'Rua Itapebi',
            },
        };

        await sut.execute(objUser);
        await expect(() => sut.execute(objUserTwo)).rejects.toBeInstanceOf(AlreadyExistsError);
    });
});
