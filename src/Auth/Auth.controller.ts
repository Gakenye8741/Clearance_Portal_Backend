import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  registerUserService,
  loginUserService,
  getUserByEmailService,
  getUserByIdService,
  updateUserPasswordService,
  updateVerificationStatusService,
  generateAndSetNewConfirmationCode,
  verifyConfirmationCodeService,
  updateLastLoginService,
  updateUserProfileService,
  updateUserRoleService,
} from "./Auth.service";
import { registerSchema, loginSchema, updateProfileSchema } from "../validators/Auth.validator";

// --------------------------- REGISTER CONTROLLER ---------------------------
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const validationResult = registerSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({ error: validationResult.error.errors[0].message });
      return;
    }

    const { 
      name, 
      email, 
      password, 
      role, 
      departmentId, 
      regNumber, 
      phoneNumber, 
      schoolId, 
      schoolDepartmentId, 
      yearOfStudy, 
      acceptTerms 
    } = validationResult.data;

    const existingUser = await getUserByEmailService(email);
    if (existingUser) {
      res.status(400).json({ error: "Email is already in use" });
      return;
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = await registerUserService({
      name,
      email,
      passwordHash,
      role: role || "student",
      departmentId,
      regNumber,
      phoneNumber,
      schoolId,
      schoolDepartmentId,
      yearOfStudy,
      acceptTerms,
      termsAcceptedAt: acceptTerms ? new Date() : null,
    });

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// --------------------------- LOGIN CONTROLLER ---------------------------
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const validationResult = loginSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({ error: validationResult.error.errors[0].message });
      return;
    }

    const { identifier, password } = validationResult.data;

    const user = await loginUserService(identifier);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    await updateLastLoginService(user.email);

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your_default_secret_key",
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        regNumber: user.regNumber,
        year: user.yearOfStudy,
        schoolId: user.schoolId,
        schoolDepartmentId: user.schoolDepartmentId,
        workDepartmentId: user.departmentId
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// --------------------------- GET USER BY ID CONTROLLER ---------------------------
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await getUserByIdService(id);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ user });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// --------------------------- UPDATE PASSWORD CONTROLLER ---------------------------
export const updatePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      res.status(400).json({ error: "Email and new password are required" });
      return;
    }

    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    const message = await updateUserPasswordService(email, newPasswordHash);
    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// --------------------------- UPDATE VERIFICATION STATUS CONTROLLER ---------------------------
export const updateVerificationStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, status, passwordResetToken, passwordResetExpires } = req.body;

    const message = await updateVerificationStatusService(
      email,
      status,
      passwordResetToken || null,
      passwordResetExpires ? new Date(passwordResetExpires) : null
    );

    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// --------------------------- GENERATE CODE CONTROLLER ---------------------------
export const generateConfirmationCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: "Email is required" });
      return;
    }

    const code = await generateAndSetNewConfirmationCode(email);

    res.status(200).json({ message: "Confirmation code generated successfully", code });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// --------------------------- VERIFY CODE CONTROLLER ---------------------------
export const verifyConfirmationCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      res.status(400).json({ error: "Email and code are required" });
      return;
    }

    const isValid = await verifyConfirmationCodeService(email, code);

    if (!isValid) {
      res.status(400).json({ error: "Invalid or expired confirmation code" });
      return;
    }

    res.status(200).json({ message: "Confirmation code verified successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// --------------------------- UPDATE PROFILE CONTROLLER ---------------------------
export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const validationResult = updateProfileSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({ error: validationResult.error.errors[0].message });
      return;
    }

    const updatedUser = await updateUserProfileService(id, validationResult.data);
    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// --------------------------- UPDATE USER ROLE CONTROLLER ---------------------------
export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role) {
      res.status(400).json({ error: "New role is required" });
      return;
    }

    const updatedUser = await updateUserRoleService(id, role);
    res.status(200).json({ message: "User role updated successfully", user: updatedUser });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};