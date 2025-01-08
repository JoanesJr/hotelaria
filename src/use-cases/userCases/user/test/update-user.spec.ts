import { describe, expect, it, beforeEach } from 'vitest';
import { exec as execCallback } from 'node:child_process';
import { promisify } from 'node:util';
import { CreateUserUseCase } from '../create-user-useCase';
import { PrismaUsersRepository } from '@/repositories/prisma-tst/prisma-users-repository';
import { PrismaPrivilegeRepository } from '@/repositories/prisma-tst/prisma-privilege-repository';
import { AlreadyExistsError } from '../../../errors/already-exists-error';
import { UpdateUserUseCase } from '../alter-user-useCase';

const exec = promisify(execCallback);

const usersRepository = new PrismaUsersRepository();
const privilegeRepository = new PrismaPrivilegeRepository();
const sut = new UpdateUserUseCase(usersRepository);
const sutCreate = new CreateUserUseCase(usersRepository);


async function cleanModel() {
    await exec('npx prisma migrate reset --force');
}

async function createAndReturnPrivilege() {
    await privilegeRepository.create({ name: 'basic', });
    const privilege = await privilegeRepository.findAll();
    return privilege[0];
}

const createUser = async (dto) => {
    const dataRes = await sutCreate.execute(dto);
    return dataRes;
}

describe('UpdateUser Use Case Success', () => {
    beforeEach(async () => {
        await cleanModel();
    });


    it('should be alter not unique with success', async () => {
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

        const newData = {
            name: 'Repolho',
            cpf: '232234234'
        }
        const userCreated = await createUser(objUser);
        const updatedUser = await sut.execute(userCreated.id, { name: newData.name, cpf: newData.cpf });
        expect(updatedUser.name).toEqual(newData.name);
        expect(updatedUser.cpf).toEqual(newData.cpf);
    });

    it('should be alter unique with success', async () => {
        const privilege = await createAndReturnPrivilege();
        const objUserOne = {
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
            name: 'Nivea',
            surname: 'Lebarch',
            email: 'example2@email.com',
            password_hash: 'teste1234',
            birthday: new Date('2002-04-30'),
            cpf: '12345678902',
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

        const newData = {
            name: 'Repolho',
            cpf: '232234234',
            rg: '4534534645',
            email: 'other@email.com'
        }
        await createUser(objUserOne);
        const userCreatedTwo = await createUser(objUserTwo);
        const userUpdated = await sut.execute(userCreatedTwo.id, { name: newData.name, cpf: newData.cpf, rg: newData.rg, email: newData.email });
        expect(userUpdated.rg).toEqual(newData.rg);
        expect(userUpdated.cpf).toEqual(newData.cpf);
        expect(userUpdated.email).toEqual(newData.email);
    });

});

describe('UpdateUser Use Case Fail', () => {
    beforeEach(async () => {
        await cleanModel();
    })

    it('should be not alter name with same cpf', async () => {
        const privilege = await createAndReturnPrivilege();
        const objUserOne = {
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
            name: 'Nivea',
            surname: 'Lebarch',
            email: 'example2@email.com',
            password_hash: 'teste1234',
            birthday: new Date('2002-04-30'),
            cpf: '12345678902',
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

        const newData = {
            name: 'Repolho',
            cpf: '232234234'
        }
        const userCreatedOne = await createUser(objUserOne);
        const userCreatedTwo = await createUser(objUserTwo);
        await expect(() => sut.execute(userCreatedTwo.id, { name: newData.name, cpf: userCreatedOne.cpf })).rejects.toBeInstanceOf(AlreadyExistsError);
    });

    it('should be not alter name with same rg', async () => {
        const privilege = await createAndReturnPrivilege();
        const objUserOne = {
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
            name: 'Nivea',
            surname: 'Lebarch',
            email: 'example2@email.com',
            password_hash: 'teste1234',
            birthday: new Date('2002-04-30'),
            cpf: '12345678902',
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

        const newData = {
            name: 'Repolho',
            cpf: '232234234'
        }
        const userCreatedOne = await createUser(objUserOne);
        const userCreatedTwo = await createUser(objUserTwo);
        await expect(() => sut.execute(userCreatedTwo.id, { name: newData.name, rg: userCreatedOne.rg })).rejects.toBeInstanceOf(AlreadyExistsError);
    });
    it('should be not alter name with same email', async () => {
        const privilege = await createAndReturnPrivilege();
        const objUserOne = {
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
            name: 'Nivea',
            surname: 'Lebarch',
            email: 'example2@email.com',
            password_hash: 'teste1234',
            birthday: new Date('2002-04-30'),
            cpf: '12345678902',
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

        const newData = {
            name: 'Repolho',
            cpf: '232234234'
        }
        const userCreatedOne = await createUser(objUserOne);
        const userCreatedTwo = await createUser(objUserTwo);
        await expect(() => sut.execute(userCreatedTwo.id, { name: newData.name, email: userCreatedOne.email })).rejects.toBeInstanceOf(AlreadyExistsError);
    });
})
