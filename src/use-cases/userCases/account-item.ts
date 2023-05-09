import { AccountItemRepository } from '@/repositories/account-item-repository';
import { AccountItem } from '@prisma/client';
import { z } from 'zod';
import { DataNotFoundError } from '../errors/data-not-found-error';
import { Prisma } from '@prisma/client';
import { AccountRepository } from '@/repositories/account-repository';
import { AccountNotExistsError } from '../errors/account-not-exists-error';


interface RegisterUseCaseRequest {
    itemId: string,
    value: number,
    accountId?: string
}

interface RegisterUseCaseResponse {
    accountItem: AccountItem
}


export class AccountItemUseCase {

    constructor(private readonly repository: AccountItemRepository, private readonly accountRepository: AccountRepository) { }

    async findAll(): Promise<AccountItem[] | null> {
        const accountItems = await this.repository.findAll();

        return accountItems;
    }

    async findById(id: string): Promise<RegisterUseCaseResponse | null> {
        const accountItem = await this.repository.findById(id);

        return { accountItem };
    }

    async findByAccount(checkInId: string): Promise<AccountItem[] | null> {
        const accountItem = await this.repository.findByAccount(checkInId);

        return accountItem;
    }

    async register(request: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
        const registerValidationSchema = z.object({
            itemId: z.string(),
            value: z.number(),
            accountId: z.string().optional(),

        });

        const data = registerValidationSchema.parse(request);

        if (data.accountId) {
            const accountExists = await this.accountRepository.findById(data.accountId);

            if (!accountExists) {
                throw new AccountNotExistsError();
            }
        }

        const accountItem = await this.repository.create(data);

        return { accountItem };

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

        const accountItem = await this.repository.delete(data.id);

        return { accountItem };
    }

    async update(id: string, data: Prisma.AccountItemUpdateInput) {
        const validationSchema = z.object({
            value: z.number().optional(),
        });

        const dataAccount = validationSchema.parse(data);
        const existsAccountItem = await this.repository.findById(id);

        if (!existsAccountItem) {
            throw new DataNotFoundError();
        }

        const updatedAccount = await this.repository.update(id, dataAccount);

        return { accountItem: updatedAccount };
    }

    async linkAccount(data: { id: string, accountId: string }) {
        const validationSchema = z.object({
            id: z.string(),
            accountId: z.string()
        });

        const dataAccount = validationSchema.parse(data);
        const existsAccountItem = await this.repository.findById(dataAccount.id);
        const existsAccount = await this.accountRepository.findById(dataAccount.accountId);

        if (!existsAccountItem) {
            throw new DataNotFoundError();
        }

        if (!existsAccount) {
            throw new AccountNotExistsError();
        }

        const updatedAccount = await this.repository.update(dataAccount.id, { accountId: dataAccount.accountId });

        return { accountItem: updatedAccount };
    }
}