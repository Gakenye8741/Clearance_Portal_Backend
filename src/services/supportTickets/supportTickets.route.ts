import { Router } from 'express';
import {
  createSupportTicketController,
  getAllSupportTicketsController,
  getSupportTicketByIdController,
  updateSupportTicketController,
  deleteSupportTicketController,
  getTicketsByStudentIdController,
  getTicketsByDepartmentIdController,
} from './supportTickets.controller';

const router = Router();

router.post('/', createSupportTicketController);
router.get('/', getAllSupportTicketsController);
router.get('/student/:studentId', getTicketsByStudentIdController);
router.get('/department/:departmentId', getTicketsByDepartmentIdController);
router.get('/:id', getSupportTicketByIdController);
router.put('/:id', updateSupportTicketController);
router.delete('/:id', deleteSupportTicketController);

export default router;
