import { makeUserUseCase } from '@/use-cases/factories/make-user-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

class UserController {
    async register(request: FastifyRequest, reply: FastifyReply) {
        const registerUserSchema = z.object({
            name: z.string().min(3),
            email: z.string().email(),
            cpf: z.string().min(11).max(11),
            password: z.string(),
            privilege: z.string().optional(),
            birthday: z.string().datetime()
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
}

export const userController = new UserController();