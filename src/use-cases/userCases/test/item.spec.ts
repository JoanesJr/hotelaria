import { InMemoryItemsRepository } from '@/repositories/in-memory/in-memory-items-repository';
import { describe, expect, it, beforeEach } from 'vitest';
import { ItemUseCase } from '../item';
import { ItemAlreadyExistsError } from '../../errors/item-already-exists-error';
import { ItemsRepository } from '@/repositories/items-repository';
import { DataNotFoundError } from '@/use-cases/errors/data-not-found-error';

let itemsRepository: ItemsRepository;
let sut: ItemUseCase;

describe('RegisterItem Use Case', () => {

    beforeEach(() => {
        itemsRepository = new InMemoryItemsRepository();
        sut = new ItemUseCase(itemsRepository);
    });

    it('should be register items', async () => {
        const { item } = await sut.register({
            name: 'Item A',
            info: 'desc',
            price: 35.40
        });

        expect(item.id).toEqual(expect.any(String));
    });

    it('should not be register with same name', async () => {
        const data = {
            name: 'Item A',
            info: 'desc',
            price: 35.40
        };

        await sut.register(data);

        await expect(() => sut.register(data)).rejects.toBeInstanceOf(ItemAlreadyExistsError);
    });
});

describe('DeleteItem Use Case', () => {
    beforeEach(() => {
        itemsRepository = new InMemoryItemsRepository();
        sut = new ItemUseCase(itemsRepository);
    });

    it('should be delete item', async () => {
        const { item } = await sut.register({
            name: 'Item A',
            info: 'desc',
            price: 35.40
        });

        const itemDelete = await sut.delete(item.id);
        const newItems = await sut.findAll();
        const existsItem = newItems.filter((item) => item.id === itemDelete.id);

        expect(existsItem).toHaveLength(0);
    });

    it('should not be delete not exists item id', async () => {

        await expect(() => sut.delete('id-not-found')).rejects.toBeInstanceOf(DataNotFoundError);
    });
});

describe('UpdateItem Use Case', () => {
    beforeEach(() => {
        itemsRepository = new InMemoryItemsRepository();
        sut = new ItemUseCase(itemsRepository);
    });

    it('should be update item', async () => {
        const { item } = await sut.register({
            name: 'Item A',
            info: 'desc',
            price: 35.40
        });

        const itemUpdated = await sut.update(item.id, {
            name: 'Item B'
        });

        const getItemUpdated = await sut.findById(item.id);

        expect(getItemUpdated.name).toEqual('Item B');
    });

    it('should not be update item when  id not exists', async () => {


        await expect(sut.update('id-not-found', { name: 'Joanes' })).rejects.toBeInstanceOf(DataNotFoundError);
    });
});