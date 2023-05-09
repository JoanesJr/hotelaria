import { describe, expect, it, beforeEach } from 'vitest';
import { CheckInUseCase } from '../checkin';
import { ReservationUseCase, StatusReservation } from '../reservation';
import { RoomUseCase, StatusRoom } from '../room';
import { TypeRoomUseCase } from '../typeRoom';
import { UserUseCase } from '../user';
import { CheckInReservationNotConfirmedError } from '@/use-cases/errors/checkin-reservation-not-confirmed-error';
import { CheckInAlreadyExistsError } from '@/use-cases/errors/checkin-already-exists-error';
import { PrismaTstReservationRepository } from '@/repositories/prisma-tst/prisma-tst-reservation-repository';
import { PrismaTstRoomRepository } from '@/repositories/prisma-tst/prisma-tst-room-repository';
import { PrismaTstTypeRoomRepository } from '@/repositories/prisma-tst/prisma-tst-typeRoom-repository';
import { PrismaTstUsersRepository } from '@/repositories/prisma-tst/prisma-tst-users-repository';
import { PrismaTstParametersRepository } from '@/repositories/prisma-tst/prisma-tst-parameters-repository';
import { PrismaTstCheckInsRepository } from '@/repositories/prisma-tst/prisma-tst-checkIn-repository';
import { exec as execCallback } from 'node:child_process';
import { promisify } from 'node:util';
import { MaritalStatus } from '@/http/controllers/users';
import { PrismaTstAccountRepository } from '@/repositories/prisma-tst/prisma-tst-account-repository';
import { AccountUseCase, StatusAccount } from '../account';
import { PrismaTstAccountItemRepository } from '@/repositories/prisma-tst/prisma-tst-account-item-repository';
import { AccountItemUseCase } from '../account-item';
import { PrismaTstItemsRepository } from '@/repositories/prisma-tst/prisma-tst-items-repository';
import { ItemUseCase } from '../item';
import { AccountNotExistsError } from '@/use-cases/errors/account-not-exists-error';
import { DataNotFoundError } from '@/use-cases/errors/data-not-found-error';

const exec = promisify(execCallback);

const reservationRepository = new PrismaTstReservationRepository();
const roomRepository = new PrismaTstRoomRepository();
const typeRoomRepositroy = new PrismaTstTypeRoomRepository();
const userRepository = new PrismaTstUsersRepository();
const parametersRepository = new PrismaTstParametersRepository();
const checkInRepository = new PrismaTstCheckInsRepository();
const accountRepository = new PrismaTstAccountRepository();
const accountItemRepository = new PrismaTstAccountItemRepository();
const AccountItemRepository = new PrismaTstItemsRepository();

const sutReservation = new ReservationUseCase(reservationRepository, roomRepository, userRepository, parametersRepository);
const sutRoom = new RoomUseCase(roomRepository);
const sutTypeRoom = new TypeRoomUseCase(typeRoomRepositroy);
const sutUser = new UserUseCase(userRepository);
const sutCheckIn = new CheckInUseCase(checkInRepository, reservationRepository);
const sutAccount = new AccountUseCase(accountRepository, checkInRepository);
const sutAccountItem = new AccountItemUseCase(accountItemRepository, accountRepository);
const sutItem = new ItemUseCase(AccountItemRepository);


async function cleanModel() {
    await exec('npx prisma migrate reset --force');
}

describe('Make AccountItem Use Case', () => {

    beforeEach(async () => {
        await cleanModel();
    });

    it('should be make accountItem', async () => {

        const { item } = await sutItem.register({
            name: 'Item A',
            info: 'desc',
            price: 35.40
        });

        const { accountItem } = await sutAccountItem.register({
            itemId: item.id,
            value: item.price,
        });

        expect(accountItem.id).toEqual(expect.any(String));
    });

    it('should not be accountItem to not exists account', async () => {
        const { item } = await sutItem.register({
            name: 'Item A',
            info: 'desc',
            price: 35.40
        });

        const data = {
            itemId: item.id,
            value: item.price,
            accountId: 'not-exits'
        };

        await expect(sutAccountItem.register(data)).rejects.toBeInstanceOf(AccountNotExistsError);
    });
});

