import { Prisma, Courses } from '@prisma/client';

export interface CoursesRepository {
    findById(id: string): Promise<Courses | null>
    findByCategory(categoryId: string): Promise<Courses[] | null>
    findByUniques(name: string): Promise<Courses | null>
    findAll(): Promise<Courses[] | null>
    findAllActives(): Promise<Courses[] | null>
    create(data: Prisma.CoursesCreateInput): Promise<Courses>
    delete(id: string): Promise<Courses>;
    update(id: string, data: Prisma.CoursesUpdateInput): Promise<Courses>
}