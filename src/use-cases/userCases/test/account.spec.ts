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
import { PrismaTstItemsRepository } from '@/repositories/prisma-tst/prisma-tst-items-repository';
import { ItemUseCase } from '../item';
import { AccountAlreadyExistsError } from '@/use-cases/errors/account-already-exists-error';
import { AccountCheckInNotExistsError } from '@/use-cases/errors/account-checkin-not-exists-error';

const exec = promisify(execCallback);

const reservationRepository = new PrismaTstReservationRepository();
const roomRepository = new PrismaTstRoomRepository();
const typeRoomRepositroy = new PrismaTstTypeRoomRepository();
const userRepository = new PrismaTstUsersRepository();
const parametersRepository = new PrismaTstParametersRepository();
const checkInRepository = new PrismaTstCheckInsRepository();
const accountRepository = new PrismaTstAccountRepository();
const AccountItemRepository = new PrismaTstItemsRepository();


const sutReservation = new ReservationUseCase(reservationRepository, roomRepository, userRepository, parametersRepository);
const sutRoom = new RoomUseCase(roomRepository);
const sutTypeRoom = new TypeRoomUseCase(typeRoomRepositroy);
const sutUser = new UserUseCase(userRepository);
const sutCheckIn = new CheckInUseCase(checkInRepository, reservationRepository);
const sutAccount = new AccountUseCase(accountRepository, checkInRepository);
const sutItem = new ItemUseCase(AccountItemRepository);


async function cleanModel() {
    await exec('npx prisma migrate reset --force');
}

describe('MakeAccount Use Case', () => {

    beforeEach(async () => {
        await cleanModel();
    });

    it('should be make account', async () => {
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

        const { account } = await sutAccount.register({
            checkInId: checkIn.id,
            roomValue: 30.9,
            status: StatusAccount.aberto,
            items: [
                {
                    itemId: item.id,
                    value: item.price,
                }
            ],
        });

        expect(account.id).toEqual(expect.any(String));
    });

    it('should not be make account with same checkInd', async () => {
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

        const dataAccount = {
            checkInId: checkIn.id,
            roomValue: 30.9,
            status: StatusAccount.aberto,
            items: [
                {
                    itemId: item.id,
                    value: item.price,
                }
            ],
        };
        const { account } = await sutAccount.register(dataAccount);

        await expect(sutAccount.register(dataAccount)).rejects.toBeInstanceOf(AccountAlreadyExistsError);
    });

    it('should not be make account withinvalid checkIn', async () => {
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

        const dataAccount = {
            checkInId: checkIn.id,
            roomValue: 30.9,
            status: StatusAccount.aberto,
            items: [
                {
                    itemId: item.id,
                    value: item.price,
                }
            ],
        };
        const { account } = await sutAccount.register(dataAccount);

        dataAccount.checkInId = 'invalid-checkIn';

        await expect(sutAccount.register(dataAccount)).rejects.toBeInstanceOf(AccountCheckInNotExistsError);
    });
});


describe('Cancel Account Use Case', () => {
    beforeEach(async () => {
        await cleanModel();
    });

    it('should be make cancel', async () => {
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

        const { account } = await sutAccount.register({
            checkInId: checkIn.id,
            roomValue: 30.9,
            status: StatusAccount.aberto,
            items: [
                {
                    itemId: item.id,
                    value: item.price,
                }
            ],
        });

        const { account: accountCancel } = await sutAccount.cancel(account.id);

        expect(accountCancel.status).toEqual(StatusAccount.cancelado);
    });
});

