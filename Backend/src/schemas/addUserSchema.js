import { z } from 'zod';

const roles = ["HR", "admin", "employee", "financeManager", "salesManager", "productionManager"];
const departments = ["Finance", "Sales", "HR", "Production"];

export const addUserSchema = z.object({
    fullName: z.string()
        .min(1, { message: "Fullname is required" })
        .trim(),

    email: z.string()
        .email({ message: 'Invalid email address' }),

    role: z.enum(roles),

    department: z.enum(departments).optional(),

    country: z.string(),

    phoneNumber: z.string()
        .refine(value => /\d{10}/.test(value), { message: "Invalid phone number format" })
});
