import { z } from "zod";

// Role enum matching the database schema
export const userRoleEnumSchema = z.enum([
  "student",
  "school_dean",
  "hod",
  "school_administrator",
]);

// -----------------------------------------------------------------------------
// 1. UPDATE USER PROFILE VALIDATOR (Strips yearOfStudy to prevent student tampering)
// -----------------------------------------------------------------------------
export const updateUserProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long").optional(),
  phoneNumber: z.string().optional(),
  profilePictureUrl: z.string().url("Invalid profile picture URL").optional(),
  departmentId: z.string().uuid("Invalid department ID").optional(),
  schoolId: z.string().uuid("Invalid school ID").optional(),
  schoolDepartmentId: z.string().uuid("Invalid school department ID").optional(),
  // Explicitly omitting yearOfStudy here so students cannot modify it via profile updates
});

// -----------------------------------------------------------------------------
// 2. ADMIN: UPDATE ACADEMIC YEAR VALIDATOR (For admins handling deferments/promotions)
// -----------------------------------------------------------------------------
export const updateAcademicYearSchema = z.object({
  yearOfStudy: z
    .number()
    .int("Year of study must be an integer")
    .min(1, "Year of study must be at least 1")
    .max(6, "Year of study cannot exceed 6"),
});

// -----------------------------------------------------------------------------
// 3. UPDATE USER ROLE VALIDATOR
// -----------------------------------------------------------------------------
export const updateUserRoleSchema = z.object({
  role: userRoleEnumSchema,
});

// -----------------------------------------------------------------------------
// 4. TOGGLE ACTIVE STATUS VALIDATOR
// -----------------------------------------------------------------------------
export const toggleUserActiveStatusSchema = z.object({
  isActive: z.boolean({
    required_error: "isActive status is required",
    invalid_type_error: "isActive must be a boolean",
  }),
});

// -----------------------------------------------------------------------------
// 5. UPDATE PASSWORD VALIDATOR
// -----------------------------------------------------------------------------
export const updateUserPasswordSchema = z.object({
  currentPassword: z.string().min(6, "Password must be at least 6 characters long"),
  newPassword: z.string().min(6, "Password must be at least 6 characters long"),
});

// -----------------------------------------------------------------------------
// 6. VERIFICATION STATUS VALIDATOR
// -----------------------------------------------------------------------------
export const updateVerificationStatusSchema = z.object({
  isVerified: z.boolean({
    required_error: "Verification status is required",
    invalid_type_error: "isVerified must be a boolean",
  }),
});