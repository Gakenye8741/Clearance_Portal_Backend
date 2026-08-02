import { Request, Response } from 'express';
import * as schoolService from './school.service';
import { insertSchoolSchema, updateSchoolSchema, insertSchoolDepartmentSchema, updateSchoolDepartmentSchema } from '../../validators/school.validator';

// ==========================================
// SCHOOLS CONTROLLER
// ==========================================

export const createSchoolController = async (req: Request, res: Response) => {
  try {
    const validatedData = insertSchoolSchema.parse(req.body);
    const newSchool = await schoolService.createSchool(validatedData);
    return res.status(201).json({ 
      success: true, 
      message: 'School created successfully.', 
      data: newSchool 
    });
  } catch (error: any) {
    return res.status(400).json({ 
      success: false, 
      message: error.message || 'Failed to create school. Please check your payload.' 
    });
  }
};

export const getAllSchoolsController = async (_req: Request, res: Response) => {
  try {
    const schools = await schoolService.getAllSchools();
    return res.status(200).json({ 
      success: true, 
      message: 'Schools retrieved successfully.', 
      data: schools 
    });
  } catch (error: any) {
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'An error occurred while retrieving schools.' 
    });
  }
};

export const getSchoolByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const school = await schoolService.getSchoolById(id);
    if (!school) {
      return res.status(404).json({ 
        success: false, 
        message: 'The requested school could not be found with the provided ID.' 
      });
    }
    return res.status(200).json({ 
      success: true, 
      message: 'School retrieved successfully.', 
      data: school 
    });
  } catch (error: any) {
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'An error occurred while retrieving the school.' 
    });
  }
};

export const updateSchoolController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateSchoolSchema.parse(req.body);
    const updatedSchool = await schoolService.updateSchool(id, validatedData);
    if (!updatedSchool) {
      return res.status(404).json({ 
        success: false, 
        message: 'The school you are trying to update does not exist.' 
      });
    }
    return res.status(200).json({ 
      success: true, 
      message: 'School updated successfully.', 
      data: updatedSchool 
    });
  } catch (error: any) {
    return res.status(400).json({ 
      success: false, 
      message: error.message || 'Failed to update school. Please check your payload.' 
    });
  }
};

export const deleteSchoolController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedSchool = await schoolService.deleteSchool(id);
    if (!deletedSchool) {
      return res.status(404).json({ 
        success: false, 
        message: 'The school you are trying to delete does not exist.' 
      });
    }
    return res.status(200).json({ 
      success: true, 
      message: 'School deleted successfully.', 
      data: deletedSchool 
    });
  } catch (error: any) {
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'An error occurred while deleting the school.' 
    });
  }
};

export const getSchoolByCodeController = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const school = await schoolService.getSchoolByCode(code);
    if (!school) {
      return res.status(404).json({ 
        success: false, 
        message: `No school found matching the code: '${code}'.` 
      });
    }
    return res.status(200).json({ 
      success: true, 
      message: 'School retrieved successfully by code.', 
      data: school 
    });
  } catch (error: any) {
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'An error occurred while searching for the school by code.' 
    });
  }
};

export const getActiveSchoolsController = async (_req: Request, res: Response) => {
  try {
    const schools = await schoolService.getActiveSchools();
    return res.status(200).json({ 
      success: true, 
      message: 'Active schools retrieved successfully.', 
      data: schools 
    });
  } catch (error: any) {
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'An error occurred while retrieving active schools.' 
    });
  }
};

export const searchSchoolsByNameController = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ 
        success: false, 
        message: 'Search query parameter "q" is required and must be a string.' 
      });
    }
    const schools = await schoolService.searchSchoolsByName(q);
    return res.status(200).json({ 
      success: true, 
      message: `Schools search completed for query: '${q}'.`, 
      data: schools 
    });
  } catch (error: any) {
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'An error occurred while searching for schools.' 
    });
  }
};

// ==========================================
// SCHOOL DEPARTMENTS CONTROLLER
// ==========================================

export const createDepartmentController = async (req: Request, res: Response) => {
  try {
    const validatedData = insertSchoolDepartmentSchema.parse(req.body);
    const newDepartment = await schoolService.createDepartment(validatedData);
    return res.status(201).json({ 
      success: true, 
      message: 'Department created successfully.', 
      data: newDepartment 
    });
  } catch (error: any) {
    return res.status(400).json({ 
      success: false, 
      message: error.message || 'Failed to create department. Please check your payload.' 
    });
  }
};

export const getAllDepartmentsController = async (_req: Request, res: Response) => {
  try {
    const departments = await schoolService.getAllDepartments();
    return res.status(200).json({ 
      success: true, 
      message: 'All departments retrieved successfully.', 
      data: departments 
    });
  } catch (error: any) {
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'An error occurred while retrieving all departments.' 
    });
  }
};

