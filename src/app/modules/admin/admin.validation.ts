import { z } from 'zod';

const updateAdmin = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    middleName: z.string().optional(),

    gender: z.string().optional(),

    bloodGroup: z.string().optional(),

    email: z.string().email().optional(),

    contactNo: z.string().optional(),

    department: z.string().optional(),

    designation: z.string().optional(),

    profileImage: z.string().optional(),
  }),
});

export const AdminValidation = {
  updateAdmin,
};
