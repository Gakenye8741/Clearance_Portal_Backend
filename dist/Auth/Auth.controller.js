"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfile = exports.verifyConfirmationCode = exports.generateConfirmationCode = exports.updateVerificationStatus = exports.updatePassword = exports.getUserById = exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const Auth_service_1 = require("./Auth.service");
// --------------------------- REGISTER CONTROLLER ---------------------------
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, departmentId, regNumber, phoneNumber, facultyOrSchool, yearOfStudy, acceptTerms } = req.body;
        const existingUser = await (0, Auth_service_1.getUserByEmailService)(email);
        if (existingUser) {
            res.status(400).json({ error: "Email is already in use" });
            return;
        }
        const saltRounds = 10;
        const passwordHash = await bcrypt_1.default.hash(password, saltRounds);
        const newUser = await (0, Auth_service_1.registerUserService)({
            name,
            email,
            passwordHash,
            role: role || "student",
            departmentId,
            regNumber,
            phoneNumber,
            facultyOrSchool,
            yearOfStudy,
            acceptTerms,
            termsAcceptedAt: acceptTerms ? new Date() : null,
        });
        res.status(201).json({ message: "User registered successfully", user: newUser });
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Internal server error" });
    }
};
exports.registerUser = registerUser;
// --------------------------- LOGIN CONTROLLER ---------------------------
const loginUser = async (req, res) => {
    try {
        const { identifier, password } = req.body; // identifier can be email or regNumber
        const user = await (0, Auth_service_1.loginUserService)(identifier);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }
        await (0, Auth_service_1.updateLastLoginService)(user.email);
        // Generate JWT token (Make sure to set JWT_SECRET in your environment variables)
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || "your_default_secret_key", { expiresIn: "1d" });
        res.status(200).json({ message: "Login successful", token, user });
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Internal server error" });
    }
};
exports.loginUser = loginUser;
// --------------------------- GET USER BY ID CONTROLLER ---------------------------
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await (0, Auth_service_1.getUserByIdService)(id);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.status(200).json({ user });
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Internal server error" });
    }
};
exports.getUserById = getUserById;
// --------------------------- UPDATE PASSWORD CONTROLLER ---------------------------
const updatePassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const saltRounds = 10;
        const newPasswordHash = await bcrypt_1.default.hash(newPassword, saltRounds);
        const message = await (0, Auth_service_1.updateUserPasswordService)(email, newPasswordHash);
        res.status(200).json({ message });
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Internal server error" });
    }
};
exports.updatePassword = updatePassword;
// --------------------------- UPDATE VERIFICATION STATUS CONTROLLER ---------------------------
const updateVerificationStatus = async (req, res) => {
    try {
        const { email, status, passwordResetToken, passwordResetExpires } = req.body;
        const message = await (0, Auth_service_1.updateVerificationStatusService)(email, status, passwordResetToken || null, passwordResetExpires ? new Date(passwordResetExpires) : null);
        res.status(200).json({ message });
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Internal server error" });
    }
};
exports.updateVerificationStatus = updateVerificationStatus;
// --------------------------- GENERATE CODE CONTROLLER ---------------------------
const generateConfirmationCode = async (req, res) => {
    try {
        const { email } = req.body;
        const code = await (0, Auth_service_1.generateAndSetNewConfirmationCode)(email);
        res.status(200).json({ message: "Confirmation code generated successfully", code });
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Internal server error" });
    }
};
exports.generateConfirmationCode = generateConfirmationCode;
// --------------------------- VERIFY CODE CONTROLLER ---------------------------
const verifyConfirmationCode = async (req, res) => {
    try {
        const { email, code } = req.body;
        const isValid = await (0, Auth_service_1.verifyConfirmationCodeService)(email, code);
        if (!isValid) {
            res.status(400).json({ error: "Invalid or expired confirmation code" });
            return;
        }
        res.status(200).json({ message: "Confirmation code verified successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Internal server error" });
    }
};
exports.verifyConfirmationCode = verifyConfirmationCode;
// --------------------------- UPDATE PROFILE CONTROLLER ---------------------------
const updateUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const profileData = req.body;
        const updatedUser = await (0, Auth_service_1.updateUserProfileService)(id, profileData);
        res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Internal server error" });
    }
};
exports.updateUserProfile = updateUserProfile;
