"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferedCourseValidation = void 0;
const zod_1 = require("zod");
// CREATE
const createOfferedCourseZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        academicDepartmentId: zod_1.z
            .string({
            required_error: 'academicDepartmentId field is required',
            invalid_type_error: 'Academic Department Id must be string',
        })
            .nonempty({ message: 'Academic Department Id is required' }),
        semesterRegistrationId: zod_1.z
            .string({
            required_error: 'semesterRegistrationId field is required',
            invalid_type_error: 'Semester Registration Id must be string',
        })
            .nonempty({ message: 'Semester Registration Id is required' }),
        courseIds: zod_1.z
            .array(zod_1.z.string({
            required_error: 'courseIds is required',
            invalid_type_error: 'Course Id must be string',
        }))
            .min(1, 'At least one Course ID must be provided'),
    }),
});
// UPDATE
const updateOfferedCourseZodSchema = zod_1.z.object({
    // params: z.object({
    //   id: z.string({
    //     required_error: 'Id is required',
    //     invalid_type_error: 'Id must be string',
    //   }),
    // }),
    body: zod_1.z.object({
        academicDepartmentId: zod_1.z
            .string({
            required_error: 'academicDepartmentId field is required',
            invalid_type_error: 'Academic Department Id must be string',
        })
            .nonempty({ message: 'Academic Department Id is required' })
            .optional(),
        semesterRegistrationId: zod_1.z
            .string({
            required_error: 'semesterRegistrationId field is required',
            invalid_type_error: 'Semester Registration Id must be string',
        })
            .nonempty({ message: 'Semester Registration Id is required' })
            .optional(),
        courseId: zod_1.z
            .string({
            required_error: 'courseIds is required',
            invalid_type_error: 'Course Id must be string',
        })
            .min(1, 'At least one Course ID must be provided')
            .optional(),
    }),
});
// EXPORT
exports.OfferedCourseValidation = {
    createOfferedCourseZodSchema,
    updateOfferedCourseZodSchema,
};
