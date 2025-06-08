"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicSemesterValidations = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const zod_1 = require("zod");
const academicSemester_constant_1 = require("./academicSemester.constant");
const createZodSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        title: zod_1.z.enum([...academicSemester_constant_1.academicSemesterTitles], {
            required_error: 'Title is required',
            invalid_type_error: `Acceptable values : ${academicSemester_constant_1.academicSemesterTitles.join(', ')}`,
        }),
        year: zod_1.z.number({
            required_error: 'Year is required',
            invalid_type_error: 'Year must be a number',
        }),
        code: zod_1.z
            .enum([...academicSemester_constant_1.academicSemesterCodes], {
            required_error: 'Code is required',
        })
            .refine((value) => academicSemester_constant_1.academicSemesterCodes.includes(value), {
            message: `Invalid code value. Acceptable values: ${academicSemester_constant_1.academicSemesterCodes.join(', ')}`,
        }),
        startMonth: zod_1.z
            .enum([...academicSemester_constant_1.academicSemesterMonths], {
            required_error: 'Start month is required',
        })
            .refine((value) => academicSemester_constant_1.academicSemesterMonths.includes(value), {
            message: `Invalid start month value. Acceptable values: ${academicSemester_constant_1.academicSemesterMonths.join(', ')}`,
        }),
        endMonth: zod_1.z
            .enum([...academicSemester_constant_1.academicSemesterMonths], {
            required_error: 'End month is required',
        })
            .refine((value) => academicSemester_constant_1.academicSemesterMonths.includes(value), {
            message: `Invalid end month value. Acceptable values: ${academicSemester_constant_1.academicSemesterMonths.join(', ')}`,
        }),
    })
        .refine(data => data.startMonth !== data.endMonth, {
        message: 'Start month and end month cannot be the same',
        path: ['endMonth'],
    }),
});
const updateZodSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        title: zod_1.z.enum([...academicSemester_constant_1.academicSemesterTitles], {
            required_error: 'Title is required',
            invalid_type_error: `Acceptable values : ${academicSemester_constant_1.academicSemesterTitles.join(', ')}`,
        }),
        year: zod_1.z.number({
            required_error: 'Year is required',
            invalid_type_error: 'Year must be a number',
        }),
        code: zod_1.z
            .enum([...academicSemester_constant_1.academicSemesterCodes], {
            required_error: 'Code is required',
        })
            .refine((value) => academicSemester_constant_1.academicSemesterCodes.includes(value), {
            message: `Invalid code value. Acceptable values: ${academicSemester_constant_1.academicSemesterCodes.join(', ')}`,
        }),
        startMonth: zod_1.z
            .enum([...academicSemester_constant_1.academicSemesterMonths], {
            required_error: 'Start month is required',
        })
            .refine((value) => academicSemester_constant_1.academicSemesterMonths.includes(value), {
            message: `Invalid start month value. Acceptable values: ${academicSemester_constant_1.academicSemesterMonths.join(', ')}`,
        }),
        endMonth: zod_1.z
            .enum([...academicSemester_constant_1.academicSemesterMonths], {
            required_error: 'End month is required',
        })
            .refine((value) => academicSemester_constant_1.academicSemesterMonths.includes(value), {
            message: `Invalid end month value. Acceptable values: ${academicSemester_constant_1.academicSemesterMonths.join(', ')}`,
        }),
    })
        .refine(data => data.startMonth !== data.endMonth, {
        message: 'Start month and end month cannot be the same',
        path: ['endMonth'],
    }),
});
// EXPORT ZOD SCHEMAS
exports.AcademicSemesterValidations = {
    createZodSchema,
    updateZodSchema,
};
