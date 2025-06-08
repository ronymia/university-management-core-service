"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentEnrolledCourseValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const updateStudentEnrolledCourseSchema = zod_1.z.object({
    body: zod_1.z.object({
        studentId: zod_1.z
            .string({
            required_error: 'studentId field is required',
            invalid_type_error: 'studentId field must be a string',
        })
            .nonempty(),
        courseId: zod_1.z
            .string({
            required_error: 'courseId field is required',
            invalid_type_error: 'courseId field must be a string',
        })
            .nonempty(),
        academicSemesterId: zod_1.z
            .string({
            required_error: 'academicSemesterId field is required',
            invalid_type_error: 'academicSemesterId field must be a string',
        })
            .nonempty(),
        status: zod_1.z.enum(Object.values(client_1.StudentEnrolledCourseStatus)),
        grade: zod_1.z
            .string({
            required_error: 'grade field is required',
            invalid_type_error: 'grade field must be a string',
        })
            .nonempty(),
        points: zod_1.z
            .number({
            required_error: 'points field is required',
            invalid_type_error: 'points field must be a number',
        })
            .nonnegative(),
        totalMarks: zod_1.z
            .number({
            required_error: 'totalMarks field is required',
            invalid_type_error: 'totalMarks field must be a number',
        })
            .nonnegative(),
    }),
});
// EXPORT
exports.studentEnrolledCourseValidation = {
    updateStudentEnrolledCourseSchema,
};
