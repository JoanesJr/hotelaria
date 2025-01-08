import { UsersRepository } from "@/repositories/users-repository";
import { Prisma } from "@prisma/client";
import { AlreadyExistsError } from "@/use-cases/errors/already-exists-error";
import { UpdateUserDto } from "./dto/updateUserDto";

export class UpdateUserUseCase {
    constructor(private readonly usersRepository: UsersRepository) { }

    async execute(id: string, dto: UpdateUserDto) {
        const userIsUnique = await this.usersRepository.findByUniques(dto.cpf, dto.rg, dto.email);
        if (userIsUnique && userIsUnique.id != id) {
            throw new AlreadyExistsError('cpf, email or rg');
        }

        const updateUser: Prisma.UserUpdateInput = {
            ...dto,
        };

        const updatedUser = await this.usersRepository.update(id, updateUser);
        return updatedUser;
    }
}