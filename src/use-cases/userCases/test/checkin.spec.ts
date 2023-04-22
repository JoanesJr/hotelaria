import { InMemoryItemsRepository } from '@/repositories/in-memory/in-memory-items-repository';
import { describe, expect, it, beforeEach } from 'vitest';
import { ItemUseCase } from '../item';
import { ItemAlreadyExistsError } from '../../errors/item-already-exists-error';
import { ItemsRepository } from '@/repositories/items-repository';
import { DataNotFoundError } from '@/use-cases/errors/data-not-found-error';
import { CheckInRepository } from '@/repositories/checkin-repository';
import { ReservationRepository } from '@/repositories/reservation-repository';
import { CheckInUseCase } from '../checkin';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkin-repository';
import { InMemoryReservationRepository } from '@/repositories/in-memory/in-memory-reservation-repository';
import { ParametersRepository } from '@/repositories/parameters-repository';
import { UsersRepository } from '@/repositories/users-repository';
import { TypeRoomRepository } from '@/repositories/typeRoom-repository';
import { RoomRepository } from '@/repositories/room-repository';
import { ReservationUseCase, StatusReservation } from '../reservation';
import { RoomUseCase, StatusRoom } from '../room';
import { TypeRoomUseCase } from '../typeRoom';
import { UserUseCase } from '../user';
import { InMemoryParametersRepository } from '@/repositories/in-memory/in-memory-parameters-repository';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { InMemoryTypeRoomRepository } from '@/repositories/in-memory/in-memory-typeRoom-repository';
import { InMemoryRoomRepository } from '@/repositories/in-memory/in-memory-room-repository';
import { CheckInReservationNotConfirmedError } from '@/use-cases/errors/checkin-reservation-not-confirmed-error';
import { CheckInAlreadyExistsError } from '@/use-cases/errors/checkin-already-exists-error';

let reservationRepository: ReservationRepository;
let roomRepository: RoomRepository;
let typeRoomRepositroy: TypeRoomRepository;
let userRepository: UsersRepository;
let parametersRepository: ParametersRepository;
let checkInRepository: CheckInRepository;

let sutReservation: ReservationUseCase;
let sutRoom: RoomUseCase;
let sutTypeRoom: TypeRoomUseCase;
let sutUser: UserUseCase;
let sutCheckIn: CheckInUseCase;

describe('MakeCheckin Use Case', () => {

    beforeEach(() => {
        reservationRepository = new InMemoryReservationRepository();
        roomRepository = new InMemoryRoomRepository();
        typeRoomRepositroy = new InMemoryTypeRoomRepository();
        userRepository = new InMemoryUsersRepository();
        parametersRepository = new InMemoryParametersRepository();
        checkInRepository = new InMemoryCheckInsRepository();

        sutReservation = new ReservationUseCase(reservationRepository, roomRepository, userRepository, parametersRepository);
        sutRoom = new RoomUseCase(roomRepository);
        sutTypeRoom = new TypeRoomUseCase(typeRoomRepositroy);
        sutUser = new UserUseCase(userRepository);
        sutCheckIn = new CheckInUseCase(checkInRepository, reservationRepository);
    });

    it('should be make checkIn', async () => {
        const { user } = await sutUser.register({
            name: 'Joanes de Jesus Nunes Junior',
            email: 'example@email.com',
            password: 'teste1234',
            birthday: '2002-04-30T00:00:00',
            cpf: '12345678901',
            privilege: 'basic',
            maritalStatus: 'Solteiro'
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
            entryDate: '2023-04-20T12:40:00Z',
            exitDate: '2023-04-21T12:40:00Z',
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
            birthday: '2002-04-30T00:00:00',
            cpf: '12345678901',
            privilege: 'basic',
            maritalStatus: 'Solteiro'
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
            entryDate: '2023-04-20T12:40:00Z',
            exitDate: '2023-04-21T12:40:00Z',
        });

        await expect(sutCheckIn.register({ reservationId: reservation.id })).rejects.toBeInstanceOf(CheckInReservationNotConfirmedError);
    });

    it('should not be checkin to same reservation', async () => {
        const { user } = await sutUser.register({
            name: 'Joanes de Jesus Nunes Junior',
            email: 'example@email.com',
            password: 'teste1234',
            birthday: '2002-04-30T00:00:00',
            cpf: '12345678901',
            privilege: 'basic',
            maritalStatus: 'Solteiro'
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
            entryDate: '2023-04-20T12:40:00Z',
            exitDate: '2023-04-21T12:40:00Z',
        });

        const { checkIn } = await sutCheckIn.register({ reservationId: reservation.id });

        await expect(sutCheckIn.register({ reservationId: reservation.id })).rejects.toBeInstanceOf(CheckInAlreadyExistsError);
    });
});


