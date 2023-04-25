import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { TypeRoomUseCase } from '../typeRoom';
import { TypeRoomAlreadyExistsError } from '@/use-cases/errors/typeRoom-already-exists-error';
import { DataNotFoundError } from '@/use-cases/errors/data-not-found-error';
import { PrismaTstTypeRoomRepository } from '@/repositories/prisma-tst/prisma-tst-typeRoom-repository';
import { exec as execCallback } from 'node:child_process';
import { promisify } from 'node:util';

const exec = promisify(execCallback);

const typeRoomRepository = new PrismaTstTypeRoomRepository();
const sut = new TypeRoomUseCase(typeRoomRepository);


async function cleanModel() {
    await exec('npx prisma migrate reset --force')
}

describe('Register TypeRoom Use Case', () => {
    beforeEach(async () => {
        await cleanModel();
    });



    it('should be register type room', async () => {
        const data = {
            name: 'Category One'
        };

        const { typeRoom } = await sut.register(data);

        expect(typeRoom.id).toEqual(expect.any(String));
    });

    it('should not be register type room with same name', async () => {
        const data = {
            name: 'Category One'
        };

        await sut.register(data);

        await expect(() => sut.register(data)).rejects.toBeInstanceOf(TypeRoomAlreadyExistsError);


    });
});

describe('DeleteTypeRoom Use Case', () => {
    beforeEach(async () => {
        await cleanModel();
    });


    it('should be delete typeRoom', async () => {
        const { typeRoom } = await sut.register({
            name: 'Category One'
        });

        const { typeRoom: typeRoomDeleted } = await sut.delete(typeRoom.id);
        const { typeRoom: existTypeRoom } = await sut.findById(typeRoomDeleted.id);

        expect(existTypeRoom).toBeNull();
    });

    it('should not be delete not exists typeRoom id', async () => {

        await expect(() => sut.delete('id-not-found')).rejects.toBeInstanceOf(DataNotFoundError);
    });
});

describe('UpdateTypeRoom Use Case', () => {
    beforeEach(async () => {
        await cleanModel();
    });


    it('should be update typeRoom', async () => {
        const { typeRoom } = await sut.register({
            name: 'Category Up One'
        });

        const { typeRoom: typeRoomUpdate } = await sut.update(typeRoom.id, {
            name: 'Joanes'
        });

        const { typeRoom: getTypeRoomUpdated } = await sut.findById(typeRoomUpdate.id);

        expect(getTypeRoomUpdated.name).toEqual('Joanes');
    });

    it('should not be update typeRoom when  id not exists', async () => {

        await expect(sut.update('id-not-found', { name: 'Joanes' })).rejects.toBeInstanceOf(DataNotFoundError);
    });

    it('should not be update typeRoom with same name', async () => {
        await sut.register({
            name: 'Category edit'
        });

        const { typeRoom } = await sut.register({
            name: 'Category edit Two'
        });


        await expect(sut.update(typeRoom.id, { name: 'Category edit' })).rejects.toBeInstanceOf(TypeRoomAlreadyExistsError);
    });
});