import { Router } from 'express';
import {
  createAnnouncementController,
  getAllAnnouncementsController,
  getAnnouncementByIdController,
  updateAnnouncementController,
  deleteAnnouncementController,
  searchAnnouncementsController,
} from './announcements.controller';

const router = Router();

router.post('/', createAnnouncementController);
router.get('/', getAllAnnouncementsController);
router.get('/search', searchAnnouncementsController);
router.get('/:id', getAnnouncementByIdController);
router.put('/:id', updateAnnouncementController);
router.delete('/:id', deleteAnnouncementController);

export default router;