export const getDepartmentsBySchoolIdController = async (req: Request, res: Response) => {
  try {
    const { schoolId } = req.params;
    const departments = await schoolService.getDepartmentsBySchoolId(schoolId);
    return res.status(200).json({ 
      success: true, 
      message: 'Departments for the specified school retrieved successfully.', 
      data: departments 
    });
  } catch (error: any) {
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'An error occurred while retrieving departments by school ID.' 
    });
  }
};

export const getDepartmentByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const department = await schoolService.getDepartmentById(id);
    if (!department) {
      return res.status(404).json({ 
        success: false, 
        message: 'The requested department could not be found with the provided ID.' 
      });
    }
    return res.status(200).json({ 
      success: true, 
      message: 'Department retrieved successfully.', 
      data: department 
    });
  } catch (error: any) {
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'An error occurred while retrieving the department.' 
    });
  }
};

export const updateDepartmentController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateSchoolDepartmentSchema.parse(req.body);
    const updatedDepartment = await schoolService.updateDepartment(id, validatedData);
    if (!updatedDepartment) {
      return res.status(404).json({ 
        success: false, 
        message: 'The department you are trying to update does not exist.' 
      });
    }
    return res.status(200).json({ 
      success: true, 
      message: 'Department updated successfully.', 
      data: updatedDepartment 
    });
  } catch (error: any) {
    return res.status(400).json({ 
      success: false, 
      message: error.message || 'Failed to update department. Please check your payload.' 
    });
  }
};

export const deleteDepartmentController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedDepartment = await schoolService.deleteDepartment(id);
    if (!deletedDepartment) {
      return res.status(404).json({ 
        success: false, 
        message: 'The department you are trying to delete does not exist.' 
      });
    }
    return res.status(200).json({ 
      success: true, 
      message: 'Department deleted successfully.', 
      data: deletedDepartment 
    });
  } catch (error: any) {
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'An error occurred while deleting the department.' 
    });
  }
};

export const getDepartmentByCodeController = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const department = await schoolService.getDepartmentByCode(code);
    if (!department) {
      return res.status(404).json({ 
        success: false, 
        message: `No department found matching the code: '${code}'.` 
      });
    }
    return res.status(200).json({ 
      success: true, 
      message: 'Department retrieved successfully by code.', 
      data: department 
    });
  } catch (error: any) {
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'An error occurred while searching for the department by code.' 
    });
  }
};

export const getActiveDepartmentsBySchoolIdController = async (req: Request, res: Response) => {
  try {
    const { schoolId } = req.params;
    const departments = await schoolService.getActiveDepartmentsBySchoolId(schoolId);
    return res.status(200).json({ 
      success: true, 
      message: 'Active departments for the specified school retrieved successfully.', 
      data: departments 
    });
  } catch (error: any) {
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'An error occurred while retrieving active departments.' 
    });
  }
};

export const searchDepartmentsByNameController = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ 
        success: false, 
        message: 'Search query parameter "q" is required and must be a string.' 
      });
    }
    const departments = await schoolService.searchDepartmentsByName(q);
    return res.status(200).json({ 
      success: true, 
      message: `Departments search completed for query: '${q}'.`, 
      data: departments 
    });
  } catch (error: any) {
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'An error occurred while searching for departments.' 
    });
  }
};

// ==========================================
// ADVANCED / RELATIONS CONTROLLERS
// ==========================================

export const getSchoolWithRelationsController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const school = await schoolService.getSchoolWithRelations(id);
    if (!school) {
      return res.status(404).json({ 
        success: false, 
        message: 'School with relations could not be found.' 
      });
    }
    return res.status(200).json({ 
      success: true, 
      message: 'School and its related data retrieved successfully.', 
      data: school 
    });
  } catch (error: any) {
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'An error occurred while retrieving school relations.' 
    });
  }
};

export const getDepartmentWithRelationsController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const department = await schoolService.getDepartmentWithRelations(id);
    if (!department) {
      return res.status(404).json({ 
        success: false, 
        message: 'Department with relations could not be found.' 
      });
    }
    return res.status(200).json({ 
      success: true, 
      message: 'Department and its related data retrieved successfully.', 
      data: department 
    });
  } catch (error: any) {
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'An error occurred while retrieving department relations.' 
    });
  }
};

export const getAllSchoolsWithRelationsController = async (_req: Request, res: Response) => {
  try {
    const schools = await schoolService.getAllSchoolsWithRelations();
    return res.status(200).json({ 
      success: true, 
      message: 'All schools with their relations retrieved successfully.', 
      data: schools 
    });
  } catch (error: any) {
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'An error occurred while retrieving all schools with relations.' 
    });
  }
};

export const getAllDepartmentsWithRelationsController = async (_req: Request, res: Response) => {
  try {
    const departments = await schoolService.getAllDepartmentsWithRelations();
    return res.status(200).json({ 
      success: true, 
      message: 'All departments with their relations retrieved successfully.', 
      data: departments 
    });
  } catch (error: any) {
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'An error occurred while retrieving all departments with relations.' 
    });
  }
};