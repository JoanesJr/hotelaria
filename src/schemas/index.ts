import { z } from "zod";

export const createUserSchema = z.object({
    name: z.string(),
    surname: z.string(),
    email: z.string().email(),
    cpf: z.string(),
    rg: z.string(),
    birthday: z.date(),
    password_hash: z.string(),
    streeth: z.string(),
    number: z.string(),
    active: z.boolean().default(true),
    address_id: z.string().uuid(),
    privilege_id: z.string().uuid(),
    created_at: z.date().default(() => new Date()),
    updated_at: z.date().default(() => new Date()),
});

const AddressSchema = z.object({
    streeth: z.string(),
    number: z.number(),
    neighboor: z.string(),
    complement: z.string(),
    reference: z.string(),
    created_at: z.date().default(() => new Date()),
    updated_at: z.date().default(() => new Date()),
});

const PrivilegeSchema = z.object({
    name: z.string(),
    created_at: z.date().default(() => new Date()),
    updated_at: z.date().default(() => new Date()),
});

const CourseSchema = z.object({
    name: z.string(),
    price: z.number(),
    trailer: z.string().optional(),
    capa: z.string().optional(),
    active: z.boolean().default(false),
    category_id: z.string().uuid(),
    created_at: z.date().default(() => new Date()),
    updated_at: z.date().default(() => new Date()),
});

const CourseCategorySchema = z.object({
    name: z.string(),
    active: z.boolean().default(true),
    created_at: z.date().default(() => new Date()),
    updated_at: z.date().default(() => new Date()),
});

const ModuleCourseSchema = z.object({
    name: z.string(),
    active: z.boolean(),
    image: z.string().optional(),
    created_at: z.date().default(() => new Date()),
    updated_at: z.date().default(() => new Date()),
});

const ClassCourseSchema = z.object({
    name: z.string(),
    url: z.string().optional(),
    active: z.boolean(),
    created_at: z.date().default(() => new Date()),
    updated_at: z.date().default(() => new Date()),
});

const AttachmentSchema = z.object({
    name: z.string(),
    url: z.string().optional(),
    created_at: z.date().default(() => new Date()),
    updated_at: z.date().default(() => new Date()),
});

const CommentSchema = z.object({
    message: z.string(),
    aulaid: z.string().uuid(),
    userid: z.string().uuid(),
    created_at: z.date().default(() => new Date()),
    updated_at: z.date().default(() => new Date()),
});

const AnswerCommentSchema = z.object({
    message: z.string(),
    userid: z.string().uuid(),
    created_at: z.date().default(() => new Date()),
    updated_at: z.date().default(() => new Date()),
});

const UserCourseSchema = z.object({
    userid: z.string().uuid(),
    initialDate: z.date(),
    expireDate: z.date(),
    courseid: z.string().uuid(),
});

const CouponSchema = z.object({
    percent: z.number(),
    initialDate: z.date(),
    expireDate: z.date(),
    created_at: z.date().default(() => new Date()),
    updated_at: z.date().default(() => new Date()),
});

const CouponByCourseSchema = z.object({
    cupomid: z.string().uuid(),
    courseid: z.string().uuid(),
    created_at: z.date().default(() => new Date()),
    updated_at: z.date().default(() => new Date()),
});

const PurchaseSchema = z.object({
    courseid: z.string().uuid(),
    statusid: z.string().uuid(),
    cupomid: z.string().uuid(),
    userid: z.string().uuid(),
    created_at: z.date().default(() => new Date()),
    updated_at: z.date().default(() => new Date()),
});

const StatusPurchaseSchema = z.object({
    name: z.string(),
    created_at: z.date().default(() => new Date()),
    updated_at: z.date().default(() => new Date()),
});

// Exports for use
export {
    UserSchema,
    AddressSchema,
    PrivilegeSchema,
    CourseSchema,
    CourseCategorySchema,
    ModuleCourseSchema,
    ClassCourseSchema,
    AttachmentSchema,
    CommentSchema,
    AnswerCommentSchema,
    UserCourseSchema,
    CouponSchema,
    CouponByCourseSchema,
    PurchaseSchema,
    StatusPurchaseSchema,
};
