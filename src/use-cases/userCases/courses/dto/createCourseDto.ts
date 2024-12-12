export interface CreateCourseDto {
    id: string;
    name: string;
    price: number;
    trailer?: string;
    capa?: string;
    active?: boolean;
    category: Category;
    created_at: Date;
    updated_at: Date;
}

interface Category {
    id: string;
    name: string;
}
