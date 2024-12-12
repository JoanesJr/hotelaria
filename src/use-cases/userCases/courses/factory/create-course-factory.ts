import { PrismaCourseCategoriesRepository } from "@/repositories/prisma/prisma-course-categories-repository";
import { PrismaCourseCategoriesRepository as PrismaCourseCategoriesRepositoryTst } from "@/repositories/prisma-tst/prisma-course-categories-repository";
import { PrismaCoursesRepository } from "@/repositories/prisma/prisma-courses-repository"
import { CreateCourseUseCase } from "../create-course-useCase";
import { PrismaCoursesRepository as PrismaCourseRepositoryTst } from "@/repositories/prisma-tst/prisma-courses-repository";

export const makeCreateCourse = (ambient: 'prod' | 'dev' = 'prod') => {
    const courseRep = ambient == 'prod' ? new PrismaCoursesRepository(): new PrismaCourseRepositoryTst();
    const courseCategoryRep = ambient == 'prod' ? new PrismaCourseCategoriesRepository() : new PrismaCourseCategoriesRepositoryTst();
    return new CreateCourseUseCase(courseRep, courseCategoryRep);
}