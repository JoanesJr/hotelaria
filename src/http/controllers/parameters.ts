import { seedParameters } from '@/repositories/seeder';
import { makeParameterUseCase } from '@/use-cases/factories/make-parameters-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';

class ParameterController {
    async createParameters(request: FastifyRequest, reply: FastifyReply) {

        try {

            await seedParameters();

            return reply.status(200).send({ msg: 'parameters has been created.' });
        } catch (err) {
            return reply.status(409).send({ message: err.message });
        }

    }

    async update(request: FastifyRequest, reply: FastifyReply) {

        const id = request.params.id;
        const data = request.body;

        try {
            const registerUseCase = makeParameterUseCase();

            const parameter = await registerUseCase.update(id, data);

            return reply.status(200).send(parameter);
        } catch (err) {
            return reply.status(409).send({ message: err.message });
        }

    }


    async findParameters(request: FastifyRequest, reply: FastifyReply) {

        try {
            const registerUseCase = makeParameterUseCase();

            const parameter = await registerUseCase.findParameters();

            return reply.status(200).send(parameter);
        } catch (err) {
            return reply.status(409).send({ message: err.message });
        }

    }

    async findById(request: FastifyRequest, reply: FastifyReply) {

        try {
            const id = request.params?.id;
            const registerUseCase = makeParameterUseCase();

            const parameter = await registerUseCase.findById(id);

            return reply.status(200).send(parameter);
        } catch (err) {
            return reply.status(409).send({ message: err.message });
        }

    }
}

export const parameterController = new ParameterController();