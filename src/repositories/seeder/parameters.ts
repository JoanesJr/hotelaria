import { prisma } from '@/lib/prisma';
import { ParametersAlreadyExistsError } from '@/use-cases/errors/parameters-already-exists-error';

export async function seedParameters() {
    const parameters = {
        email: 'email@example.com',
        password: 'exemploPassword',
        maxReserve: 2,
        maxDaysOfReserve: 7
    };

    const alreadyExists = await prisma.parameters.findFirst();

    if (alreadyExists) {
        throw new ParametersAlreadyExistsError();
    }

    await prisma.parameters.create({
        data: parameters
    });
}