import db from '../../drizzle/db';
import { defaulters, SelectDefaulter, InsertDefaulter } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

export const createDefaulter = async (data: InsertDefaulter): Promise<SelectDefaulter> => {
  const [d] = (await db.insert(defaulters).values(data).returning()) as SelectDefaulter[];
  return d;
};

export const getAllDefaulters = async (): Promise<SelectDefaulter[]> => {
  return await db.select().from(defaulters);
};

export const getDefaulterById = async (id: string): Promise<SelectDefaulter | undefined> => {
  const [d] = await db.select().from(defaulters).where(eq(defaulters.id, id));
  return d;
};

export const updateDefaulter = async (id: string, data: Partial<InsertDefaulter>): Promise<SelectDefaulter | undefined> => {
  const [updated] = (await db
    .update(defaulters)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(defaulters.id, id))
    .returning()) as SelectDefaulter[];
  return updated;
};

export const deleteDefaulter = async (id: string): Promise<SelectDefaulter | undefined> => {
  const [deleted] = (await db.delete(defaulters).where(eq(defaulters.id, id)).returning()) as SelectDefaulter[];
  return deleted;
};

export const getDefaultersByClearanceRequestId = async (clearanceRequestId: string): Promise<SelectDefaulter[]> => {
  return await db.select().from(defaulters).where(eq(defaulters.clearanceRequestId, clearanceRequestId));
};
