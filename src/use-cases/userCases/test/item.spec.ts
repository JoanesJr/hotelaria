
import { describe, expect, it, beforeEach } from 'vitest';
import { ItemUseCase } from '../item';
import { ItemAlreadyExistsError } from '../../errors/item-already-exists-error';
import { DataNotFoundError } from '@/use-cases/errors/data-not-found-error';
import { PrismaTstItemsRepository } from '@/repositories/prisma-tst/prisma-tst-items-repository';
import { exec as execCallback } from 'node:child_process';
import { promisify } from 'node:util';

const exec = promisify(execCallback);

const itemsRepository = new PrismaTstItemsRepository();
const sut = new ItemUseCase(itemsRepository);


async function cleanModel() {
    await exec('npx prisma migrate reset --force');
}


describe('RegisterItem Use Case', () => {

    beforeEach(async () => {
        await cleanModel();
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
    beforeEach(async () => {
        await cleanModel();
    });

    it('should be delete item', async () => {
        const { item } = await sut.register({
            name: 'Item A',
            info: 'desc',
            price: 35.40
        });

        const { item: itemDelete } = await sut.delete(item.id);
        const { item: deletedItem } = await sut.findById(itemDelete.id);

        expect(deletedItem).toBeNull();
    });

    it('should not be delete not exists item id', async () => {

        await expect(() => sut.delete('id-not-found')).rejects.toBeInstanceOf(DataNotFoundError);
    });
});

describe('UpdateItem Use Case', () => {
    beforeEach(async () => {
        await cleanModel();
    });

    it('should be update item', async () => {
        const { item } = await sut.register({
            name: 'Item A',
            info: 'desc',
            price: 35.40
        });

        const { item: itemUpdated } = await sut.update(item.id, {
            name: 'Item B'
        });

        const { item: getItemUpdated } = await sut.findById(itemUpdated.id);

        expect(getItemUpdated.name).toEqual('Item B');
    });

    it('should not be update item when  id not exists', async () => {


        await expect(sut.update('id-not-found', { name: 'Joanes' })).rejects.toBeInstanceOf(DataNotFoundError);
    });
});