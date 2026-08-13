import { Request, Response } from 'express';
import * as service from './defaulters.service';

export const createDefaulterController = async (req: Request, res: Response) => {
  try {
    const d = await service.createDefaulter(req.body);
    return res.status(201).json({ success: true, data: d });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to create defaulter.' });
  }
};

export const getAllDefaultersController = async (_req: Request, res: Response) => {
  try {
    const items = await service.getAllDefaulters();
    return res.status(200).json({ success: true, data: items });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch defaulters.' });
  }
};

export const getDefaulterByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await service.getDefaulterById(id);
    if (!item) return res.status(404).json({ success: false, message: 'Not found.' });
    return res.status(200).json({ success: true, data: item });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch.' });
  }
};

export const updateDefaulterController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await service.updateDefaulter(id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Not found.' });
    return res.status(200).json({ success: true, data: updated });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to update.' });
  }
};

export const deleteDefaulterController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await service.deleteDefaulter(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Not found.' });
    return res.status(200).json({ success: true, data: deleted });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to delete.' });
  }
};

export const getDefaultersByClearanceRequestIdController = async (req: Request, res: Response) => {
  try {
    const { clearanceRequestId } = req.params;
    const items = await service.getDefaultersByClearanceRequestId(clearanceRequestId);
    return res.status(200).json({ success: true, data: items });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch.' });
  }
};
