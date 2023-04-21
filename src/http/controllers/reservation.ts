import { makeReservationUseCase } from '@/use-cases/factories/make-reservation-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';

class ReservationController {
    async register(request: FastifyRequest, reply: FastifyReply) {
        try {
            const data = request.body;
            const useCase = makeReservationUseCase();

            const reservation = await useCase.register(data);

            return reply.status(200).send(reservation);
        } catch (err) {
            return reply.status(409).send({ message: err.message });
        }

    }


    async update(request: FastifyRequest, reply: FastifyReply) {

        const id = request.params.id;

        try {
            const useCase = makeReservationUseCase();

            const reservation = await useCase.update(id, request.body);

            return reply.status(200).send(reservation);
        } catch (err) {
            return reply.status(409).send({ message: err.message });
        }

    }

    async delete(request: FastifyRequest, reply: FastifyReply) {

        try {
            const id: string = request.params.id;
            const useCase = makeReservationUseCase();

            const reservation = await useCase.delete(id);

            return reply.status(200).send(reservation);
        } catch (err) {
            return reply.status(409).send({ message: err.message });
        }

    }

    async findAll(request: FastifyRequest, reply: FastifyReply) {

        try {
            const useCase = makeReservationUseCase();

            const reservation = await useCase.findAll();

            return reply.status(200).send(reservation);
        } catch (err) {
            return reply.status(409).send({ message: err.message });
        }

    }

    async findById(request: FastifyRequest, reply: FastifyReply) {

        try {
            const id = request.params.id;
            const useCase = makeReservationUseCase();

            const reservation = await useCase.findById(id);

            return reply.status(200).send(reservation);
        } catch (err) {
            return reply.status(409).send({ message: err.message });
        }

    }

    async findReservation(request: FastifyRequest, reply: FastifyReply) {

        try {
            const data = request.body;
            const useCase = makeReservationUseCase();

            const reservation = await useCase.findReservation(data);

            return reply.status(200).send(reservation);
        } catch (err) {
            return reply.status(409).send({ message: err.message });
        }

    }
}

export const reservationController = new ReservationController();