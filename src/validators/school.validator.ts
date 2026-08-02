import { z } from 'zod';

// ==========================================
// SCHOOLS VALIDATORS (Zod Schemas)
// ==========================================

export const insertSchoolSchema = z.object({
  name: z.string().min(2, { message: 'School name must be at least 2 characters long' }),
  code: z.string().min(2, { message: 'School code must be at least 2 characters long' }),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const updateSchoolSchema = insertSchoolSchema.partial();

export type InsertSchoolInput = z.infer<typeof insertSchoolSchema>;
export type UpdateSchoolInput = z.infer<typeof updateSchoolSchema>;

// ==========================================
// SCHOOL DEPARTMENTS VALIDATORS (Zod Schemas)
// ==========================================

export const insertSchoolDepartmentSchema = z.object({
  schoolId: z.string().uuid({ message: 'Invalid school ID format' }),
  name: z.string().min(2, { message: 'Department name must be at least 2 characters long' }),
  code: z.string().min(2, { message: 'Department code must be at least 2 characters long' }),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const updateSchoolDepartmentSchema = insertSchoolDepartmentSchema.partial();

export type InsertSchoolDepartmentInput = z.infer<typeof insertSchoolDepartmentSchema>;
export type UpdateSchoolDepartmentInput = z.infer<typeof updateSchoolDepartmentSchema>;