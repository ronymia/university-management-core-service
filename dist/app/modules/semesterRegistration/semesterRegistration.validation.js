"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemesterRegistrationValidation = void 0;
const zod_1 = require("zod");
const semesterRegistration_constant_1 = require("./semesterRegistration.constant");
// CREATE
const createZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        academicSemesterId: zod_1.z
            .string({
            required_error: 'academicSemesterId field is required',
            invalid_type_error: 'Academic Semester Id must be string',
        })
            .min(1, 'Academic Semester Id is required'),
        startDate: zod_1.z
            .string({
            required_error: 'startDate field is required',
            invalid_type_error: 'Start Date must be valid date',
        })
            .min(1, 'Start Date is required'),
        endDate: zod_1.z
            .string({
            required_error: 'endDate field is required',
            invalid_type_error: 'End Date must be valid date',
        })
            .min(1, 'End Date is required'),
        status: zod_1.z
            .enum(semesterRegistration_constant_1.semesterRegistrationStatus, {
            required_error: 'status field is required',
            invalid_type_error: `Status must be one of them : ${semesterRegistration_constant_1.semesterRegistrationStatus.join(', ')}`,
        })
            .optional(),
        minCredit: zod_1.z.number({
            required_error: 'minCredit field is required',
            invalid_type_error: 'Minimum Credit must be number',
        }),
        maxCredit: zod_1.z.number({
            required_error: 'maxCredit field is required',
            invalid_type_error: 'Maximum Credit must be number',
        }),
    }),
});
// UPDATE
const updateZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        academicSemesterId: zod_1.z
            .string({
            required_error: 'academicSemesterId field is required',
            invalid_type_error: 'Academic Semester Id must be string',
        })
            .min(1, 'Academic Semester Id is required'),
        startDate: zod_1.z
            .string({
            required_error: 'startDate field is required',
            invalid_type_error: 'Start Date must be valid date',
        })
            .min(1, 'Start Date is required'),
        endDate: zod_1.z
            .string({
            required_error: 'endDate field is required',
            invalid_type_error: 'End Date must be valid date',
        })
            .min(1, 'End Date is required'),
        status: zod_1.z
            .enum(semesterRegistration_constant_1.semesterRegistrationStatus, {
            required_error: 'status field is required',
            invalid_type_error: `Status must be one of them : ${semesterRegistration_constant_1.semesterRegistrationStatus.join(', ')}`,
        })
            .optional(),
        minCredit: zod_1.z.number({
            required_error: 'minCredit field is required',
            invalid_type_error: 'Minimum Credit must be number',
        }),
        maxCredit: zod_1.z.number({
            required_error: 'maxCredit field is required',
            invalid_type_error: 'Maximum Credit must be number',
        }),
    }),
});
const enrolledOrWithdrawCourseZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        offeredCourseId: zod_1.z
            .string({
            required_error: 'offeredCourseId field is required',
            invalid_type_error: 'Offered Course Id must be string',
        })
            .min(1, 'Offered Course Id is required'),
        offeredCourseSectionId: zod_1.z
            .string({
            required_error: 'offeredCourseSectionId field is required',
            invalid_type_error: 'Offered Course Section Id Id must be string',
        })
            .min(1, 'Offered Course Section Id is required'),
    }),
});
// EXPORT
exports.SemesterRegistrationValidation = {
    createZodSchema,
    updateZodSchema,
    enrolledOrWithdrawCourseZodSchema,
};
