import { Request, Response } from 'express';
import * as service from './supportTickets.service';

export const createSupportTicketController = async (req: Request, res: Response) => {
  try {
    const ticket = await service.createSupportTicket(req.body);
    return res.status(201).json({ success: true, data: ticket });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to create ticket.' });
  }
};

export const getAllSupportTicketsController = async (_req: Request, res: Response) => {
  try {
    const items = await service.getAllSupportTickets();
    return res.status(200).json({ success: true, data: items });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch tickets.' });
  }
};

export const getSupportTicketByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await service.getSupportTicketById(id);
    if (!item) return res.status(404).json({ success: false, message: 'Ticket not found.' });
    return res.status(200).json({ success: true, data: item });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch ticket.' });
  }
};

export const updateSupportTicketController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await service.updateSupportTicket(id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Ticket not found.' });
    return res.status(200).json({ success: true, data: updated });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to update ticket.' });
  }
};

export const deleteSupportTicketController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await service.deleteSupportTicket(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Ticket not found.' });
    return res.status(200).json({ success: true, data: deleted });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to delete ticket.' });
  }
};

export const getTicketsByStudentIdController = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const items = await service.getTicketsByStudentId(studentId);
    return res.status(200).json({ success: true, data: items });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch tickets.' });
  }
};

export const getTicketsByDepartmentIdController = async (req: Request, res: Response) => {
  try {
    const { departmentId } = req.params;
    const items = await service.getTicketsByDepartmentId(departmentId);
    return res.status(200).json({ success: true, data: items });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch tickets.' });
  }
};
