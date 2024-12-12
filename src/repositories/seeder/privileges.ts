import { prisma } from '@/lib/prisma';
import { ParametersAlreadyExistsError } from '@/use-cases/errors/parameters-already-exists-error';
import { Privilege } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

export async function seedPrivileges() {
    const privileges: Privilege[] = [
        {
            id: uuidv4(),
            name: 'admin',
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            id: uuidv4(),
            name: 'user',
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            id: uuidv4(),
            name: 'master',
            created_at: new Date(),
            updated_at: new Date(),
        },
    ];

    for (const privilege of privileges) {
        const alreadyExists = await prisma.privilege.findFirst({
            where: { name: privilege.name },
        });

        if (alreadyExists) {
            throw new ParametersAlreadyExistsError();
        }

        await prisma.privilege.create({
            data: privilege
        });
    
    }
}