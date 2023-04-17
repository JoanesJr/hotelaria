import { makeAddressUseCase } from '@/use-cases/factories/make-address-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';

class AddressController {
    async register(request: FastifyRequest, reply: FastifyReply) {
        try {
            const data = request.body;
            const useCase = makeAddressUseCase();

            const address = await useCase.register(data);

            return reply.status(200).send(address);
        } catch (err) {
            return reply.status(409).send({ message: err.message });
        }

    }
}

export const addressController = new AddressController();