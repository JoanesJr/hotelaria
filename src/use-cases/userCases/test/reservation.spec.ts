import { InMemoryReservationRepository } from '@/repositories/in-memory/in-memory-reservation-repository';
import { describe, expect, it, beforeEach } from 'vitest';
import { ReservationRepository } from '@/repositories/reservation-repository';
import { DataNotFoundError } from '@/use-cases/errors/data-not-found-error';
import { ReservationUseCase, StatusReservation } from '../reservation';
import { RoomRepository } from '@/repositories/room-repository';
import { RoomUseCase, StatusRoom } from '../room';
import { TypeRoomRepository } from '@/repositories/typeRoom-repository';
import { TypeRoomUseCase } from '../typeRoom';
import { UsersRepository } from '@/repositories/users-repository';
import { UserUseCase } from '../user';
import { InMemoryRoomRepository } from '@/repositories/in-memory/in-memory-room-repository';
import { InMemoryTypeRoomRepository } from '@/repositories/in-memory/in-memory-typeRoom-repository';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { ReservationInvalidError } from '@/use-cases/errors/reservartion-invalid-error';
import { ReservationLimitError } from '@/use-cases/errors/reservartion-limit-error copy';
import { ReservationAlreadyExistsError } from '@/use-cases/errors/reservartion-already-exists-error';
import { ParametersRepository } from '@/repositories/parameters-repository';
import { InMemoryParametersRepository } from '@/repositories/in-memory/in-memory-parameters-repository';
import { PrismaTstReservationRepository } from '@/repositories/prisma-tst/prisma-tst-reservation-repository';
import { PrismaTstRoomRepository } from '@/repositories/prisma-tst/prisma-tst-room-repository';
import { PrismaTstTypeRoomRepository } from '@/repositories/prisma-tst/prisma-tst-typeRoom-repository';
import { PrismaTstUsersRepository } from '@/repositories/prisma-tst/prisma-tst-users-repository';
import { PrismaTstParametersRepository } from '@/repositories/prisma-tst/prisma-tst-parameters-repository';
import { MaritalStatus } from '@/http/controllers/users';
import { exec as execCallback } from 'node:child_process';
import { promisify } from 'node:util';

const exec = promisify(execCallback);


const reservationRepository = new PrismaTstReservationRepository();
const roomRepository = new PrismaTstRoomRepository();
const typeRoomRepositroy = new PrismaTstTypeRoomRepository();
const userRepository = new PrismaTstUsersRepository();
const parametersRepository = new PrismaTstParametersRepository();

const sutReservation = new ReservationUseCase(reservationRepository, roomRepository, userRepository, parametersRepository);
const sutRoom = new RoomUseCase(roomRepository);
const sutTypeRoom = new TypeRoomUseCase(typeRoomRepositroy);
const sutUser = new UserUseCase(userRepository);


async function cleanModel() {
    await exec('npx prisma migrate reset --force');
}


describe('MakeReservation Use Case', () => {
    beforeEach(async () => {
        await cleanModel();
    });

    it('should be make reservation', async () => {
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
            status: StatusReservation.notConfirmed,
            entryDate: new Date('2023-04-20'),
            exitDate: new Date('2023-04-21'),
        });

        expect(reservation.id).toEqual(expect.any(String));
    });

    it('should not be make reservation with quantity days less than 1 ', async () => {
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

        const data = {
            userId: user.id,
            roomId: room.id,
            status: StatusReservation.notConfirmed,
            entryDate: new Date('2023-04-20'),
            exitDate: new Date('2023-04-20'),
        };

        await expect(sutReservation.register(data)).rejects.toBeInstanceOf(ReservationInvalidError);
    });

    it('should not be make reservation with quantity days more than limit ', async () => {
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

        const data = {
            userId: user.id,
            roomId: room.id,
            status: StatusReservation.notConfirmed,
            entryDate: new Date('2023-04-20'),
            exitDate: new Date('2023-04-28'),
        };

        await expect(sutReservation.register(data)).rejects.toBeInstanceOf(ReservationLimitError);
    });

    it('should not be make reservation in same room already reservated in this period of date ', async () => {
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
        const { typeRoom: typeRoom2 } = await sutTypeRoom.register({ name: 'Category Two' });

        const { room } = await sutRoom.register({
            name: 'Quarto um',
            info: 'Qualquer info',
            status: StatusRoom.aberto,
            typeRoomId: typeRoom.id,
        });

        const data = {
            userId: user.id,
            roomId: room.id,
            status: StatusReservation.notConfirmed,
            entryDate: new Date('2023-04-20'),
            exitDate: new Date('2023-04-25'),
        };

        const { reservation } = await sutReservation.register(data);

        data.entryDate = new Date('2023-04-24');

        await expect(sutReservation.register(data)).rejects.toBeInstanceOf(ReservationAlreadyExistsError);
    });

    // it('should not be make reservation width more than max reservations to same users config'), () => {

    // };
});

describe('DeleteReservation Use Case', () => {
    beforeEach(async () => {
        await cleanModel();
    });

    it('should be delete item', async () => {
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
            status: StatusReservation.notConfirmed,
            entryDate: new Date('2023-04-20'),
            exitDate: new Date('2023-04-21'),
        });

        const { reservation: reservationDelete } = await sutReservation.delete(reservation.id);
        const { reservation: deletedReservation } = await sutReservation.findById(reservationDelete.id);

        expect(deletedReservation).toBeNull();
    });

    it('should not be delete not exists reservation id', async () => {

        await expect(() => sutReservation.delete('id-not-found')).rejects.toBeInstanceOf(DataNotFoundError);
    });
});

describe('UpdateReservation Use Case', () => {
    beforeEach(async () => {
        await cleanModel();
    });

    it('should be update reservation', async () => {
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
            status: StatusReservation.notConfirmed,
            entryDate: new Date('2023-04-20'),
            exitDate: new Date('2023-04-21'),
        });

        const { reservation: reservationUpdated } = await sutReservation.update(reservation.id, {
            status: StatusReservation.confirmed
        });

        const { reservation: getReservationUpdated } = await sutReservation.findById(reservationUpdated.id);

        expect(getReservationUpdated.status).toEqual(StatusReservation.confirmed);
    });

    it('should not be update resevation when  id not exists', async () => {


        await expect(sutReservation.update('id-not-found', { status: StatusReservation.confirmed })).rejects.toBeInstanceOf(DataNotFoundError);
    });

    it('should not be be update reservation with quantity days less than 1', async () => {
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

        const data = {
            userId: user.id,
            roomId: room.id,
            status: StatusReservation.notConfirmed,
            entryDate: new Date('2023-04-20'),
            exitDate: new Date('2023-04-21'),
        };

        const { reservation } = await sutReservation.register(data);


        await expect(sutReservation.update(reservation.id, { exitDate: new Date('2023-04-19') })).rejects.toBeInstanceOf(ReservationInvalidError);
    });
});