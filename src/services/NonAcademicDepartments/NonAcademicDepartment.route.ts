import { Router } from "express";
import {
  createNonAcademicDepartment,
  getAllNonAcademicDepartments,
  getNonAcademicDepartmentById,
  getNonAcademicDepartmentByCode,
  getNonAcademicDepartmentsByType,
  updateNonAcademicDepartment,
  assignHodToNonAcademicDepartment,
  toggleNonAcademicDepartmentStatus,
  deleteNonAcademicDepartment,
} from "./NonAcademicDepartment.controller";

const NonAcademicDeptRouter = Router();

// -----------------------------------------------------------------------------
// NON-ACADEMIC DEPARTMENT ROUTES
// -----------------------------------------------------------------------------
NonAcademicDeptRouter.post("/", createNonAcademicDepartment);
NonAcademicDeptRouter.get("/", getAllNonAcademicDepartments);
NonAcademicDeptRouter.get("/:id", getNonAcademicDepartmentById);
NonAcademicDeptRouter.get("/code/:code", getNonAcademicDepartmentByCode);
NonAcademicDeptRouter.get("/type/:type", getNonAcademicDepartmentsByType);
NonAcademicDeptRouter.put("/:id", updateNonAcademicDepartment);
NonAcademicDeptRouter.patch("/:id/hod", assignHodToNonAcademicDepartment);
NonAcademicDeptRouter.patch("/:id/status", toggleNonAcademicDepartmentStatus);
NonAcademicDeptRouter.delete("/:id", deleteNonAcademicDepartment);

export default NonAcademicDeptRouter;