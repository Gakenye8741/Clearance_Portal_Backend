import { eq, or } from "drizzle-orm";
import { TInsertUsers, TSelectUsers, users } from "../../drizzle/schema";
import db from "../../drizzle/db";

// -----------------------------------------------------------------------------
// 1. GET USER BY ID SERVICE
// -----------------------------------------------------------------------------
export const getUserByIdService = async (id: string): Promise<TSelectUsers | undefined> => {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return user || undefined;
};

// -----------------------------------------------------------------------------
// 2. GET USER BY EMAIL OR REG NUMBER SERVICE
// -----------------------------------------------------------------------------
export const getUserByEmailOrRegNumberService = async (identifier: string): Promise<TSelectUsers | undefined> => {
  const [user] = await db
    .select()
    .from(users)
    .where(or(eq(users.email, identifier), eq(users.regNumber, identifier)))
    .limit(1);
  return user || undefined;
};

// -----------------------------------------------------------------------------
// 3. GET USER BY EMAIL SERVICE
// -----------------------------------------------------------------------------
export const getUserByEmailService = async (email: string): Promise<TSelectUsers | undefined> => {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return user || undefined;
};

// -----------------------------------------------------------------------------
// 4. GET ALL USERS SERVICE
// -----------------------------------------------------------------------------
export const getAllUsersService = async (): Promise<TSelectUsers[]> => {
  return await db.select().from(users);
};

// -----------------------------------------------------------------------------
// 5. GET USERS BY ROLE SERVICE
// -----------------------------------------------------------------------------
export const getUsersByRoleService = async (
  role: "student" | "school_dean" | "hod" | "school_administrator"
): Promise<TSelectUsers[]> => {
  return await db.select().from(users).where(eq(users.role, role));
};

// -----------------------------------------------------------------------------
// 6. GET USERS BY DEPARTMENT SERVICE
// -----------------------------------------------------------------------------
export const getUsersBydepartmentIdService = async (departmentId: string): Promise<TSelectUsers[]> => {
  return await db.select().from(users).where(eq(users.departmentId, departmentId));
};

// -----------------------------------------------------------------------------
// 7. GET USERS BY SCHOOL SERVICE
// -----------------------------------------------------------------------------
export const getUsersByschoolIdService = async (schoolId: string): Promise<TSelectUsers[]> => {
  return await db.select().from(users).where(eq(users.schoolId, schoolId));
};

// -----------------------------------------------------------------------------
// 8. UPDATE USER PASSWORD SERVICE
// -----------------------------------------------------------------------------
export const updateUserPasswordService = async (email: string, newPasswordHash: string): Promise<TSelectUsers | undefined> => {
  const [updatedUser] = await db
    .update(users)
    .set({
      passwordHash: newPasswordHash,
      updatedAt: new Date(),
    })
    .where(eq(users.email, email))
    .returning();
  return updatedUser || undefined;
};

// -----------------------------------------------------------------------------
// 9. UPDATE USER VERIFICATION STATUS SERVICE
// -----------------------------------------------------------------------------
export const updateVerificationStatusService = async (email: string, status: boolean): Promise<TSelectUsers | undefined> => {
  const [updatedUser] = await db
    .update(users)
    .set({
      isVerified: status,
      updatedAt: new Date(),
    })
    .where(eq(users.email, email))
    .returning();
  return updatedUser || undefined;
};

// -----------------------------------------------------------------------------
// 10. UPDATE USER PROFILE SERVICE (Strips yearOfStudy to prevent student tampering)
// -----------------------------------------------------------------------------
export const updateUserProfileService = async (
  id: string,
  profileData: Partial<TInsertUsers>
): Promise<TSelectUsers | undefined> => {
  // Security protection: Students cannot change their own yearOfStudy via profile updates.
  // yearOfStudy is strictly governed by administrators.
  const { yearOfStudy, ...safeProfileData } = profileData;

  const [updatedUser] = await db
    .update(users)
    .set({
      ...safeProfileData,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning();
  return updatedUser || undefined;
};

// -----------------------------------------------------------------------------
// 11. ADMIN: UPDATE USER ACADEMIC YEAR SERVICE (Handles deferments/promotions)
// -----------------------------------------------------------------------------
export const updateAdminUserAcademicYearService = async (
  id: string,
  yearOfStudy: number
): Promise<TSelectUsers | undefined> => {
  const [updatedUser] = await db
    .update(users)
    .set({
      yearOfStudy,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning();
  return updatedUser || undefined;
};

// -----------------------------------------------------------------------------
// 12. UPDATE USER ROLE SERVICE
// -----------------------------------------------------------------------------
export const updateUserRoleService = async (
  id: string,
  newRole: "student" | "school_dean" | "hod" | "school_administrator"
): Promise<TSelectUsers | undefined> => {
  const [updatedUser] = await db
    .update(users)
    .set({
      role: newRole,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning();
  return updatedUser || undefined;
};

// -----------------------------------------------------------------------------
// 13. TOGGLE USER ACTIVE STATUS SERVICE
// -----------------------------------------------------------------------------
export const toggleUserActiveStatusService = async (id: string, isActive: boolean): Promise<TSelectUsers | undefined> => {
  const [updatedUser] = await db
    .update(users)
    .set({
      isActive,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning();
  return updatedUser || undefined;
};

// -----------------------------------------------------------------------------
// 14. UPDATE LAST LOGIN TIMESTAMP SERVICE
// -----------------------------------------------------------------------------
export const updateLastLoginService = async (id: string): Promise<TSelectUsers | undefined> => {
  const [updatedUser] = await db
    .update(users)
    .set({
      lastLoginAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning();
  return updatedUser || undefined;
};

// -----------------------------------------------------------------------------
// 15. DELETE USER SERVICE
// -----------------------------------------------------------------------------
export const deleteUserService = async (id: string): Promise<boolean> => {
  const result = await db.delete(users).where(eq(users.id, id)).returning();
  
  const resultRows = Array.isArray(result)
    ? result
    : ((result as any).rows as TSelectUsers[]);

  const deletedUser = resultRows[0];
  return !!deletedUser;
};