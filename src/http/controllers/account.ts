import { makeAccountsUseCase } from '@/use-cases/factories/make-account-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';

class AccountController {
    async register(request: FastifyRequest, reply: FastifyReply) {
        try {
            const data = request.body;
            const useCase = makeAccountsUseCase();

            const account = await useCase.register(data);

            return reply.status(200).send(account);
        } catch (err) {
            return reply.status(409).send({ message: err.message });
        }

    }


    async update(request: FastifyRequest, reply: FastifyReply) {

        const id = request.params.id;

        try {
            const useCase = makeAccountsUseCase();

            const account = await useCase.update(id, request.body);

            return reply.status(200).send(account);
        } catch (err) {
            return reply.status(409).send({ message: err.message });
        }

    }

    async findAll(request: FastifyRequest, reply: FastifyReply) {

        try {
            const useCase = makeAccountsUseCase();

            const account = await useCase.findAll();

            return reply.status(200).send(account);
        } catch (err) {
            return reply.status(409).send({ message: err.message });
        }

    }

    async findById(request: FastifyRequest, reply: FastifyReply) {

        try {
            const id = request.params.id;
            const useCase = makeAccountsUseCase();

            const account = await useCase.findById(id);

            return reply.status(200).send(account);
        } catch (err) {
            return reply.status(409).send({ message: err.message });
        }

    }

    async findByCheckin(request: FastifyRequest, reply: FastifyReply) {

        try {
            const id = request.params.id;
            const useCase = makeAccountsUseCase();

            const account = await useCase.findByCheckIn(id);

            return reply.status(200).send(account);
        } catch (err) {
            return reply.status(409).send({ message: err.message });
        }

    }

    async cancel(request: FastifyRequest, reply: FastifyReply) {

        try {
            const id = request.params.id;
            const useCase = makeAccountsUseCase();

            const account = await useCase.cancel(id);

            return reply.status(200).send(account);
        } catch (err) {
            return reply.status(409).send({ message: err.message });
        }

    }
}

export const accountController = new AccountController();