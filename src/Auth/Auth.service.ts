import { eq, or } from "drizzle-orm";
import db from "../drizzle/db";
import { users, TInsertUsers, TSelectUsers } from "../drizzle/schema"; // Adjust path to your schema

// --------------------------- REGISTER USER ---------------------------
export const registerUserService = async (user: TInsertUsers): Promise<TSelectUsers> => {
  const result = await db.insert(users).values(user).returning();

  const resultRows = Array.isArray(result)
    ? result
    : ((result as any).rows as TSelectUsers[]);

  const newUser = resultRows[0];

  if (!newUser) throw new Error("Failed to create user");
  return newUser;
};

// --------------------------- LOGIN USER (BY EMAIL OR REG NUMBER) ---------------------------
export const loginUserService = async (identifier: string): Promise<TSelectUsers | undefined> => {
  return await db.query.users.findFirst({
    where: or(eq(users.email, identifier), eq(users.regNumber, identifier)),
  });
};

// --------------------------- GET USER BY EMAIL ---------------------------
export const getUserByEmailService = async (email: string): Promise<TSelectUsers | undefined> => {
  return await db.query.users.findFirst({
    where: eq(users.email, email),
  });
};

// --------------------------- GET USER BY ID ---------------------------
export const getUserByIdService = async (id: string): Promise<TSelectUsers | undefined> => {
  return await db.query.users.findFirst({
    where: eq(users.id, id),
  });
};

// --------------------------- UPDATE USER PASSWORD ---------------------------
export const updateUserPasswordService = async (email: string, newPasswordHash: string): Promise<string> => {
  const result = await db
    .update(users)
    .set({ passwordHash: newPasswordHash, updatedAt: new Date() })
    .where(eq(users.email, email))
    .returning();

  if (result.length === 0) throw new Error("User not found or password update failed");
  return "Password updated successfully";
};

// --------------------------- UPDATE EMAIL VERIFICATION STATUS ---------------------------
export const updateVerificationStatusService = async (
  email: string,
  status: boolean,
  passwordResetToken: string | null = null,
  passwordResetExpires: Date | null = null
): Promise<string> => {
  const result = await db
    .update(users)
    .set({
      isVerified: status,
      passwordResetToken,
      passwordResetExpires,
      updatedAt: new Date(),
    })
    .where(eq(users.email, email))
    .returning();

  if (result.length === 0) throw new Error("User not found or verification status update failed");
  return "Verification status updated successfully";
};

// --------------------------- GENERATE AND UPDATE NEW PASSWORD RESET TOKEN / CODE ---------------------------
export const generateAndSetNewConfirmationCode = async (email: string): Promise<string> => {
  // Generate 6-digit numeric code stored as text in passwordResetToken
  const newCode = Math.floor(100000 + Math.random() * 900000).toString();

  const result = await db
    .update(users)
    .set({ 
      passwordResetToken: newCode,
      passwordResetExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 min expiry
      updatedAt: new Date(),
    })
    .where(eq(users.email, email))
    .returning();

  if (result.length === 0) throw new Error("User not found or failed to set new confirmation code");
  return newCode;
};

// --------------------------- VERIFY CONFIRMATION CODE ---------------------------
export const verifyConfirmationCodeService = async (email: string, code: string): Promise<boolean> => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) throw new Error("User not found");

  if (user.passwordResetToken !== code) return false;

  if (user.passwordResetExpires && new Date() > new Date(user.passwordResetExpires)) {
    return false; // Code expired
  }

  return true;
};

// --------------------------- UPDATE LAST LOGIN TIMESTAMP ---------------------------
export const updateLastLoginService = async (email: string): Promise<string> => {
  const result = await db
    .update(users)
    .set({ 
      lastLoginAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(users.email, email))
    .returning();

  if (result.length === 0) throw new Error("User not found or last login update failed");
  return "Last login updated successfully";
};

// --------------------------- UPDATE USER PROFILE AFTER FIRST LOGIN ---------------------------
export const updateUserProfileService = async (
  id: string,
  profileData: Partial<TInsertUsers>
): Promise<TSelectUsers> => {
  const result = await db
    .update(users)
    .set({
      ...profileData,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning();

  const resultRows = Array.isArray(result)
    ? result
    : ((result as any).rows as TSelectUsers[]);

  const updatedUser = resultRows[0];

  if (!updatedUser) throw new Error("User not found or profile update failed");
  return updatedUser;
};

// --------------------------- UPDATE USER ROLE (ADMIN SERVICE) ---------------------------
export const updateUserRoleService = async (
  id: string,
  newRole: "student" | "school_dean" | "hod" | "school_administrator" 
): Promise<TSelectUsers> => {
  const result = await db
    .update(users)
    .set({
      role: newRole,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning();

  const resultRows = Array.isArray(result)
    ? result
    : ((result as any).rows as TSelectUsers[]);

  const updatedUser = resultRows[0];

  if (!updatedUser) throw new Error("User not found or role update failed");
  return updatedUser;
};