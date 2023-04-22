import { ParametersRepository } from '@/repositories/parameters-repository';
import { Parameters } from '@prisma/client';
import { z } from 'zod';
import { DataNotFoundError } from '../errors/data-not-found-error';
import { Prisma } from '@prisma/client';
import { AES } from 'crypto-js';
import * as dotenv from 'dotenv';
dotenv.config();

export class ParameterUseCase {

    constructor(private readonly repository: ParametersRepository) { }

    async findById(id: string): Promise<Parameters | null> {
        const parameters = await this.repository.findById(id);

        return parameters;
    }

    async findParameters(): Promise<Parameters | null> {
        const parameter = await this.repository.findParameters();

        return parameter;
    }


    async update(id: string, data: Prisma.ParametersUpdateInput) {
        const validationSchema = z.object({
            email: z.string().min(3).optional(),
            password: z.string().optional(),
            maxReserve: z.number().optional(),
            maxDaysOfReserve: z.number().optional()

        });

        const dataParameter = validationSchema.parse(data);

        const parameterExists = await this.repository.findById(id);

        if (!parameterExists || !id) {
            throw new DataNotFoundError();
        }

        if (dataParameter.password) {
            dataParameter.password = AES.encrypt(dataParameter.password, process.env.PASSWORD_ENCRYPTED).toString();
        }

        const updatedParameter = await this.repository.update(id, dataParameter);

        return { parameter: updatedParameter };
    }
}