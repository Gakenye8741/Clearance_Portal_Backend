import db from '../../drizzle/db';
import { supportTickets, SelectSupportTicket, InsertSupportTicket } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

export const createSupportTicket = async (data: InsertSupportTicket): Promise<SelectSupportTicket> => {
  const [ticket] = (await db.insert(supportTickets).values(data).returning()) as SelectSupportTicket[];
  return ticket;
};

export const getAllSupportTickets = async (): Promise<SelectSupportTicket[]> => {
  return await db.select().from(supportTickets);
};

export const getSupportTicketById = async (id: string): Promise<SelectSupportTicket | undefined> => {
  const [ticket] = await db.select().from(supportTickets).where(eq(supportTickets.id, id));
  return ticket;
};

export const updateSupportTicket = async (id: string, data: Partial<InsertSupportTicket>): Promise<SelectSupportTicket | undefined> => {
  const [updated] = (await db
    .update(supportTickets)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(supportTickets.id, id))
    .returning()) as SelectSupportTicket[];
  return updated;
};

export const deleteSupportTicket = async (id: string): Promise<SelectSupportTicket | undefined> => {
  const [deleted] = (await db.delete(supportTickets).where(eq(supportTickets.id, id)).returning()) as SelectSupportTicket[];
  return deleted;
};

export const getTicketsByStudentId = async (studentId: string): Promise<SelectSupportTicket[]> => {
  return await db.select().from(supportTickets).where(eq(supportTickets.studentId, studentId));
};

export const getTicketsByDepartmentId = async (departmentId: string): Promise<SelectSupportTicket[]> => {
  return await db.select().from(supportTickets).where(eq(supportTickets.departmentId, departmentId));
};
