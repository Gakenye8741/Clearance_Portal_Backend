"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfileService = exports.updateLastLoginService = exports.verifyConfirmationCodeService = exports.generateAndSetNewConfirmationCode = exports.updateVerificationStatusService = exports.updateUserPasswordService = exports.getUserByIdService = exports.getUserByEmailService = exports.loginUserService = exports.registerUserService = void 0;
const db_1 = __importDefault(require("../drizzle/db"));
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../drizzle/schema");
// --------------------------- REGISTER USER ---------------------------
const registerUserService = async (user) => {
    const [newUser] = await db_1.default.insert(schema_1.users).values(user).returning();
    if (!newUser)
        throw new Error("Failed to create user");
    return newUser;
};
exports.registerUserService = registerUserService;
// --------------------------- LOGIN USER (BY EMAIL OR REG NUMBER) ---------------------------
const loginUserService = async (identifier) => {
    return await db_1.default.query.users.findFirst({
        where: (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.users.email, identifier), (0, drizzle_orm_1.eq)(schema_1.users.regNumber, identifier)),
    });
};
exports.loginUserService = loginUserService;
// --------------------------- GET USER BY EMAIL ---------------------------
const getUserByEmailService = async (email) => {
    return await db_1.default.query.users.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.users.email, email),
    });
};
exports.getUserByEmailService = getUserByEmailService;
// --------------------------- GET USER BY ID ---------------------------
const getUserByIdService = async (id) => {
    return await db_1.default.query.users.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.users.id, id),
    });
};
exports.getUserByIdService = getUserByIdService;
// --------------------------- UPDATE USER PASSWORD ---------------------------
const updateUserPasswordService = async (email, newPasswordHash) => {
    const result = await db_1.default
        .update(schema_1.users)
        .set({ passwordHash: newPasswordHash, updatedAt: new Date() })
        .where((0, drizzle_orm_1.eq)(schema_1.users.email, email))
        .returning();
    if (result.length === 0)
        throw new Error("User not found or password update failed");
    return "Password updated successfully";
};
exports.updateUserPasswordService = updateUserPasswordService;
// --------------------------- UPDATE EMAIL VERIFICATION STATUS ---------------------------
const updateVerificationStatusService = async (email, status, passwordResetToken = null, passwordResetExpires = null) => {
    const result = await db_1.default
        .update(schema_1.users)
        .set({
        isVerified: status,
        passwordResetToken,
        passwordResetExpires,
        updatedAt: new Date(),
    })
        .where((0, drizzle_orm_1.eq)(schema_1.users.email, email))
        .returning();
    if (result.length === 0)
        throw new Error("User not found or verification status update failed");
    return "Verification status updated successfully";
};
exports.updateVerificationStatusService = updateVerificationStatusService;
// --------------------------- GENERATE AND UPDATE NEW PASSWORD RESET TOKEN / CODE ---------------------------
const generateAndSetNewConfirmationCode = async (email) => {
    // Generate 6-digit numeric code stored as text in passwordResetToken
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    const result = await db_1.default
        .update(schema_1.users)
        .set({
        passwordResetToken: newCode,
        passwordResetExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 min expiry
        updatedAt: new Date(),
    })
        .where((0, drizzle_orm_1.eq)(schema_1.users.email, email))
        .returning();
    if (result.length === 0)
        throw new Error("User not found or failed to set new confirmation code");
    return newCode;
};
exports.generateAndSetNewConfirmationCode = generateAndSetNewConfirmationCode;
// --------------------------- VERIFY CONFIRMATION CODE ---------------------------
const verifyConfirmationCodeService = async (email, code) => {
    const user = await db_1.default.query.users.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.users.email, email),
    });
    if (!user)
        throw new Error("User not found");
    if (user.passwordResetToken !== code)
        return false;
    if (user.passwordResetExpires && new Date() > new Date(user.passwordResetExpires)) {
        return false; // Code expired
    }
    return true;
};
exports.verifyConfirmationCodeService = verifyConfirmationCodeService;
// --------------------------- UPDATE LAST LOGIN TIMESTAMP ---------------------------
const updateLastLoginService = async (email) => {
    const result = await db_1.default
        .update(schema_1.users)
        .set({
        lastLoginAt: new Date(),
        updatedAt: new Date(),
    })
        .where((0, drizzle_orm_1.eq)(schema_1.users.email, email))
        .returning();
    if (result.length === 0)
        throw new Error("User not found or last login update failed");
    return "Last login updated successfully";
};
exports.updateLastLoginService = updateLastLoginService;
// --------------------------- UPDATE USER PROFILE AFTER FIRST LOGIN ---------------------------
const updateUserProfileService = async (id, profileData) => {
    const [updatedUser] = await db_1.default
        .update(schema_1.users)
        .set({
        ...profileData,
        updatedAt: new Date(),
    })
        .where((0, drizzle_orm_1.eq)(schema_1.users.id, id))
        .returning();
    if (!updatedUser)
        throw new Error("User not found or profile update failed");
    return updatedUser;
};
exports.updateUserProfileService = updateUserProfileService;
