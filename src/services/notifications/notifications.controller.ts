import { Request, Response } from 'express';
import * as service from './notifications.service';

export const createNotificationController = async (req: Request, res: Response) => {
  try {
    const n = await service.createNotification(req.body);
    return res.status(201).json({ success: true, data: n });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to create notification.' });
  }
};

export const getNotificationsByUserIdController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const items = await service.getNotificationsByUserId(userId);
    return res.status(200).json({ success: true, data: items });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch notifications.' });
  }
};

export const markAsReadController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await service.markAsRead(id);
    if (!updated) return res.status(404).json({ success: false, message: 'Notification not found.' });
    return res.status(200).json({ success: true, data: updated });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to update notification.' });
  }
};

export const deleteNotificationController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await service.deleteNotification(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Notification not found.' });
    return res.status(200).json({ success: true, data: deleted });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to delete notification.' });
  }
};
