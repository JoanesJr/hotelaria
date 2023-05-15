import { AccountRepository } from '@/repositories/account-repository';
import { Account, AccountItem } from '@prisma/client';
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
    items: AccountItem[]
    total?: number
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

    async findById(id: string): Promise<RegisterUseCaseResponse | null> {
        const account = await this.repository.findById(id);

        return { account };
    }

    async findByCheckIn(checkInId: string): Promise<RegisterUseCaseResponse | null> {
        const account = await this.repository.findByCheckIn(checkInId);

        return { account };
    }

    async register(request: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
        const registerValidationSchema = z.object({
            checkInId: z.string(),
            roomValue: z.number(),
            status: z.enum(Object.values(StatusAccount)),
            total: z.number().optional(),
        });

        const itemsSchema = z.object({
            items: z.array(z.object({
                itemId: z.string(),
                value: z.number()
            }))
        });

        const data = registerValidationSchema.parse(request);
        const itemsValidation = itemsSchema.parse(request);

        const accountWithSameCheckin = await this.repository.findByCheckIn(data.checkInId);
        const checkInExists = await this.checkInRepository.findById(data.checkInId);

        if (accountWithSameCheckin && accountWithSameCheckin.status != StatusAccount.cancelado) {
            throw new AccountAlreadyExistsError();
        }

        if (!checkInExists) {
            throw new AccountCheckInNotExistsError();
        }


        const account = await this.repository.create(data, itemsValidation.items);

        return { account };

    }

    async cancel(id: string) {
        const bodySchemaValidation = z.object({
            id: z.string()
        });

        const data = bodySchemaValidation.parse({ id });

        const existsAccount = await this.repository.findById(data.id);

        if (!existsAccount) {
            throw new DataNotFoundError();
        }

        const account = await this.repository.cancel(data.id);

        return { account };
    }

    async update(id: string, request: Prisma.AccountUpdateInput) {
        const validationSchema = z.object({
            roomValue: z.number().optional(),
            status: z.enum(Object.values(StatusAccount)).optional(),
            total: z.number().optional(),
        });


        const data = validationSchema.parse(request);

        const accountExists = await this.repository.findById(id);

        if (!accountExists || !id) {
            throw new DataNotFoundError();
        }


        const updatedAccount = await this.repository.update(id, data);

        return { account: updatedAccount };
    }
}