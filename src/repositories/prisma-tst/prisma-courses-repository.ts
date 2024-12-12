import { prismaTst as prisma } from '@/lib/prisma-tst';
import { Prisma, Courses } from '@prisma/client';
import { CoursesRepository } from '../courses-repository';

export class PrismaCoursesRepository implements CoursesRepository {
    async findByCategory(categoryId: string): Promise<Courses[] | null> {
        const courses = await prisma.courses.findMany({
            where: {
                category_id: categoryId
            },
            include: {
                category: true,
                CuponsByCourse: true,
                modules: true,
                Purchases: true,
                UserCourses: true,
            }
        });

        return courses;
    }
    async findAllActives(): Promise<Courses[] | null> {
        const courses = await prisma.courses.findMany({
            where: {
                active: true
            },
            include: {
                category: true,
                CuponsByCourse: true,
                modules: true,
                Purchases: true,
                UserCourses: true,
            }
        });

        return courses;
    }

    async findAll(): Promise<Courses[] | null> {
        const courses = await prisma.courses.findMany({
            include: {
                category: true,
                CuponsByCourse: true,
                modules: true,
                Purchases: true,
                UserCourses: true,
            }
        });

        return courses;
    }

    async findByUniques(name: string): Promise<Courses | null> {
        const courses = await prisma.courses.findMany({
            where: {
                OR: [
                    {
                        name: name
                    },
                ]
            },
            include: {
                category: true,
                CuponsByCourse: true,
                modules: true,
                Purchases: true,
                UserCourses: true,
            }
        });

        return courses[0] || null;
    }

    async findById(id: string): Promise<Courses | null> {
        const courses = await prisma.courses.findUnique({
            where: {
                id
            },
            include: {
                category: true,
                CuponsByCourse: true,
                modules: true,
                Purchases: true,
                UserCourses: true,
            }
        });

        return courses;
    }

    async create(data: Prisma.CoursesCreateInput): Promise<Courses> {
        const courses = await prisma.courses.create({
            data,
            include: {
                category: true,
                CuponsByCourse: true,
                modules: true,
                Purchases: true,
                UserCourses: true,
            }
        });

        return courses;
    }

    async delete(id: string): Promise<Courses> {
        const courses = await prisma.courses.delete({
            where: {
                id
            },
            include: {
                category: true,
                CuponsByCourse: true,
                modules: true,
                Purchases: true,
                UserCourses: true,
            }
        });

        return courses;
    }

    async update(id: string, data: Prisma.CoursesUpdateInput): Promise<Courses> {
        const courses = await prisma.courses.update({
            data,
            where: {
                id
            },
            include: {
                category: true,
                CuponsByCourse: true,
                modules: true,
                Purchases: true,
                UserCourses: true,
            }
        });

        return courses;
    }
}