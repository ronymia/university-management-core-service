"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacultyValidation = void 0;
const zod_1 = require("zod");
const student_constant_1 = require("../student/student.constant");
const faculty_constant_1 = require("./faculty.constant");
// Create
const createFacultyZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        firstName: zod_1.z.string().optional(),
        middleName: zod_1.z.string().optional(),
        lastName: zod_1.z.string().optional(),
        gender: zod_1.z.enum([...student_constant_1.gender]).optional(),
        email: zod_1.z.string().optional(),
        bloodGroup: zod_1.z.enum([...student_constant_1.bloodGroup]).optional(),
        contactNo: zod_1.z.string().optional(),
        profileImage: zod_1.z.string().optional(),
        designation: zod_1.z.enum([...faculty_constant_1.designation]).optional(),
        academicDepartment: zod_1.z.string().optional(),
        academicFaculty: zod_1.z.string().optional(),
    }),
});
// UPDATE
const updateFacultyZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        firstName: zod_1.z.string().optional(),
        middleName: zod_1.z.string().optional(),
        lastName: zod_1.z.string().optional(),
        gender: zod_1.z.enum([...student_constant_1.gender]).optional(),
        email: zod_1.z.string().optional(),
        bloodGroup: zod_1.z.enum([...student_constant_1.bloodGroup]).optional(),
        contactNo: zod_1.z.string().optional(),
        profileImage: zod_1.z.string().optional(),
        designation: zod_1.z.enum([...faculty_constant_1.designation]).optional(),
        academicDepartment: zod_1.z.string().optional(),
        academicFaculty: zod_1.z.string().optional(),
    }),
});
// ASSIGN COURSE SCHEMA
const assignOrRemoveCoursesSchema = zod_1.z.object({
    body: zod_1.z.object({
        courseIds: zod_1.z
            .array(zod_1.z.string({
            required_error: 'Course id is required',
            invalid_type_error: 'Course id must be string',
        }))
            .nonempty('At least one Course ID must be provided'),
    }),
});
// EXPORT
exports.FacultyValidation = {
    createFacultyZodSchema,
    updateFacultyZodSchema,
    assignOrRemoveCoursesSchema,
};
