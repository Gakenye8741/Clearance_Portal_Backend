import db from '../../drizzle/db';
import { notifications, SelectNotification, InsertNotification } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

export const createNotification = async (data: InsertNotification): Promise<SelectNotification> => {
  const [n] = (await db.insert(notifications).values(data).returning()) as SelectNotification[];
  return n;
};

export const getNotificationsByUserId = async (userId: string): Promise<SelectNotification[]> => {
  return await db.select().from(notifications).where(eq(notifications.userId, userId));
};

export const markAsRead = async (id: string): Promise<SelectNotification | undefined> => {
  const [updated] = (await db.update(notifications).set({ isRead: true, readAt: new Date() }).where(eq(notifications.id, id)).returning()) as SelectNotification[];
  return updated;
};

export const deleteNotification = async (id: string): Promise<SelectNotification | undefined> => {
  const [deleted] = (await db.delete(notifications).where(eq(notifications.id, id)).returning()) as SelectNotification[];
  return deleted;
};
