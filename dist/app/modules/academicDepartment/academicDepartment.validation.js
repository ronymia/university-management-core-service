"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicDepartmentValidation = void 0;
const zod_1 = require("zod");
const createZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({
            required_error: 'Title is required',
        }),
        academicFacultyId: zod_1.z.string({
            required_error: 'Academic Faculty is required',
        }),
    }),
});
const updateZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: 'Title is required' }).optional(),
        academicFacultyId: zod_1.z
            .string({ required_error: 'Academic Faculty is required' })
            .optional(),
    }),
});
exports.AcademicDepartmentValidation = {
    createZodSchema,
    updateZodSchema,
};
