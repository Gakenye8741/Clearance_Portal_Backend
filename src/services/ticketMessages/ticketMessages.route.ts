import { Router } from 'express';
import { createTicketMessageController, getMessagesByTicketIdController, deleteMessageController } from './ticketMessages.controller';

const router = Router();

router.post('/', createTicketMessageController);
router.get('/ticket/:ticketId', getMessagesByTicketIdController);
router.delete('/:id', deleteMessageController);

export default router;
