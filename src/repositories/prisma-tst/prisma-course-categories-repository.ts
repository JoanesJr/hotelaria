import { prismaTst as prisma } from '@/lib/prisma-tst';
import { Prisma, CourseCategories } from '@prisma/client';
import { CourseCategoriesRepository } from '../course-categories-repository';

export class PrismaCourseCategoriesRepository implements CourseCategoriesRepository {

    async findAll(): Promise<CourseCategories[] | null> {
        const courseCategories = await prisma.courseCategories.findMany({
            include: {
                Course: true,
            }
        });

        return courseCategories;
    }

    async findByUniques(name: string): Promise<CourseCategories | null> {
        const courseCategories = await prisma.courseCategories.findUnique({
            where: {
                name
            },
            include: {
                Course: true
            }
        });

        return courseCategories || null;
    }

    async findById(id: string): Promise<CourseCategories | null> {
        const courseCategories = await prisma.courseCategories.findUnique({
            where: {
                id
            },
            include: {
                Course: true
            }
        });

        return courseCategories;
    }


    async create(data: Prisma.CourseCategoriesCreateInput): Promise<CourseCategories> {
        const courseCategories = await prisma.courseCategories.create({
            data,
            include: {
                Course: true,
            }
        });

        return courseCategories;
    }

    async delete(id: string): Promise<CourseCategories> {
        const courseCategories = await prisma.courseCategories.delete({
            where: {
                id
            },
            include: {
                Course: true
            }
        });

        return courseCategories;
    }

    async update(id: string, data: Prisma.CourseCategoriesUpdateInput): Promise<CourseCategories> {
        const courseCategories = await prisma.courseCategories.update({
            data,
            where: {
                id
            },
        });

        return courseCategories;
    }
}