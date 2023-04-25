import { prismaTst as prisma } from '@/lib/prisma-tst';
import { Prisma, Parameters } from '@prisma/client';
import { ParametersRepository } from '../parameters-repository';

export class PrismaTstParametersRepository implements ParametersRepository {

    async findById(id: string): Promise<Parameters | null> {
        const parameter = await prisma.parameters.findUnique({
            where: {
                id
            }
        });

        return parameter;
    }

    async findParameters(): Promise<Parameters> {
        const parameter = await prisma.parameters.findFirst();

        return parameter;
    }

    async update(id: string, data: Prisma.ParametersUpdateInput): Promise<Parameters> {
        const parameter = await prisma.parameters.update({
            data,
            where: {
                id
            }
        });

        return parameter;
    }

    async deleteAll() {
        await prisma.parameters.deleteMany();
    }
}