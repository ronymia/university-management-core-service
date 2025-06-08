"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentEnrolledCourseMarkValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const updateStudentEnrolledCourseMarkZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        studentId: zod_1.z
            .string({
            required_error: 'studentId field is required',
            invalid_type_error: 'studentId must be a string',
        })
            .trim()
            .min(1, { message: 'Please Provide studentId' }),
        courseId: zod_1.z
            .string({
            required_error: 'courseId field is required',
            invalid_type_error: 'courseId must be a string',
        })
            .trim()
            .min(1, { message: 'Please Provide courseId' }),
        academicSemesterId: zod_1.z
            .string({
            required_error: 'academicSemesterId field is required',
            invalid_type_error: 'academicSemesterId must be a string',
        })
            .trim()
            .min(1, { message: 'Please Provide academicSemesterId' }),
        // grade: z
        //   .string({
        //     required_error: 'grade field is required',
        //     invalid_type_error: 'grade must be a string',
        //   })
        //   .min(1, { message: 'grade must be greater than 0' }),
        mark: zod_1.z
            .number({
            required_error: 'mark field is required',
            invalid_type_error: 'mark must be a number',
        })
            .min(1, { message: 'mark must be greater than 0' }),
        examType: zod_1.z.enum(Object.values(client_1.ExamType), {
            required_error: 'examType field is required',
            invalid_type_error: 'examType must be a string',
        }),
    }),
});
exports.StudentEnrolledCourseMarkValidation = {
    updateStudentEnrolledCourseMarkZodSchema,
};
