import { AccountRepository } from '@/repositories/account-repository';
import { Account, Item } from '@prisma/client';
import { z } from 'zod';
import { DataNotFoundError } from '../errors/data-not-found-error';
import { Prisma } from '@prisma/client';
import { AccountAlreadyExistsError } from '../errors/account-already-exists-error';
import { CheckInRepository } from '@/repositories/checkin-repository';
import { AccountCheckInNotExistsError } from '../errors/account-checkin-not-exists-error';

interface RegisterUseCaseRequest {
    checkInId: string,
    roomValue: number,
    status: StatusAccount,
    items: Item[]
    total: number
}

interface RegisterUseCaseResponse {
    account: Account
}

export enum StatusAccount {
    cancelado = 'Cancelado',
    aberto = 'Aberto',
    fechado = 'Fechado'
}

export class AccountUseCase {

    constructor(private readonly repository: AccountRepository, private readonly checkInRepository: CheckInRepository) { }

    async findAll(): Promise<Account[] | null> {
        const accounts = await this.repository.findAll();

        return accounts;
    }

    async findById(id: string): Promise<Account | null> {
        const account = await this.repository.findById(id);

        return account;
    }

    async register(request: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
        const registerValidationSchema = z.object({
            checkInId: z.string(),
            roomValue: z.number(),
            status: z.enum(Object.values(StatusAccount)),
            total: z.number().optional(),
            items: z.any()
        });

        const data = registerValidationSchema.parse(request);

        const checkInWithSameAccount = await this.repository.findByCheckIn(data.checkInId);
        const checkInExists = await this.checkInRepository.findById(data.checkInId);

        if (checkInWithSameAccount) {
            throw new AccountAlreadyExistsError();
        }

        if (checkInExists) {
            throw new AccountCheckInNotExistsError();
        }


        const account = await this.repository.create(data);

        return { account };

    }

    async delete(id: string) {
        const bodySchemaValidation = z.object({
            id: z.string()
        });

        const data = bodySchemaValidation.parse({ id });

        const existsAccount = await this.repository.findById(data.id);

        if (!existsAccount) {
            throw new DataNotFoundError();
        }

        const account = await this.repository.delete(data.id);

        return account;
    }

    async update(id: string, data: Prisma.AccountUpdateInput) {
        const validationSchema = z.object({
            checkInId: z.string().optional(),
            roomValue: z.number().optional(),
            status: z.enum(Object.values(StatusAccount)).optional(),
            total: z.number().optional(),
            items: z.any().optional()
        });

        const dataAccount = validationSchema.parse(data);

        const accountExists = await this.repository.findById(id);

        if (!accountExists || !id) {
            throw new DataNotFoundError();
        }

        if (dataAccount.checkInId) {

            if (dataAccount && accountExists.id != id) {
                throw new AccountAlreadyExistsError();
            }
        }

        const updatedAccount = await this.repository.update(id, dataAccount);

        return { account: updatedAccount };
    }
}