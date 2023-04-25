import { describe, expect, it, beforeEach } from 'vitest';
import { RoomAlreadyExistsError } from '../../errors/room-already-exists-error';
import { RoomUseCase, StatusRoom } from '../room';
import { DataNotFoundError } from '@/use-cases/errors/data-not-found-error';
import { TypeRoomUseCase } from '../typeRoom';
import { PrismaTstRoomRepository } from '@/repositories/prisma-tst/prisma-tst-room-repository';
import { PrismaTstTypeRoomRepository } from '@/repositories/prisma-tst/prisma-tst-typeRoom-repository';
import { exec as execCallback } from 'node:child_process';
import { promisify } from 'node:util';

const exec = promisify(execCallback);

const typeRoomRepository = new PrismaTstTypeRoomRepository();
const sutTypeRoom = new TypeRoomUseCase(typeRoomRepository);
const roomRepository = new PrismaTstRoomRepository();
const sutRoom = new RoomUseCase(roomRepository);


async function cleanModel() {
    await exec('npx prisma migrate reset --force')
}

describe('Register Room Use Case', () => {

    beforeEach(async () => {
        await cleanModel();
    });

    it('should be add room', async () => {
        const { typeRoom } = await sutTypeRoom.register({
            name: 'CategoryRoasdadsom'
        });

        const data = {
            name: 'Quarto asdsdsx',
            info: 'Qualquer info',
            status: StatusRoom.aberto,
            typeRoomId: typeRoom.id,
        };

        const { room } = await sutRoom.register(data);

        expect(room.id).toEqual(expect.any(String));
    });


    it('should not be add more than 1 room to same typeRoom', async () => {
        const { typeRoom } = await sutTypeRoom.register({
            name: 'dsdxvds'
        });

        const data = {
            name: 'Quarto doasdasdis',
            info: 'Qualquer info',
            status: StatusRoom.aberto,
            typeRoomId: typeRoom.id,
        };

        const { room } = await sutRoom.register(data);

        await expect(() => sutRoom.register(data)).rejects.toBeInstanceOf(RoomAlreadyExistsError);
    });


});

describe('UpdateRoom Use Case', () => {
    beforeEach(async () => {
        await cleanModel();
    });

    it('should be update room', async () => {
        const { typeRoom } = await sutTypeRoom.register({
            name: 'CategoryRoom Three'
        });

        const data = {
            name: 'Quarto tres',
            info: 'Qualquer info',
            status: StatusRoom.aberto,
            typeRoomId: typeRoom.id,
        };



        const { room } = await sutRoom.register(data);

        const { room: editedRoom } = await sutRoom.update(room.id, { name: 'Quarto Editado' });

        const { room: getRoomUpdated } = await sutRoom.findById(editedRoom.id);
        console.log('aqui');
        console.log(getRoomUpdated);
        console.log(getRoomUpdated.name);

        expect(getRoomUpdated.name).toEqual('Quarto Editado');
    });

    it('should not be update room when  id not exists', async () => {

        await expect(sutRoom.update('id-not-found', { name: 'Quarto dvcxx' })).rejects.toBeInstanceOf(DataNotFoundError);
    });
});

describe('DeleteTypeRoom Use Case', () => {
    beforeEach(async () => {
        await cleanModel();
    });

    it('should be delete typeRoom', async () => {
        const { typeRoom } = await sutTypeRoom.register({
            name: 'CategoryDelete'
        });

        const data = {
            name: 'Quarto quatcvcccro',
            info: 'Qualquer info',
            status: StatusRoom.aberto,
            typeRoomId: typeRoom.id,
        };

        const { room } = await sutRoom.register(data);

        const { room: roomDelete } = await sutRoom.delete(room.id);
        const { room: existRoom } = await sutRoom.findById(roomDelete.id);

        expect(existRoom).toBeNull();
    });

    it('should not be delete not exists room id', async () => {

        await expect(() => sutRoom.delete('id-not-found')).rejects.toBeInstanceOf(DataNotFoundError);
    });
});