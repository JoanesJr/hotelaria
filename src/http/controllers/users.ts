import { makeUserUseCase } from '@/use-cases/factories/make-user-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export enum MaritalStatus {
    solteiro = 'solteiro',
    casado = 'casado',
}

class UserController {
    async register(request: FastifyRequest, reply: FastifyReply) {
        const registerUserSchema = z.object({
            name: z.string().min(3),
            email: z.string().email(),
            cpf: z.string().min(11).max(11),
            password: z.string(),
            privilege: z.string().optional(),
            birthday: z.string().datetime(),
            maritalStatus: z.enum(Object.values(MaritalStatus)),
            cardCar: z.string().optional()
        });

        const data = registerUserSchema.parse(request.body);

        try {
            const registerUseCase = makeUserUseCase();

            const user = await registerUseCase.register(data);

            return reply.status(200).send(user);
        } catch (err) {
            return reply.status(409).send({ message: err.message });
        }

    }

    async update(request: FastifyRequest, reply: FastifyReply) {

        const id = request.params.id;
        const registerUserSchema = z.object({
            name: z.string().min(3).optional(),
            email: z.string().email().optional(),
            cpf: z.string().min(11).max(11).optional(),
            password: z.string().optional(),
            privilege: z.string().optional(),
            birthday: z.string().datetime().optional(),
            maritalStatus: z.enum(Object.values(MaritalStatus)).optional(),
            cardCar: z.string().optional()
        });

        const data = registerUserSchema.parse(request.body);

        try {
            const registerUseCase = makeUserUseCase();

            const user = await registerUseCase.update(id, data);

            return reply.status(200).send(user);
        } catch (err) {
            return reply.status(409).send({ message: err.message });
        }

    }

    async delete(request: FastifyRequest, reply: FastifyReply) {

        try {
            const id: string = request.params.id;
            const registerUseCase = makeUserUseCase();

            const user = await registerUseCase.delete(id);

            return reply.status(200).send(user);
        } catch (err) {
            return reply.status(409).send({ message: err.message });
        }

    }

    async findAll(request: FastifyRequest, reply: FastifyReply) {

        try {
            const registerUseCase = makeUserUseCase();

            const user = await registerUseCase.findAll();

            return reply.status(200).send(user);
        } catch (err) {
            return reply.status(409).send({ message: err.message });
        }

    }

    async findById(request: FastifyRequest, reply: FastifyReply) {

        try {
            const id = request.params?.id;
            const registerUseCase = makeUserUseCase();

            const user = await registerUseCase.findById(id);

            return reply.status(200).send(user);
        } catch (err) {
            return reply.status(409).send({ message: err.message });
        }

    }

    async findByCpf(request: FastifyRequest, reply: FastifyReply) {

        try {
            const cpf = request.params?.cpf;
            const registerUseCase = makeUserUseCase();

            const user = await registerUseCase.findByCpf(cpf);

            return reply.status(200).send(user);
        } catch (err) {
            return reply.status(409).send({ message: err.message });
        }

    }

    async findByEmail(request: FastifyRequest, reply: FastifyReply) {

        try {
            const email = request.params?.email;
            const registerUseCase = makeUserUseCase();

            const user = await registerUseCase.findByEmail(email);

            return reply.status(200).send(user);
        } catch (err) {
            return reply.status(409).send({ message: err.message });
        }

    }

}

export const userController = new UserController();