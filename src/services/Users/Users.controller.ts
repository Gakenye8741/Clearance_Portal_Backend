import { Request, Response } from "express";
import {
  getUserByIdService,
  getUserByEmailOrRegNumberService,
  getUserByEmailService,
  getAllUsersService,
  getUsersByRoleService,
  getUsersBydepartmentIdService,
  getUsersByschoolIdService,
  updateUserPasswordService,
  updateVerificationStatusService,
  updateUserProfileService,
  updateAdminUserAcademicYearService,
  updateUserRoleService,
  toggleUserActiveStatusService,
  deleteUserService,
} from "./Users.service";

// -----------------------------------------------------------------------------
// 1. GET USER BY ID CONTROLLER
// -----------------------------------------------------------------------------
export const getUserByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await getUserByIdService(id);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ status: "success", data: user });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// -----------------------------------------------------------------------------
// 2. GET USER BY EMAIL OR REG NUMBER CONTROLLER
// -----------------------------------------------------------------------------
export const getUserByEmailOrRegNumberController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier } = req.params;
    const user = await getUserByEmailOrRegNumberService(identifier);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ status: "success", data: user });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// -----------------------------------------------------------------------------
// 3. GET ALL USERS CONTROLLER
// -----------------------------------------------------------------------------
export const getAllUsersController = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await getAllUsersService();
    res.status(200).json({ status: "success", results: users.length, data: users });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// -----------------------------------------------------------------------------
// 4. GET USERS BY ROLE CONTROLLER
// -----------------------------------------------------------------------------
export const getUsersByRoleController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role } = req.params as { role: "student" | "school_dean" | "hod" | "school_administrator" };
    const users = await getUsersByRoleService(role);
    res.status(200).json({ status: "success", results: users.length, data: users });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// -----------------------------------------------------------------------------
// 5. GET USERS BY DEPARTMENT CONTROLLER
// -----------------------------------------------------------------------------
export const getUsersBydepartmentIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { departmentId } = req.params;
    const users = await getUsersBydepartmentIdService(departmentId);
    res.status(200).json({ status: "success", results: users.length, data: users });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// -----------------------------------------------------------------------------
// 6. GET USERS BY SCHOOL CONTROLLER
// -----------------------------------------------------------------------------
export const getUsersByschoolIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { schoolId } = req.params;
    const users = await getUsersByschoolIdService(schoolId);
    res.status(200).json({ status: "success", results: users.length, data: users });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// -----------------------------------------------------------------------------
// 7. UPDATE USER PROFILE CONTROLLER (Secured: Strips student yearOfStudy attempts)
// -----------------------------------------------------------------------------
export const updateUserProfileController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Optional extra security check if request contains user session data:
    // If regular student, ensure they are only updating their own profile
    const updatedUser = await updateUserProfileService(id, req.body);

    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({
      message: "Profile updated successfully",
      status: "success",
      data: updatedUser,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// -----------------------------------------------------------------------------
// 8. ADMIN: UPDATE USER ACADEMIC YEAR CONTROLLER (For deferments/promotions)
// -----------------------------------------------------------------------------
export const updateAdminUserAcademicYearController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { yearOfStudy } = req.body;

    if (typeof yearOfStudy !== "number") {
      res.status(400).json({ error: "Valid yearOfStudy number is required" });
      return;
    }

    const updatedUser = await updateAdminUserAcademicYearService(id, yearOfStudy);

    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({
      message: "Academic year updated successfully by admin",
      status: "success",
      data: updatedUser,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// -----------------------------------------------------------------------------
// 9. UPDATE USER ROLE CONTROLLER
// -----------------------------------------------------------------------------
export const updateUserRoleController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const updatedUser = await updateUserRoleService(id, role);

    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({
      message: "User role updated successfully",
      status: "success",
      data: updatedUser,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// -----------------------------------------------------------------------------
// 10. TOGGLE USER ACTIVE STATUS CONTROLLER
// -----------------------------------------------------------------------------
export const toggleUserActiveStatusController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      res.status(400).json({ error: "isActive boolean value is required" });
      return;
    }

    const updatedUser = await toggleUserActiveStatusService(id, isActive);

    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({
      message: `User status updated to ${isActive ? "Active" : "Inactive"}`,
      status: "success",
      data: updatedUser,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// -----------------------------------------------------------------------------
// 11. UPDATE USER VERIFICATION STATUS CONTROLLER
// -----------------------------------------------------------------------------
export const updateVerificationStatusController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.params;
    const { status } = req.body;

    if (typeof status !== "boolean") {
      res.status(400).json({ error: "Verification status boolean is required" });
      return;
    }

    const updatedUser = await updateVerificationStatusService(email, status);

    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({
      message: "Verification status updated successfully",
      status: "success",
      data: updatedUser,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// -----------------------------------------------------------------------------
// 12. DELETE USER CONTROLLER
// -----------------------------------------------------------------------------
export const deleteUserController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const isDeleted = await deleteUserService(id);

    if (!isDeleted) {
      res.status(404).json({ error: "User not found or already deleted" });
      return;
    }

    res.status(200).json({
      message: "User deleted successfully",
      status: "success",
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};