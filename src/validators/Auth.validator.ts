import { z } from "zod";

// Register validation schema
export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  role: z.enum(['student', 'school_dean', 'hod', 'school_administrator']).optional(),
  departmentId: z.string().uuid("Invalid department ID").optional(),
  regNumber: z.string().min(3, "Registration number is required").optional(),
  phoneNumber: z.string().optional(),
  schoolId: z.string().uuid("Invalid school ID").optional(),
  schoolDepartmentId: z.string().uuid("Invalid school department ID").optional(),
  yearOfStudy: z.number().int().min(1).max(7).optional(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

// Login validation schema
export const loginSchema = z.object({
  identifier: z.string().min(1, "Email or registration number is required"),
  password: z.string().min(1, "Password is required"),
});

// Update profile validation schema (matches Partial fields in updateUserProfileService)
export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long").optional(),
  phoneNumber: z.string().optional(),
  schoolId: z.string().uuid("Invalid school ID").optional(),
  schoolDepartmentId: z.string().uuid("Invalid school department ID").optional(),
  yearOfStudy: z.number().int().min(1).max(7).optional(),
});