import { Request, Response } from 'express';
import * as announcementsService from './announcements.service';

export const createAnnouncementController = async (req: Request, res: Response) => {
  try {
    const newAnnouncement = await announcementsService.createAnnouncement(req.body);
    return res.status(201).json({ success: true, message: 'Announcement created.', data: newAnnouncement });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to create announcement.' });
  }
};

export const getAllAnnouncementsController = async (_req: Request, res: Response) => {
  try {
    const items = await announcementsService.getAllAnnouncements();
    return res.status(200).json({ success: true, data: items });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch announcements.' });
  }
};

export const getAnnouncementByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await announcementsService.getAnnouncementById(id);
    if (!item) return res.status(404).json({ success: false, message: 'Announcement not found.' });
    return res.status(200).json({ success: true, data: item });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch announcement.' });
  }
};

export const updateAnnouncementController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await announcementsService.updateAnnouncement(id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Announcement not found.' });
    return res.status(200).json({ success: true, message: 'Updated.', data: updated });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to update announcement.' });
  }
};

export const deleteAnnouncementController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await announcementsService.deleteAnnouncement(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Announcement not found.' });
    return res.status(200).json({ success: true, message: 'Deleted.', data: deleted });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to delete announcement.' });
  }
};

export const searchAnnouncementsController = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') return res.status(400).json({ success: false, message: 'Query parameter q is required.' });
    const results = await announcementsService.searchAnnouncementsByTitle(q);
    return res.status(200).json({ success: true, data: results });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Search failed.' });
  }
};
