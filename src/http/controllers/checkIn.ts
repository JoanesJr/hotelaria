import { makeCheckInUseCase } from '@/use-cases/factories/make-checkin-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';

class CheckInController {
    async register(request: FastifyRequest, reply: FastifyReply) {

        try {
            const checkInUseCase = makeCheckInUseCase();
            const data = request.body;

            const checkIn = await checkInUseCase.register(data);

            return reply.status(200).send(checkIn);
        } catch (err) {
            return reply.status(409).send({ message: err.message });
        }

    }


    async findAll(request: FastifyRequest, reply: FastifyReply) {

        try {
            const checkInUseCase = makeCheckInUseCase();

            const checkin = await checkInUseCase.findAll();

            return reply.status(200).send(checkin);
        } catch (err) {
            return reply.status(409).send({ message: err.message });
        }

    }

    async findById(request: FastifyRequest, reply: FastifyReply) {

        try {
            const id = request.params?.id;
            const checkInUseCase = makeCheckInUseCase();

            const checkin = await checkInUseCase.findById(id);

            return reply.status(200).send(checkin);
        } catch (err) {
            return reply.status(409).send({ message: err.message });
        }

    }

    async findByReservation(request: FastifyRequest, reply: FastifyReply) {

        try {
            const id = request.params?.id;
            const checkInUseCase = makeCheckInUseCase();

            const checkin = await checkInUseCase.findByReservation(id);

            return reply.status(200).send(checkin);
        } catch (err) {
            return reply.status(409).send({ message: err.message });
        }

    }


}

export const checkinController = new CheckInController();