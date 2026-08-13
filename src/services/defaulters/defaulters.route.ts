import { Router } from 'express';
import {
  createDefaulterController,
  getAllDefaultersController,
  getDefaulterByIdController,
  updateDefaulterController,
  deleteDefaulterController,
  getDefaultersByClearanceRequestIdController,
} from './defaulters.controller';

const router = Router();

router.post('/', createDefaulterController);
router.get('/', getAllDefaultersController);
router.get('/clearance/:clearanceRequestId', getDefaultersByClearanceRequestIdController);
router.get('/:id', getDefaulterByIdController);
router.put('/:id', updateDefaulterController);
router.delete('/:id', deleteDefaulterController);

export default router;
