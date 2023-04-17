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

    it('should be delete user', async () => {
        const { typeRoom } = await sut.register({
            name: 'Category One'
        });

        const typeRoomDelete = await sut.delete({ id: typeRoom.id });
        const newTypeRooms = await sut.findAll();
        const existsTypeRoom = newTypeRooms.filter((type) => type.id === typeRoomDelete.id);

        expect(existsTypeRoom).toHaveLength(0);
    });

    it('should not be delete not exists user id', async () => {

        await expect(() => sut.delete({ id: 'id-not-found' })).rejects.toBeInstanceOf(DataNotFoundError);
    });
});