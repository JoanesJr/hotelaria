import { Prisma, Parameters } from '@prisma/client';

export interface ParametersRepository {
    findById(id: string): Promise<Parameters | null>
    findParameters(): Promise<Parameters | null>
    update(id: string, data: Prisma.ParametersUpdateInput): Promise<Parameters>
}