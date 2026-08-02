import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUserById,
  updatePassword,
  updateVerificationStatus,
  generateConfirmationCode,
  verifyConfirmationCode,
  updateUserProfile,
  updateUserRole,
} from "./Auth.controller";

const AuthRouter = Router();

// --------------------------- USER AUTH & MANAGEMENT ROUTES ---------------------------
AuthRouter.post("/register", registerUser);
AuthRouter.post("/login", loginUser);
AuthRouter.get("/:id", getUserById);
AuthRouter.put("/password", updatePassword);
AuthRouter.put("/verification", updateVerificationStatus);
AuthRouter.post("/confirmation-code/generate", generateConfirmationCode);
AuthRouter.post("/confirmation-code/verify", verifyConfirmationCode);
AuthRouter.put("/profile/:id", updateUserProfile);
AuthRouter.patch("/role/:id", updateUserRole);

export default AuthRouter;