import { z } from 'zod';
import { bloodGroup, gender } from './student.constant';

const updateStudentZodSchema = z.object({
  body: z.object({
    firstName: z.string().optional(),
    middleName: z.string().optional(),
    lastName: z.string().optional(),
    gender: z.enum([...gender] as [string, ...string[]]).optional(),
    dateOfBirth: z.string().optional(),
    email: z.string().optional(),
    bloodGroup: z.enum([...bloodGroup] as [string, ...string[]]).optional(),
    contactNo: z.string().optional(),
    emergencyContactNo: z.string().optional(),
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
    profileImage: z.string().optional(),
    academicSemester: z.string().optional(),
    academicDepartment: z.string().optional(),
    academicFaculty: z.string().optional(),
  }),
});

export const StudentValidation = {
  updateStudentZodSchema,
};
