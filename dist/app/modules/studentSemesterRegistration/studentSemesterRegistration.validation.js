"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentSemesterRegistrationValidation = void 0;
const zod_1 = require("zod");
const updateStudentSemesterRegistrationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        isConfirm: zod_1.z.boolean({
            required_error: 'isConfirm is required',
            invalid_type_error: 'isConfirm must be a boolean',
        }),
        totalCreditsTaken: zod_1.z.number({
            required_error: 'totalCreditsTaken is required',
            invalid_type_error: 'totalCreditsTaken must be a number',
        }),
        studentId: zod_1.z.string({
            required_error: 'studentId is required',
            invalid_type_error: 'studentId must be a string',
        }),
        semesterRegistrationId: zod_1.z.string({
            required_error: 'semesterRegistrationId is required',
            invalid_type_error: 'semesterRegistrationId must be a string',
        }),
    }),
});
exports.StudentSemesterRegistrationValidation = {
    updateStudentSemesterRegistrationZodSchema,
};
