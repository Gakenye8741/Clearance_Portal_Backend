import db from '../../drizzle/db';
import { 
  schools, 
  schoolDepartments, 
  SelectSchool, 
  InsertSchool, 
  SelectSchoolDepartment, 
  InsertSchoolDepartment 
} from '../../drizzle/schema';
import { eq, ilike, and } from 'drizzle-orm';

// ==========================================
// SCHOOLS SERVICE
// ==========================================

export const createSchool = async (data: InsertSchool): Promise<SelectSchool> => {
  const [school] = (await db.insert(schools).values(data).returning()) as SelectSchool[];
  return school;
};

export const getAllSchools = async (): Promise<SelectSchool[]> => {
  return await db.select().from(schools);
};

export const getSchoolById = async (id: string): Promise<SelectSchool | undefined> => {
  const [school] = await db.select().from(schools).where(eq(schools.id, id));
  return school;
};

export const updateSchool = async (id: string, data: Partial<InsertSchool>): Promise<SelectSchool | undefined> => {
  const [updated] = (await db
    .update(schools)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(schools.id, id))
    .returning()) as SelectSchool[];
  return updated;
};

export const deleteSchool = async (id: string): Promise<SelectSchool | undefined> => {
  const [deleted] = (await db.delete(schools).where(eq(schools.id, id)).returning()) as SelectSchool[];
  return deleted;
};

// --- Additional Detailed Services for Schools ---

export const getSchoolByCode = async (code: string): Promise<SelectSchool | undefined> => {
  const [school] = await db.select().from(schools).where(eq(schools.code, code));
  return school;
};

export const getActiveSchools = async (): Promise<SelectSchool[]> => {
  return await db.select().from(schools).where(eq(schools.isActive, true));
};

export const searchSchoolsByName = async (searchTerm: string): Promise<SelectSchool[]> => {
  return await db.select().from(schools).where(ilike(schools.name, `%${searchTerm}%`));
};

// ==========================================
// SCHOOL DEPARTMENTS SERVICE
// ==========================================

export const createDepartment = async (data: InsertSchoolDepartment): Promise<SelectSchoolDepartment> => {
  const [department] = (await db.insert(schoolDepartments).values(data).returning()) as SelectSchoolDepartment[];
  return department;
};

export const getAllDepartments = async (): Promise<SelectSchoolDepartment[]> => {
  return await db.select().from(schoolDepartments);
};

export const getDepartmentsBySchoolId = async (schoolId: string): Promise<SelectSchoolDepartment[]> => {
  return await db
    .select()
    .from(schoolDepartments)
    .where(eq(schoolDepartments.schoolId, schoolId));
};

export const getDepartmentById = async (id: string): Promise<SelectSchoolDepartment | undefined> => {
  const [department] = await db.select().from(schoolDepartments).where(eq(schoolDepartments.id, id));
  return department;
};

export const updateDepartment = async (id: string, data: Partial<InsertSchoolDepartment>): Promise<SelectSchoolDepartment | undefined> => {
  const [updated] = (await db
    .update(schoolDepartments)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(schoolDepartments.id, id))
    .returning()) as SelectSchoolDepartment[];
  return updated;
};

export const deleteDepartment = async (id: string): Promise<SelectSchoolDepartment | undefined> => {
  const [deleted] = (await db.delete(schoolDepartments).where(eq(schoolDepartments.id, id)).returning()) as SelectSchoolDepartment[];
  return deleted;
};

// --- Additional Detailed Services for Departments ---

export const getDepartmentByCode = async (code: string): Promise<SelectSchoolDepartment | undefined> => {
  const [department] = await db.select().from(schoolDepartments).where(eq(schoolDepartments.code, code));
  return department;
};

export const getActiveDepartmentsBySchoolId = async (schoolId: string): Promise<SelectSchoolDepartment[]> => {
  return await db
    .select()
    .from(schoolDepartments)
    .where(and(eq(schoolDepartments.schoolId, schoolId), eq(schoolDepartments.isActive, true)));
};

export const searchDepartmentsByName = async (searchTerm: string): Promise<SelectSchoolDepartment[]> => {
  return await db.select().from(schoolDepartments).where(ilike(schoolDepartments.name, `%${searchTerm}%`));
};

// ==========================================
// ADVANCED QUERIES (Using Drizzle .query API)
// ==========================================

export const getSchoolWithRelations = async (schoolId: string) => {
  return await db.query.schools.findFirst({
    where: eq(schools.id, schoolId),
    with: {
      schoolDepartments: true,
      users: true,
    },
  });
};

export const getDepartmentWithRelations = async (departmentId: string) => {
  return await db.query.schoolDepartments.findFirst({
    where: eq(schoolDepartments.id, departmentId),
    with: {
      school: true,
      users: true,
    },
  });
};

// --- Additional Detailed Advanced Queries ---

export const getAllSchoolsWithRelations = async () => {
  return await db.query.schools.findMany({
    with: {
      schoolDepartments: true,
      users: true,
    },
  });
};

export const getAllDepartmentsWithRelations = async () => {
  return await db.query.schoolDepartments.findMany({
    with: {
      school: true,
      users: true,
    },
  });
};