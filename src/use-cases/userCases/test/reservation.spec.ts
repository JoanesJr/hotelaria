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

let reservationRepository: ReservationRepository;
let roomRepository: RoomRepository;
let typeRoomRepositroy: TypeRoomRepository;
let userRepository: UsersRepository;

let sutReservation: ReservationUseCase;
let sutRoom: RoomUseCase;
let sutTypeRoom: TypeRoomUseCase;
let sutUser: UserUseCase;

describe('MakeReservation Use Case', () => {

    beforeEach(() => {
        reservationRepository = new InMemoryReservationRepository();
        roomRepository = new InMemoryRoomRepository();
        typeRoomRepositroy = new InMemoryTypeRoomRepository();
        userRepository = new InMemoryUsersRepository();

        sutReservation = new ReservationUseCase(reservationRepository);
        sutRoom = new RoomUseCase(roomRepository);
        sutTypeRoom = new TypeRoomUseCase(typeRoomRepositroy);
        sutUser = new UserUseCase(userRepository);
    });

    it('should be make reservation', async () => {
        const { user } = await sutUser.register({
            name: 'Joanes de Jesus Nunes Junior',
            email: 'example@email.com',
            password: 'teste1234',
            birthday: '2002-04-30T00:00:00',
            cpf: '12345678901',
            privilege: 'basic'
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

        expect(reservation.id).toEqual(expect.any(String));
    });

    it('should not be make reservation with quantity days less than 1 ', async () => {
        const { user } = await sutUser.register({
            name: 'Joanes de Jesus Nunes Junior',
            email: 'example@email.com',
            password: 'teste1234',
            birthday: '2002-04-30T00:00:00',
            cpf: '12345678901',
            privilege: 'basic'
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
            entryDate: '2023-04-20T12:40:00Z',
            exitDate: '2023-04-20T12:40:00Z',
        };

        await expect(sutReservation.register(data)).rejects.toBeInstanceOf(ReservationInvalidError);
    });

    it('should not be make reservation with quantity days more than limit ', async () => {
        const { user } = await sutUser.register({
            name: 'Joanes de Jesus Nunes Junior',
            email: 'example@email.com',
            password: 'teste1234',
            birthday: '2002-04-30T00:00:00',
            cpf: '12345678901',
            privilege: 'basic'
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
            entryDate: '2023-04-20T12:40:00Z',
            exitDate: '2023-04-28T12:40:00Z',
        };

        await expect(sutReservation.register(data)).rejects.toBeInstanceOf(ReservationLimitError);
    });

    it('should not be make reservation in same room already reservated in this period of date ', async () => {
        const { user } = await sutUser.register({
            name: 'Joanes de Jesus Nunes Junior',
            email: 'example@email.com',
            password: 'teste1234',
            birthday: '2002-04-30T00:00:00',
            cpf: '12345678901',
            privilege: 'basic'
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
            entryDate: '2023-04-20T12:40:00Z',
            exitDate: '2023-04-25T12:40:00Z',
        };

        const { reservation } = await sutReservation.register(data);

        data.entryDate = '2023-04-24T12:40:00Z';

        await expect(sutReservation.register(data)).rejects.toBeInstanceOf(ReservationAlreadyExistsError);
    });
});

describe('DeleteReservation Use Case', () => {
    beforeEach(() => {
        reservationRepository = new InMemoryReservationRepository();
        roomRepository = new InMemoryRoomRepository();
        typeRoomRepositroy = new InMemoryTypeRoomRepository();
        userRepository = new InMemoryUsersRepository();

        sutReservation = new ReservationUseCase(reservationRepository);
        sutRoom = new RoomUseCase(roomRepository);
        sutTypeRoom = new TypeRoomUseCase(typeRoomRepositroy);
        sutUser = new UserUseCase(userRepository);
    });

    it('should be delete item', async () => {
        const { user } = await sutUser.register({
            name: 'Joanes de Jesus Nunes Junior',
            email: 'example@email.com',
            password: 'teste1234',
            birthday: '2002-04-30T00:00:00',
            cpf: '12345678901',
            privilege: 'basic'
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

        const reservationDelete = await sutReservation.delete(reservation.id);
        const newReservation = await sutReservation.findAll();
        const existsReservation = newReservation.filter((item) => item.id === reservationDelete.id);

        expect(existsReservation).toHaveLength(0);
    });

    it('should not be delete not exists reservation id', async () => {

        await expect(() => sutReservation.delete('id-not-found')).rejects.toBeInstanceOf(DataNotFoundError);
    });
});

describe('UpdateReservation Use Case', () => {
    beforeEach(() => {
        reservationRepository = new InMemoryReservationRepository();
        roomRepository = new InMemoryRoomRepository();
        typeRoomRepositroy = new InMemoryTypeRoomRepository();
        userRepository = new InMemoryUsersRepository();

        sutReservation = new ReservationUseCase(reservationRepository);
        sutRoom = new RoomUseCase(roomRepository);
        sutTypeRoom = new TypeRoomUseCase(typeRoomRepositroy);
        sutUser = new UserUseCase(userRepository);
    });

    it('should be update reservation', async () => {
        const { user } = await sutUser.register({
            name: 'Joanes de Jesus Nunes Junior',
            email: 'example@email.com',
            password: 'teste1234',
            birthday: '2002-04-30T00:00:00',
            cpf: '12345678901',
            privilege: 'basic'
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

        const reservationUpdated = await sutReservation.update(reservation.id, {
            status: StatusReservation.confirmed
        });

        const getReservationUpdated = await sutReservation.findById(reservation.id);

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
            birthday: '2002-04-30T00:00:00',
            cpf: '12345678901',
            privilege: 'basic'
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
            entryDate: '2023-04-20T12:40:00Z',
            exitDate: '2023-04-21T12:40:00Z',
        };

        const { reservation } = await sutReservation.register(data);


        await expect(sutReservation.update(reservation.id, { exitDate: '2023-04-19T12:40:00Z' })).rejects.toBeInstanceOf(ReservationInvalidError);
    });
});