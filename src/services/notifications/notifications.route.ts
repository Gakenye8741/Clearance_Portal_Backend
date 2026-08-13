import { Router } from 'express';
import { createNotificationController, getNotificationsByUserIdController, markAsReadController, deleteNotificationController } from './notifications.controller';

const router = Router();

router.post('/', createNotificationController);
router.get('/user/:userId', getNotificationsByUserIdController);
router.put('/:id/read', markAsReadController);
router.delete('/:id', deleteNotificationController);

export default router;
