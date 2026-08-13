import { Request, Response } from 'express';
import * as service from './ticketMessages.service';

export const createTicketMessageController = async (req: Request, res: Response) => {
  try {
    const msg = await service.createTicketMessage(req.body);
    return res.status(201).json({ success: true, data: msg });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to send message.' });
  }
};

export const getMessagesByTicketIdController = async (req: Request, res: Response) => {
  try {
    const { ticketId } = req.params;
    const msgs = await service.getMessagesByTicketId(ticketId);
    return res.status(200).json({ success: true, data: msgs });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch messages.' });
  }
};

export const deleteMessageController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await service.deleteMessage(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Message not found.' });
    return res.status(200).json({ success: true, data: deleted });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to delete message.' });
  }
};
