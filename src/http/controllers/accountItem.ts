import { makeAccountItemUseCase } from '@/use-cases/factories/make-accountItem-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';

class AccountItemController {
    async register(request: FastifyRequest, reply: FastifyReply) {
        try {
            const data = request.body;
            const useCase = makeAccountItemUseCase();

            const account = await useCase.register(data);

            return reply.status(200).send(account);
        } catch (err) {
            return reply.status(409).send({ message: err.message });
        }

    }


    async update(request: FastifyRequest, reply: FastifyReply) {

        const id = request.params.id;

        try {
            const useCase = makeAccountItemUseCase();

            const account = await useCase.update(id, request.body);

            return reply.status(200).send(account);
        } catch (err) {
            return reply.status(409).send({ message: err.message });
        }

    }

    async findAll(request: FastifyRequest, reply: FastifyReply) {

        try {
            const useCase = makeAccountItemUseCase();

            const account = await useCase.findAll();

            return reply.status(200).send(account);
        } catch (err) {
            return reply.status(409).send({ message: err.message });
        }

    }

    async findById(request: FastifyRequest, reply: FastifyReply) {

        try {
            const id = request.params.id;
            const useCase = makeAccountItemUseCase();

            const account = await useCase.findById(id);

            return reply.status(200).send(account);
        } catch (err) {
            return reply.status(409).send({ message: err.message });
        }

    }

    async findByAccount(request: FastifyRequest, reply: FastifyReply) {

        try {
            const id = request.params.id;
            const useCase = makeAccountItemUseCase();

            const account = await useCase.findByAccount(id);

            return reply.status(200).send(account);
        } catch (err) {
            return reply.status(409).send({ message: err.message });
        }

    }

    async delete(request: FastifyRequest, reply: FastifyReply) {

        try {
            const id: string = request.params.id;
            const registerUseCase = makeAccountItemUseCase();

            const item = await registerUseCase.delete(id);

            return reply.status(200).send(item);
        } catch (err) {
            return reply.status(409).send({ message: err.message });
        }

    }
}

export const accountItemController = new AccountItemController();