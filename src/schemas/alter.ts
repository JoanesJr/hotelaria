import { z } from "zod";

// Schema de edição para User
const EditUserSchema = z.object({
    name: z.string().optional(),
    surname: z.string().optional(),
    email: z.string().email().optional(),
    cpf: z.string().optional(),
    rg: z.string().optional(),
    birthday: z.date().optional(),
    password_hash: z.string().optional(),
    streeth: z.string().optional(),
    number: z.string().optional(),
    active: z.boolean().optional(),
    address_id: z.string().uuid().optional(),
    privilege_id: z.string().uuid().optional(),
    updated_at: z.date().default(() => new Date()), // Atualizado automaticamente
});

// Schema de edição para Address
const EditAddressSchema = z.object({
    streeth: z.string().optional(),
    number: z.number().optional(),
    neighboor: z.string().optional(),
    complement: z.string().optional(),
    reference: z.string().optional(),
    updated_at: z.date().default(() => new Date()),
});

// Schema de edição para Privilege
const EditPrivilegeSchema = z.object({
    name: z.string().optional(),
    updated_at: z.date().default(() => new Date()),
});

// Schema de edição para Courses
const EditCourseSchema = z.object({
    name: z.string().optional(),
    price: z.number().optional(),
    trailer: z.string().optional(),
    capa: z.string().optional(),
    active: z.boolean().optional(),
    category_id: z.string().uuid().optional(),
    updated_at: z.date().default(() => new Date()),
});

// Schema de edição para CourseCategories
const EditCourseCategorySchema = z.object({
    name: z.string().optional(),
    active: z.boolean().optional(),
    updated_at: z.date().default(() => new Date()),
});

// Schema de edição para ModulesCourses
const EditModuleCourseSchema = z.object({
    name: z.string().optional(),
    active: z.boolean().optional(),
    image: z.string().optional(),
    updated_at: z.date().default(() => new Date()),
});

// Schema de edição para ClassCourses
const EditClassCourseSchema = z.object({
    name: z.string().optional(),
    url: z.string().optional(),
    active: z.boolean().optional(),
    updated_at: z.date().default(() => new Date()),
});

// Schema de edição para Attachments
const EditAttachmentSchema = z.object({
    name: z.string().optional(),
    url: z.string().optional(),
    updated_at: z.date().default(() => new Date()),
});

// Schema de edição para Comments
const EditCommentSchema = z.object({
    message: z.string().optional(),
    aulaid: z.string().uuid().optional(),
    userid: z.string().uuid().optional(),
    updated_at: z.date().default(() => new Date()),
});

// Schema de edição para AnswerComments
const EditAnswerCommentSchema = z.object({
    message: z.string().optional(),
    userid: z.string().uuid().optional(),
    updated_at: z.date().default(() => new Date()),
});

// Schema de edição para UserCourses
const EditUserCourseSchema = z.object({
    userid: z.string().uuid().optional(),
    initialDate: z.date().optional(),
    expireDate: z.date().optional(),
    courseid: z.string().uuid().optional(),
});

// Schema de edição para Cupons
const EditCouponSchema = z.object({
    percent: z.number().optional(),
    initialDate: z.date().optional(),
    expireDate: z.date().optional(),
    updated_at: z.date().default(() => new Date()),
});

// Schema de edição para CuponsByCourse
const EditCouponByCourseSchema = z.object({
    cupomid: z.string().uuid().optional(),
    courseid: z.string().uuid().optional(),
    updated_at: z.date().default(() => new Date()),
});

// Schema de edição para Purchases
const EditPurchaseSchema = z.object({
    courseid: z.string().uuid().optional(),
    statusid: z.string().uuid().optional(),
    cupomid: z.string().uuid().optional(),
    userid: z.string().uuid().optional(),
    updated_at: z.date().default(() => new Date()),
});

// Schema de edição para StatusPurchase
const EditStatusPurchaseSchema = z.object({
    name: z.string().optional(),
    updated_at: z.date().default(() => new Date()),
});

// Exports para uso
export {
    EditUserSchema,
    EditAddressSchema,
    EditPrivilegeSchema,
    EditCourseSchema,
    EditCourseCategorySchema,
    EditModuleCourseSchema,
    EditClassCourseSchema,
    EditAttachmentSchema,
    EditCommentSchema,
    EditAnswerCommentSchema,
    EditUserCourseSchema,
    EditCouponSchema,
    EditCouponByCourseSchema,
    EditPurchaseSchema,
    EditStatusPurchaseSchema,
};
