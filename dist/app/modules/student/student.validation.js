"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentValidation = void 0;
const zod_1 = require("zod");
const student_constant_1 = require("./student.constant");
const updateStudentZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        firstName: zod_1.z.string().optional(),
        middleName: zod_1.z.string().optional(),
        lastName: zod_1.z.string().optional(),
        gender: zod_1.z.enum([...student_constant_1.gender]).optional(),
        dateOfBirth: zod_1.z.string().optional(),
        email: zod_1.z.string().optional(),
        bloodGroup: zod_1.z.enum([...student_constant_1.bloodGroup]).optional(),
        contactNo: zod_1.z.string().optional(),
        emergencyContactNo: zod_1.z.string().optional(),
        // presentAddress: z.string().optional(),
        // permanentAddress: z.string().optional(),
        // guardian: z
        //   .object({
        //     fatherName: z.string().optional(),
        //     fatherOccupation: z.string().optional(),
        //     fatherContactNo: z.string().optional(),
        //     motherName: z.string().optional(),
        //     motherOccupation: z.string().optional(),
        //     motherContactNo: z.string().optional(),
        //   })
        //   .optional(),
        // localGuardian: z
        //   .object({
        //     name: z.string().optional(),
        //     contactNo: z.string().optional(),
        //     address: z.string().optional(),
        //   })
        //   .optional(),
        profileImage: zod_1.z.string().optional(),
        academicSemester: zod_1.z.string().optional(),
        academicDepartment: zod_1.z.string().optional(),
        academicFaculty: zod_1.z.string().optional(),
    }),
});
exports.StudentValidation = {
    updateStudentZodSchema,
};
