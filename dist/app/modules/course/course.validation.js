"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseValidations = void 0;
const zod_1 = require("zod");
// CREATE
const createSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z
            .string({
            required_error: 'Title is required',
            invalid_type_error: 'Title must be string',
        })
            .min(1, 'Please course Title'),
        code: zod_1.z
            .string({
            required_error: 'Code is required',
            invalid_type_error: 'Code must be string',
        })
            .min(1, 'Please enter course code'),
        credits: zod_1.z.number({
            required_error: 'Credits is required',
            invalid_type_error: 'Credits must be number',
        }),
        preRequisiteCourses: zod_1.z
            .array(zod_1.z.object({
            courseId: zod_1.z
                .string({
                required_error: 'Course id is required',
                invalid_type_error: 'Course id must be string',
            })
                .min(1, 'Course id is required'),
        }))
            .optional(),
    }),
});
// UPDATE
const updateSchema = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z
            .string({
            required_error: 'Id is required',
            invalid_type_error: 'Id must be string',
        })
            .min(1, 'Id is required'),
        title: zod_1.z
            .string({
            required_error: 'Title is required',
            invalid_type_error: 'Title must be string',
        })
            .min(1, 'Please enter course Title'),
        code: zod_1.z
            .string({
            required_error: 'Code is required',
            invalid_type_error: 'Code must be string',
        })
            .min(1, 'Please enter course code'),
        credits: zod_1.z.number({
            required_error: 'Credits is required',
            invalid_type_error: 'Credits must be number',
        }),
        preRequisiteCourses: zod_1.z
            .array(zod_1.z.object({
            courseId: zod_1.z.string({
                required_error: 'Course id is required',
                invalid_type_error: 'Course id must be string',
            }),
        }))
            .optional(),
    }),
});
// ASSIGN FACULTY SCHEMA
const assignOrRemoveFacultiesSchema = zod_1.z.object({
    body: zod_1.z.object({
        facultyIds: zod_1.z
            .array(zod_1.z.string({
            required_error: 'Faculty id is required',
            invalid_type_error: 'Faculty id must be string',
        }))
            .nonempty('At least one faculty ID must be provided'),
    }),
});
// EXPORT
exports.CourseValidations = {
    createSchema,
    updateSchema,
    assignOrRemoveFacultiesSchema,
};
