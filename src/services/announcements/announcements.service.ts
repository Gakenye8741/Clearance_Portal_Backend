import db from '../../drizzle/db';
import { announcements, SelectAnnouncement, InsertAnnouncement } from '../../drizzle/schema';
import { eq, ilike } from 'drizzle-orm';

export const createAnnouncement = async (data: InsertAnnouncement): Promise<SelectAnnouncement> => {
  const [announcement] = (await db.insert(announcements).values(data).returning()) as SelectAnnouncement[];
  return announcement;
};

export const getAllAnnouncements = async (): Promise<SelectAnnouncement[]> => {
  return await db.select().from(announcements);
};

export const getAnnouncementById = async (id: string): Promise<SelectAnnouncement | undefined> => {
  const [announcement] = await db.select().from(announcements).where(eq(announcements.id, id));
  return announcement;
};

export const updateAnnouncement = async (id: string, data: Partial<InsertAnnouncement>): Promise<SelectAnnouncement | undefined> => {
  const [updated] = (await db
    .update(announcements)
    .set({ ...data })
    .where(eq(announcements.id, id))
    .returning()) as SelectAnnouncement[];
  return updated;
};

export const deleteAnnouncement = async (id: string): Promise<SelectAnnouncement | undefined> => {
  const [deleted] = (await db.delete(announcements).where(eq(announcements.id, id)).returning()) as SelectAnnouncement[];
  return deleted;
};

export const searchAnnouncementsByTitle = async (q: string): Promise<SelectAnnouncement[]> => {
  return await db.select().from(announcements).where(ilike(announcements.title, `%${q}%`));
};
