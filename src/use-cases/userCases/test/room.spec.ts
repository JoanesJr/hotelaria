import { InMemoryTypeRoomRepository } from '@/repositories/in-memory/in-memory-typeRoom-repository';
import { describe, expect, it, beforeEach } from 'vitest';
import { TypeRoomRepository } from '@/repositories/typeRoom-repository';
import { RoomRepository } from '@/repositories/room-repository';
import { RoomAlreadyExistsError } from '../../errors/room-already-exists-error';
import { InMemoryRoomRepository } from '@/repositories/in-memory/in-memory-room-repository';
import { RoomUseCase, StatusRoom } from '../room';
import { DataNotFoundError } from '@/use-cases/errors/data-not-found-error';
import { TypeRoomUseCase } from '../typeRoom';
import { ZodError } from 'zod';

let typeRoomRepository: TypeRoomRepository;
let sutTypeRoom: TypeRoomUseCase;
let roomRepository: RoomRepository;
let sutRoom: RoomUseCase;

describe('Register Room Use Case', () => {

    beforeEach(() => {
        roomRepository = new InMemoryRoomRepository();
        typeRoomRepository = new InMemoryTypeRoomRepository();
        sutRoom = new RoomUseCase(roomRepository);
        sutTypeRoom = new TypeRoomUseCase(typeRoomRepository);
    });

    it('should be add room', async () => {
        const { typeRoom } = await sutTypeRoom.register({
            name: 'Tipo |'
        });

        const data = {
            name: 'Quarto um',
            info: 'Qualquer info',
            status: StatusRoom.aberto,
            typeRoomId: typeRoom.id,
        };

        const { room } = await sutRoom.register(data);

        expect(room.id).toEqual(expect.any(String));
    });


    it('should not be add more than 1 room to same tpyeRoom', async () => {
        const { typeRoom } = await sutTypeRoom.register({
            name: 'Tipo |'
        });

        const data = {
            name: 'Quarto um',
            info: 'Qualquer info',
            status: StatusRoom.aberto,
            typeRoomId: typeRoom.id,
        };

        const { room } = await sutRoom.register(data);

        await expect(() => sutRoom.register(data)).rejects.toBeInstanceOf(RoomAlreadyExistsError);
    });


});

describe('UpdateRoom Use Case', () => {
    beforeEach(() => {
        roomRepository = new InMemoryRoomRepository();
        typeRoomRepository = new InMemoryTypeRoomRepository();
        sutRoom = new RoomUseCase(roomRepository);
        sutTypeRoom = new TypeRoomUseCase(typeRoomRepository);
    });

    it('should be update room', async () => {
        const { typeRoom } = await sutTypeRoom.register({
            name: 'Tipo |'
        });

        const data = {
            name: 'Quarto um',
            info: 'Qualquer info',
            status: StatusRoom.aberto,
            typeRoomId: typeRoom.id,
        };



        const { room } = await sutRoom.register(data);

        await sutRoom.update(room.id, { name: 'Quarto Editado' });

        const getRoomUpdated = await sutRoom.findById(room.id);

        expect(getRoomUpdated.name).toEqual('Quarto Editado');
    });

    it('should not be update room when  id not exists', async () => {

        await expect(sutRoom.update('id-not-found', { name: 'Quarto um' })).rejects.toBeInstanceOf(DataNotFoundError);
    });
});

describe('DeleteTypeRoom Use Case', () => {
    beforeEach(() => {
        roomRepository = new InMemoryRoomRepository();
        typeRoomRepository = new InMemoryTypeRoomRepository();
        sutRoom = new RoomUseCase(roomRepository);
        sutTypeRoom = new TypeRoomUseCase(typeRoomRepository);
    });

    it('should be delete user', async () => {
        const { typeRoom } = await sutTypeRoom.register({
            name: 'Tipo |'
        });

        const data = {
            name: 'Quarto um',
            info: 'Qualquer info',
            status: StatusRoom.aberto,
            typeRoomId: typeRoom.id,
        };

        const { room } = await sutRoom.register(data);

        const roomDelete = await sutRoom.delete(room.id);
        const newRoom = await sutRoom.findAll();
        const existsRoom = newRoom.filter((room) => room.id === roomDelete.id);

        expect(existsRoom).toHaveLength(0);
    });

    it('should not be delete not exists room id', async () => {

        await expect(() => sutRoom.delete('id-not-found')).rejects.toBeInstanceOf(DataNotFoundError);
    });
});