describe('Update AccountItem Use Case', () => {

    beforeEach(async () => {
        await cleanModel();
    });

    it('should be update  accountItem', async () => {

        const { item } = await sutItem.register({
            name: 'Item A',
            info: 'desc',
            price: 35.40
        });

        const { accountItem } = await sutAccountItem.register({
            itemId: item.id,
            value: item.price,
        });

        const { accountItem: accountIem2 } = await sutAccountItem.update(accountItem.id, {
            value: 32.15
        });


        expect(accountIem2.value).toEqual(32.15);
    });

    it('should not be update accountItem to not exists accountItem', async () => {
        const { item } = await sutItem.register({
            name: 'Item A',
            info: 'desc',
            price: 35.40
        });

        const { accountItem } = await sutAccountItem.register({
            itemId: item.id,
            value: item.price,
        });

        await expect(sutAccountItem.update('not-exists', { value: 50 })).rejects.toBeInstanceOf(DataNotFoundError);
    });
});

describe('Delete AccountItem Use Case', () => {

    beforeEach(async () => {
        await cleanModel();
    });

    it('should be delete  accountItem', async () => {

        const { item } = await sutItem.register({
            name: 'Item A',
            info: 'desc',
            price: 35.40
        });

        const { accountItem } = await sutAccountItem.register({
            itemId: item.id,
            value: item.price,
        });

        const { accountItem: accountItemDelete } = await sutAccountItem.delete(accountItem.id);

        const { accountItem: getAccountItems } = await sutAccountItem.findById(accountItemDelete.id);

        expect(getAccountItems).toBeNull();
    });

    it('should not be delete accountItem to not exists accountItem', async () => {

        await expect(sutAccountItem.delete('not-exists')).rejects.toBeInstanceOf(DataNotFoundError);
    });
});



describe('Link account to AccountItem Use Case', () => {

    beforeEach(async () => {
        await cleanModel();
    });

    it('should be link Account', async () => {

        const { user } = await sutUser.register({
            name: 'Joanes de Jesus Nunes Junior',
            email: 'example@email.com',
            password: 'teste1234',
            birthday: new Date('2002-04-30'),
            cpf: '12345678901',
            privilege: 'basic',
            maritalStatus: MaritalStatus.casado
        });

        const { typeRoom } = await sutTypeRoom.register({ name: 'Category One' });

        const { room } = await sutRoom.register({
            name: 'Quarto um',
            info: 'Qualquer info',
            status: StatusRoom.aberto,
            typeRoomId: typeRoom.id,
        });

        const { reservation } = await sutReservation.register({
            userId: user.id,
            roomId: room.id,
            status: StatusReservation.confirmed,
            entryDate: new Date('2023-04-20'),
            exitDate: new Date('2023-04-21'),
        });

        const { checkIn } = await sutCheckIn.register({
            reservationId: reservation.id
        });


        const { item } = await sutItem.register({
            name: 'Item A',
            info: 'desc',
            price: 35.40
        });

        const { item: item2 } = await sutItem.register({
            name: 'Item B',
            info: 'desc B',
            price: 55.40
        });

        const { account } = await sutAccount.register({
            checkInId: checkIn.id,
            roomValue: 30.9,
            status: StatusAccount.aberto,
            items: [
                {
                    itemId: item.id,
                    value: item.price
                },
                {
                    itemId: item2.id,
                    value: item2.price
                }
            ],

        });

        expect(account.id).toEqual(expect.any(String));
    });

    it('should not be delete accountItem to not exists accountItem', async () => {

        await expect(sutAccountItem.delete('not-exists')).rejects.toBeInstanceOf(DataNotFoundError);
    });
});



