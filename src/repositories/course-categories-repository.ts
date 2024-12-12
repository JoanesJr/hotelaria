import { Prisma, CourseCategories } from '@prisma/client';

export interface CourseCategoriesRepository {
    findById(id: string): Promise<CourseCategories | null>
    findByUniques(name: string): Promise<CourseCategories | null>
    findAll(): Promise<CourseCategories[] | null>
    findActives(): Promise<CourseCategories[] | null>
    create(data: Prisma.CourseCategoriesCreateInput): Promise<CourseCategories>
    delete(id: string): Promise<CourseCategories>;
    update(id: string, data: Prisma.CourseCategoriesUpdateInput): Promise<CourseCategories>
}