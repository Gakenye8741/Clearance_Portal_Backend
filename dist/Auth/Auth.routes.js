"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Auth_controller_1 = require("./Auth.controller");
const AuthRouter = (0, express_1.Router)();
// --------------------------- USER AUTH & MANAGEMENT ROUTES ---------------------------
AuthRouter.post("/register", Auth_controller_1.registerUser);
AuthRouter.post("/login", Auth_controller_1.loginUser);
AuthRouter.get("/:id", Auth_controller_1.getUserById);
AuthRouter.put("/password", Auth_controller_1.updatePassword);
AuthRouter.put("/verification", Auth_controller_1.updateVerificationStatus);
AuthRouter.post("/confirmation-code/generate", Auth_controller_1.generateConfirmationCode);
AuthRouter.post("/confirmation-code/verify", Auth_controller_1.verifyConfirmationCode);
AuthRouter.put("/profile/:id", Auth_controller_1.updateUserProfile);
exports.default = AuthRouter;
