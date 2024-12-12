import { CoursesRepository } from "@/repositories/courses-repository";
import { CreateCourseDto } from "./dto/createCourseDto";
import { AlreadyExistsError } from "@/use-cases/errors/already-exists-error";
import { Prisma } from "@prisma/client";
import { CourseCategoriesRepository } from "@/repositories/course-categories-repository";
import { NotExistsError } from "@/use-cases/errors/not-exists-error";

export class CreateCourseUseCase {
    constructor(private readonly courseRepository: CoursesRepository, private readonly categoryRepository: CourseCategoriesRepository) { }

    async execute(dto: CreateCourseDto) {
        const exists = await this.courseRepository.findByUniques(dto.name);
        if (exists) {
            throw new AlreadyExistsError('course');
        }

        const existsCategory = await this.categoryRepository.findById(dto.category.id);
        if (!existsCategory) {
            throw new NotExistsError('category');
        }
        
        const createObj: Prisma.CoursesCreateInput = {
            ...dto,
            category: {connect: dto.category.id}
        };
   
        const createCourse = await this.courseRepository.create(createObj);
        return createCourse;

    }
}