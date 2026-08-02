import { Router } from 'express';
import {
  createSchoolController,
  getAllSchoolsController,
  getSchoolByIdController,
  updateSchoolController,
  deleteSchoolController,
  getSchoolByCodeController,
  getActiveSchoolsController,
  searchSchoolsByNameController,
  createDepartmentController,
  getAllDepartmentsController,
  getDepartmentsBySchoolIdController,
  getDepartmentByIdController,
  updateDepartmentController,
  deleteDepartmentController,
  getDepartmentByCodeController,
  getActiveDepartmentsBySchoolIdController,
  searchDepartmentsByNameController,
  getSchoolWithRelationsController,
  getDepartmentWithRelationsController,
  getAllSchoolsWithRelationsController,
  getAllDepartmentsWithRelationsController,
} from './school.controller';

const schoolRouter = Router();

// ==========================================
// SCHOOLS ROUTES
// ==========================================

schoolRouter.post('/', createSchoolController);
schoolRouter.get('/', getAllSchoolsController);
schoolRouter.get('/active', getActiveSchoolsController);
schoolRouter.get('/search', searchSchoolsByNameController);
schoolRouter.get('/code/:code', getSchoolByCodeController);
schoolRouter.get('/with-relations/all', getAllSchoolsWithRelationsController);
schoolRouter.get('/:id', getSchoolByIdController);
schoolRouter.get('/:id/relations', getSchoolWithRelationsController);
schoolRouter.put('/:id', updateSchoolController);
schoolRouter.delete('/:id', deleteSchoolController);

// ==========================================
// SCHOOL DEPARTMENTS ROUTES
// ==========================================

schoolRouter.post('/departments', createDepartmentController);

// Static department routes MUST come before dynamic /departments/:id routes
schoolRouter.get('/departments', getAllDepartmentsController);
schoolRouter.get('/departments/search', searchDepartmentsByNameController);
schoolRouter.get('/departments/code/:code', getDepartmentByCodeController);
schoolRouter.get('/departments/with-relations/all', getAllDepartmentsWithRelationsController);
schoolRouter.get('/departments/school/:schoolId', getDepartmentsBySchoolIdController);
schoolRouter.get('/departments/school/:schoolId/active', getActiveDepartmentsBySchoolIdController);

// Dynamic department routes come after static paths
schoolRouter.get('/departments/:id', getDepartmentByIdController);
schoolRouter.get('/departments/:id/relations', getDepartmentWithRelationsController);

schoolRouter.put('/departments/:id', updateDepartmentController);
schoolRouter.delete('/departments/:id', deleteDepartmentController);

export default schoolRouter;