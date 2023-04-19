import { makeRoomUseCase } from '@/use-cases/factories/make-room-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';

class RoomController {
    async register(request: FastifyRequest, reply: FastifyReply) {
        try {
            const data = request.body;
            const useCase = makeRoomUseCase();

            const room = await useCase.register(data);

            return reply.status(200).send(room);
        } catch (err) {
            return reply.status(409).send({ message: err.message });
        }

    }


    async update(request: FastifyRequest, reply: FastifyReply) {

        const id = request.params.id;

        try {
            const useCase = makeRoomUseCase();

            const room = await useCase.update(id, request.body);

            return reply.status(200).send(room);
        } catch (err) {
            return reply.status(409).send({ message: err.message });
        }

    }

    async delete(request: FastifyRequest, reply: FastifyReply) {

        try {
            const id: string = request.params.id;
            const useCase = makeRoomUseCase();

            const room = await useCase.delete(id);

            return reply.status(200).send(room);
        } catch (err) {
            return reply.status(409).send({ message: err.message });
        }

    }

    async findAll(request: FastifyRequest, reply: FastifyReply) {

        try {
            const useCase = makeRoomUseCase();

            const room = await useCase.findAll();

            return reply.status(200).send(room);
        } catch (err) {
            return reply.status(409).send({ message: err.message });
        }

    }

    async findById(request: FastifyRequest, reply: FastifyReply) {

        try {
            const id = request.params.id;
            const useCase = makeRoomUseCase();

            const room = await useCase.findById(id);

            return reply.status(200).send(room);
        } catch (err) {
            return reply.status(409).send({ message: err.message });
        }

    }
}

export const roomController = new RoomController();