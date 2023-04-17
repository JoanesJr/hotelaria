import { TypeRoomRepository } from '@/repositories/typeRoom-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { TypeRoomUseCase } from '../typeRoom';
import { InMemoryTypeRoomRepository } from '@/repositories/in-memory/in-memory-typeRoom-repository';
import { TypeRoomAlreadyExistsError } from '@/use-cases/errors/typeRoom-already-exists-error';
import { DataNotFoundError } from '@/use-cases/errors/data-not-found-error';

let typeRoomRepository: TypeRoomRepository;
let sut: TypeRoomUseCase;

describe('Register TypeRoom Use Case', () => {
    beforeEach(() => {
        typeRoomRepository = new InMemoryTypeRoomRepository();
        sut = new TypeRoomUseCase(typeRoomRepository);
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
    beforeEach(() => {
        typeRoomRepository = new InMemoryTypeRoomRepository();
        sut = new TypeRoomUseCase(typeRoomRepository);
    });

    it('should be delete typeRoom', async () => {
        const { typeRoom } = await sut.register({
            name: 'Category One'
        });

        const typeRoomDelete = await sut.delete(typeRoom.id);
        const newTypeRooms = await sut.findAll();
        const existsTypeRoom = newTypeRooms.filter((type) => type.id === typeRoomDelete.id);

        expect(existsTypeRoom).toHaveLength(0);
    });

    it('should not be delete not exists typeRoom id', async () => {

        await expect(() => sut.delete('id-not-found')).rejects.toBeInstanceOf(DataNotFoundError);
    });
});

describe('UpdateTypeRoom Use Case', () => {
    beforeEach(() => {
        typeRoomRepository = new InMemoryTypeRoomRepository();
        sut = new TypeRoomUseCase(typeRoomRepository);
    });

    it('should be update user', async () => {
        const { typeRoom } = await sut.register({
            name: 'Category One'
        });

        const typeRoomUpdated = await sut.update(typeRoom.id, {
            name: 'Joanes'
        });

        const getTypeRoomUpdated = await sut.findById(typeRoom.id);

        expect(getTypeRoomUpdated.name).toEqual('Joanes');
    });

    it('should not be update typeRoom when  id not exists', async () => {

        await expect(sut.update('id-not-found', { name: 'Joanes' })).rejects.toBeInstanceOf(DataNotFoundError);
    });

    it('should not be update typeRoom with same name', async () => {
        await sut.register({
            name: 'Category One'
        });

        const { typeRoom } = await sut.register({
            name: 'Category Two'
        });


        await expect(sut.update(typeRoom.id, { name: 'Category One' })).rejects.toBeInstanceOf(TypeRoomAlreadyExistsError);
    });
});