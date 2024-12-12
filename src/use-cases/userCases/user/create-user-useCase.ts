import { UsersRepository } from "@/repositories/users-repository";
import { CreateUserDto } from "./dto/createUserDto";
import { Prisma } from "@prisma/client";
import { AlreadyExistsError } from "@/use-cases/errors/already-exists-error";

export class CreateUserUseCase {
    constructor(private readonly usersRepository: UsersRepository) { }

    async execute(dto: CreateUserDto) {
        const userIsUnique = await this.usersRepository.findByUniques(dto.cpf, dto.rg, dto.email);
        if (userIsUnique) {
            throw new AlreadyExistsError('cpf, email or rg');
        }

        const createUser: Prisma.UserCreateInput = {
            ...dto,
            address: {
                create: dto.address
            },
            privilege: {
                connect: {id: dto.privilege.id}
            }
        };
   
        const createdUser = await this.usersRepository.create(createUser);
        return createdUser;
    }
}