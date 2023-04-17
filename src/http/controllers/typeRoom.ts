import { makeTypeRoomUseCase } from '@/use-cases/factories/make-typeRoom-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';

class TypeRoomController {
    async create(request: FastifyRequest, reply: FastifyReply) {
        try {
            const data = request.body;
            const useCase = makeTypeRoomUseCase();
            const typeRoom = await useCase.register(data);

            return reply.status(200).send(typeRoom);

        } catch (err) {
            return reply.status(409).send({ message: err.message });
        }

    }
}

export const typeRoomController = new TypeRoomController();