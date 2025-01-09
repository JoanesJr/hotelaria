import { Prisma, Plains } from '@prisma/client';

export interface PlainsRepository {
    findById(id: string): Promise<Plains | null>
    findAll(): Promise<Plains[] | null>
    findAllActive(): Promise<Plains[] | []>
    create(data: Prisma.PlainsCreateInput): Promise<Plains>
    update(id: string, data: Prisma.PlainsUpdateInput): Promise<Plains>
}