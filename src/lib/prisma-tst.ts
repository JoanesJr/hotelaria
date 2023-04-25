import { env } from '@/env';
import { PrismaClient } from '@prisma/client';

export const prismaTst = new PrismaClient({
    log: env.NODE_ENV === 'dev' ? ['query'] : [],
    datasources: {
        db: {
            url: env.DATABASE_URL_TEST
        }
    }
});