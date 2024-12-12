import { describe, expect, it, beforeEach } from 'vitest';
import { exec as execCallback } from 'node:child_process';
import { promisify } from 'node:util';
import { AlreadyExistsError } from '../../../errors/already-exists-error';
import { PrismaCoursesRepository } from '@/repositories/prisma-tst/prisma-courses-repository';
import { CreateCourseUseCase } from '../create-course-useCase';
import { PrismaCourseCategoriesRepository } from '@/repositories/prisma-tst/prisma-course-categories-repository';

const exec = promisify(execCallback);

const coursesRepository = new PrismaCoursesRepository();
const categoriRepository = new PrismaCourseCategoriesRepository();
const sut = new CreateCourseUseCase(coursesRepository);


async function cleanModel() {
    await exec('npx prisma migrate reset --force');
}

async function createAndReturnPrivilege() {
    await categoriRepository.create({ name: 'basic', });
    const privilege = await categoriRepository.findAll();
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
