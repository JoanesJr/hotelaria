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

const exec = promisify(execCallback);

const reservationRepository = new PrismaTstReservationRepository();
const roomRepository = new PrismaTstRoomRepository();
const typeRoomRepositroy = new PrismaTstTypeRoomRepository();
const userRepository = new PrismaTstUsersRepository();
const parametersRepository = new PrismaTstParametersRepository();
const checkInRepository = new PrismaTstCheckInsRepository();

const sutReservation = new ReservationUseCase(reservationRepository, roomRepository, userRepository, parametersRepository);
const sutRoom = new RoomUseCase(roomRepository);
const sutTypeRoom = new TypeRoomUseCase(typeRoomRepositroy);
const sutUser = new UserUseCase(userRepository);
const sutCheckIn = new CheckInUseCase(checkInRepository, reservationRepository);


async function cleanModel() {
    await exec('npx prisma migrate reset --force');
}

describe('MakeCheckin Use Case', () => {

    beforeEach(async () => {
        await cleanModel();
    });

    it('should be make checkIn', async () => {
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

        expect(checkIn.id).toEqual(expect.any(String));
    });

    it('should not be checkin with reservation not confirmed', async () => {
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

        await expect(sutCheckIn.register({ reservationId: reservation.id })).rejects.toBeInstanceOf(CheckInReservationNotConfirmedError);
    });

    it('should not be checkin to same reservation', async () => {
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

        const { checkIn } = await sutCheckIn.register({ reservationId: reservation.id });

        await expect(sutCheckIn.register({ reservationId: reservation.id })).rejects.toBeInstanceOf(CheckInAlreadyExistsError);
    });
});


