import { Request, Response } from "express";
import {
  createNonAcademicDepartmentService,
  getAllNonAcademicDepartmentsService,
  getNonAcademicDepartmentByIdService,
  getNonAcademicDepartmentByCodeService,
  getNonAcademicDepartmentsByTypeService,
  updateNonAcademicDepartmentService,
  assignHodToNonAcademicDepartmentService,
  toggleNonAcademicDepartmentStatusService,
  deleteNonAcademicDepartmentService,
} from "./NonAcademicDepartment.service";
import {
  createNonAcademicDepartmentSchema,
  updateNonAcademicDepartmentSchema,
  assignHodSchema,
  toggleStatusSchema,
} from "../../validators/NonAcademicDepartment.validator";

// -----------------------------------------------------------------------------
// 1. CREATE NON-ACADEMIC DEPARTMENT CONTROLLER
// -----------------------------------------------------------------------------
export const createNonAcademicDepartment = async (req: Request, res: Response): Promise<void> => {
  try {
    const validationResult = createNonAcademicDepartmentSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({ error: validationResult.error.errors[0].message });
      return;
    }

    const { name, code, type, description, isActive } = validationResult.data;

    const newDepartment = await createNonAcademicDepartmentService({
      name,
      code,
      type: type || "service",
      description: description || null,
      hodId: null,
      isActive: isActive !== undefined ? isActive : true,
    } as any);

    res.status(201).json({
      message: "Non-academic department created successfully",
      department: newDepartment,
    });
  } catch (error: any) {
    if (error.code === '23505') {
      res.status(400).json({ error: "A non-academic department with this name or code already exists." });
      return;
    }
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// -----------------------------------------------------------------------------
// 2. GET ALL NON-ACADEMIC DEPARTMENTS CONTROLLER
// -----------------------------------------------------------------------------
export const getAllNonAcademicDepartments = async (_req: Request, res: Response): Promise<void> => {
  try {
    const departments = await getAllNonAcademicDepartmentsService();
    if (!departments || departments.length === 0) {
      res.status(404).json({ error: "No non-academic departments found." });
      return;
    }
    res.status(200).json({ departments });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// -----------------------------------------------------------------------------
// 3. GET NON-ACADEMIC DEPARTMENT BY ID CONTROLLER
// -----------------------------------------------------------------------------
export const getNonAcademicDepartmentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const department = await getNonAcademicDepartmentByIdService(id);

    if (!department) {
      res.status(404).json({ error: "Non-academic department with the specified ID was not found." });
      return;
    }

    res.status(200).json({ department });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// -----------------------------------------------------------------------------
// 4. GET NON-ACADEMIC DEPARTMENT BY CODE CONTROLLER
// -----------------------------------------------------------------------------
export const getNonAcademicDepartmentByCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.params;
    const department = await getNonAcademicDepartmentByCodeService(code);

    if (!department) {
      res.status(404).json({ error: "Non-academic department with the specified code was not found." });
      return;
    }

    res.status(200).json({ department });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// -----------------------------------------------------------------------------
// 5. GET DEPARTMENTS BY TYPE CONTROLLER
// -----------------------------------------------------------------------------
export const getNonAcademicDepartmentsByType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type } = req.params;
    const departments = await getNonAcademicDepartmentsByTypeService(type);

    if (!departments || departments.length === 0) {
      res.status(404).json({ error: "No non-academic departments found for the specified type." });
      return;
    }

    res.status(200).json({ departments });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// -----------------------------------------------------------------------------
// 6. UPDATE NON-ACADEMIC DEPARTMENT CONTROLLER
// -----------------------------------------------------------------------------
export const updateNonAcademicDepartment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const validationResult = updateNonAcademicDepartmentSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({ error: validationResult.error.errors[0].message });
      return;
    }

    const updatedDepartment = await updateNonAcademicDepartmentService(id, validationResult.data);

    if (!updatedDepartment) {
      res.status(404).json({ error: "Non-academic department to update was not found." });
      return;
    }

    res.status(200).json({
      message: "Non-academic department updated successfully",
      department: updatedDepartment,
    });
  } catch (error: any) {
    if (error.code === '23505') {
      res.status(400).json({ error: "Update failed: Name or code is already in use by another department." });
      return;
    }
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// -----------------------------------------------------------------------------
// 7. ASSIGN HOD / DIRECTOR TO DEPARTMENT CONTROLLER
// -----------------------------------------------------------------------------
export const assignHodToNonAcademicDepartment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const validationResult = assignHodSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({ error: validationResult.error.errors[0].message });
      return;
    }

    const { hodId } = validationResult.data;

    const updatedDepartment = await assignHodToNonAcademicDepartmentService(id, hodId);

    if (!updatedDepartment) {
      res.status(404).json({ error: "Non-academic department for HOD assignment was not found." });
      return;
    }

    res.status(200).json({
      message: "HOD / Director assigned successfully",
      department: updatedDepartment,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// -----------------------------------------------------------------------------
// 8. TOGGLE DEPARTMENT ACTIVE STATUS CONTROLLER
// -----------------------------------------------------------------------------
export const toggleNonAcademicDepartmentStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const validationResult = toggleStatusSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({ error: validationResult.error.errors[0].message });
      return;
    }

    const { isActive } = validationResult.data;

    const updatedDepartment = await toggleNonAcademicDepartmentStatusService(id, isActive);

    if (!updatedDepartment) {
      res.status(404).json({ error: "Non-academic department for status toggle was not found." });
      return;
    }

    res.status(200).json({
      message: "Department status updated successfully",
      department: updatedDepartment,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// -----------------------------------------------------------------------------
// 9. DELETE NON-ACADEMIC DEPARTMENT CONTROLLER
// -----------------------------------------------------------------------------
export const deleteNonAcademicDepartment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const isDeleted = await deleteNonAcademicDepartmentService(id);

    if (!isDeleted) {
      res.status(404).json({ error: "Non-academic department to delete was not found." });
      return;
    }

    res.status(200).json({ message: "Non-academic department deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};