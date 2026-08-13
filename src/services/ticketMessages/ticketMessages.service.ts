import db from '../../drizzle/db';
import { ticketMessages, SelectTicketMessage, InsertTicketMessage } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

export const createTicketMessage = async (data: InsertTicketMessage): Promise<SelectTicketMessage> => {
  const [message] = (await db.insert(ticketMessages).values(data).returning()) as SelectTicketMessage[];
  return message;
};

export const getMessagesByTicketId = async (ticketId: string): Promise<SelectTicketMessage[]> => {
  return await db.select().from(ticketMessages).where(eq(ticketMessages.ticketId, ticketId));
};

export const getMessageById = async (id: string): Promise<SelectTicketMessage | undefined> => {
  const [msg] = await db.select().from(ticketMessages).where(eq(ticketMessages.id, id));
  return msg;
};

export const deleteMessage = async (id: string): Promise<SelectTicketMessage | undefined> => {
  const [deleted] = (await db.delete(ticketMessages).where(eq(ticketMessages.id, id)).returning()) as SelectTicketMessage[];
  return deleted;
};
