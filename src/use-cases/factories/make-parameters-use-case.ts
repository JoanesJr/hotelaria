import { PrismaParametersRepository } from '@/repositories/prisma/prisma-parameters-repository';
import { ParameterUseCase } from '../userCases/parameters';

export function makeParameterUseCase() {
    const parametersRepository = new PrismaParametersRepository();
    const parameterUseCase = new ParameterUseCase(parametersRepository);

    return parameterUseCase;
}