import { z } from "zod";

// Create non-academic department validation schema
export const createNonAcademicDepartmentSchema = z.object({
  name: z.string().min(2, "Department name must be at least 2 characters long"),
  code: z.string().min(2, "Department code must be at least 2 characters long"),
  type: z.string().default("service"),
  description: z.string().optional(),
  hodId: z.string().uuid("Invalid HOD ID").optional().nullable(),
  isActive: z.boolean().optional(),
});

// Update non-academic department validation schema
export const updateNonAcademicDepartmentSchema = z.object({
  name: z.string().min(2, "Department name must be at least 2 characters long").optional(),
  code: z.string().min(2, "Department code must be at least 2 characters long").optional(),
  type: z.string().optional(),
  description: z.string().optional(),
  hodId: z.string().uuid("Invalid HOD ID").optional().nullable(),
  isActive: z.boolean().optional(),
});

// Assign HOD validation schema
export const assignHodSchema = z.object({
  hodId: z.string().uuid("Invalid HOD ID"),
});

// Toggle status validation schema
export const toggleStatusSchema = z.object({
  isActive: z.boolean({ required_error: "isActive boolean value is required" }),
});