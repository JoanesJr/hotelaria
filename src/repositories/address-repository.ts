import { Address, Prisma } from '@prisma/client';

export interface AddressRepository {
    findById(id: string): Promise<Address | null>
    findAll(): Promise<Address[] | null>
    create(data: Prisma.AddressCreateInput | { street: string, neighborhood: string, userId: string, cep: string }): Promise<Address | { id: string, street: string, neighborhood: string, userId: string, created_at: Date, cep: string }>
    findByUser(id_user: string): Promise<Address | null>
}