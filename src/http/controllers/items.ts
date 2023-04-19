import { makeItemUseCase } from '@/use-cases/factories/make-item-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';

class ItemController {
    async register(request: FastifyRequest, reply: FastifyReply) {

        try {
            const registerUseCase = makeItemUseCase();
            const data = request.body;

            const item = await registerUseCase.register(data);

            return reply.status(200).send(item);
        } catch (err) {
            return reply.status(409).send({ message: err.message });
        }

    }

    async update(request: FastifyRequest, reply: FastifyReply) {

        const id = request.params.id;
        const data = request.body;

        try {
            const registerUseCase = makeItemUseCase();

            const item = await registerUseCase.update(id, data);

            return reply.status(200).send(item);
        } catch (err) {
            return reply.status(409).send({ message: err.message });
        }

    }

    async delete(request: FastifyRequest, reply: FastifyReply) {

        try {
            const id: string = request.params.id;
            const registerUseCase = makeItemUseCase();

            const item = await registerUseCase.delete(id);

            return reply.status(200).send(item);
        } catch (err) {
            return reply.status(409).send({ message: err.message });
        }

    }

    async findAll(request: FastifyRequest, reply: FastifyReply) {

        try {
            const registerUseCase = makeItemUseCase();

            const item = await registerUseCase.findAll();

            return reply.status(200).send(item);
        } catch (err) {
            return reply.status(409).send({ message: err.message });
        }

    }

    async findById(request: FastifyRequest, reply: FastifyReply) {

        try {
            const id = request.params?.id;
            const registerUseCase = makeItemUseCase();

            const item = await registerUseCase.findById(id);

            return reply.status(200).send(item);
        } catch (err) {
            return reply.status(409).send({ message: err.message });
        }

    }




}

export const itemController = new ItemController();