import { ParametersRepository } from '@/repositories/parameters-repository';
import { Parameters, Prisma } from '@prisma/client';

export class InMemoryParametersRepository implements ParametersRepository {
    public parameters: Parameters[] = [];

    async findParameters(): Promise<Parameters> {
        return this.parameters[0];
    }

    async findById(id: string) {
        const parameter = this.parameters.find((parameter) => parameter.id === id);

        if (!parameter) {
            return null;
        }

        return parameter;
    }

    async update(id: string, data: Prisma.ParametersUpdateInput) {

        const parameterOld = this.parameters.filter(parameter => parameter.id == id)[0];
        const indexParameter = this.parameters.indexOf(parameterOld);

        const mergeObject = Object.assign(parameterOld, data);

        this.parameters[indexParameter] = mergeObject;

        return mergeObject;

    }
}