import { Router } from "express";
import {
  getUserByIdController,
  getUserByEmailOrRegNumberController,
  getAllUsersController,
  getUsersByRoleController,
  getUsersBydepartmentIdController,
  getUsersByschoolIdController,
  updateUserProfileController,
  updateAdminUserAcademicYearController,
  updateUserRoleController,
  toggleUserActiveStatusController,
  updateVerificationStatusController,
  deleteUserController,
} from "./Users.controller";

const userRouter = Router();

// -----------------------------------------------------------------------------
// USER ROUTES
// -----------------------------------------------------------------------------

// Get all users
userRouter.get("/", getAllUsersController);

// Get user by ID
userRouter.get("/:id", getUserByIdController);

// Get user by email or registration number (e.g. SC/COM/0008/22)
userRouter.get("/identifier/:identifier", getUserByEmailOrRegNumberController);

// Get users by role (student, school_dean, hod, school_administrator)
userRouter.get("/role/:role", getUsersByRoleController);

// Get users by department ID
userRouter.get("/department/:departmentId", getUsersBydepartmentIdController);

// Get users by school ID
userRouter.get("/school/:schoolId", getUsersByschoolIdController);

// Update user profile (strips yearOfStudy to prevent student tampering)
userRouter.patch("/:id", updateUserProfileController);

// Admin route: Update academic year explicitly (handles deferments/promotions)
userRouter.patch("/:id/academic-year", updateAdminUserAcademicYearController);

// Update user role
userRouter.patch("/:id/role", updateUserRoleController);

// Toggle user active status (active/inactive)
userRouter.patch("/:id/status", toggleUserActiveStatusController);

// Update user verification status by email
userRouter.patch("/verification/:email", updateVerificationStatusController);

// Delete user by ID
userRouter.delete("/:id", deleteUserController);

export default userRouter;