import { eq } from "drizzle-orm";
import db from "../../drizzle/db";
import { nonAcademicDepartments, TInsertNonAcademicDepartment, TSelectNonAcademicDepartment } from "../../drizzle/schema";

// -----------------------------------------------------------------------------
// 1. CREATE NON-ACADEMIC DEPARTMENT
// -----------------------------------------------------------------------------
export const createNonAcademicDepartmentService = async (
  data: TInsertNonAcademicDepartment
): Promise<TSelectNonAcademicDepartment> => {
  const result = await db
    .insert(nonAcademicDepartments)
    .values(data)
    .returning();

  return (result as TSelectNonAcademicDepartment[])[0];
};

// -----------------------------------------------------------------------------
// 2. GET ALL NON-ACADEMIC DEPARTMENTS
// -----------------------------------------------------------------------------
export const getAllNonAcademicDepartmentsService = async (): Promise<TSelectNonAcademicDepartment[]> => {
  const departments = await db.select().from(nonAcademicDepartments);
  return departments as TSelectNonAcademicDepartment[];
};

// -----------------------------------------------------------------------------
// 3. GET NON-ACADEMIC DEPARTMENT BY ID
// -----------------------------------------------------------------------------
export const getNonAcademicDepartmentByIdService = async (
  id: string
): Promise<TSelectNonAcademicDepartment | null> => {
  const result = await db
    .select()
    .from(nonAcademicDepartments)
    .where(eq(nonAcademicDepartments.id, id));

  const departments = result as TSelectNonAcademicDepartment[];
  return departments[0] || null;
};

// -----------------------------------------------------------------------------
// 4. GET NON-ACADEMIC DEPARTMENT BY CODE
// -----------------------------------------------------------------------------
export const getNonAcademicDepartmentByCodeService = async (
  code: string
): Promise<TSelectNonAcademicDepartment | null> => {
  const result = await db
    .select()
    .from(nonAcademicDepartments)
    .where(eq(nonAcademicDepartments.code, code));

  const departments = result as TSelectNonAcademicDepartment[];
  return departments[0] || null;
};

// -----------------------------------------------------------------------------
// 5. GET DEPARTMENTS BY TYPE (e.g., 'service', 'statistics', 'ict')
// -----------------------------------------------------------------------------
export const getNonAcademicDepartmentsByTypeService = async (
  type: string
): Promise<TSelectNonAcademicDepartment[]> => {
  const departments = await db
    .select()
    .from(nonAcademicDepartments)
    .where(eq(nonAcademicDepartments.type, type));

  return departments as TSelectNonAcademicDepartment[];
};

// -----------------------------------------------------------------------------
// 6. UPDATE NON-ACADEMIC DEPARTMENT
// -----------------------------------------------------------------------------
export const updateNonAcademicDepartmentService = async (
  id: string,
  updates: Partial<TInsertNonAcademicDepartment>
): Promise<TSelectNonAcademicDepartment | null> => {
  const result = await db
    .update(nonAcademicDepartments)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(nonAcademicDepartments.id, id))
    .returning();

  const departments = result as TSelectNonAcademicDepartment[];
  return departments[0] || null;
};

// -----------------------------------------------------------------------------
// 7. ASSIGN HOD / DIRECTOR TO NON-ACADEMIC DEPARTMENT
// -----------------------------------------------------------------------------
export const assignHodToNonAcademicDepartmentService = async (
  departmentId: string,
  hodId: string
): Promise<TSelectNonAcademicDepartment | null> => {
  const result = await db
    .update(nonAcademicDepartments)
    .set({
      hodId,
      updatedAt: new Date(),
    })
    .where(eq(nonAcademicDepartments.id, departmentId))
    .returning();

  const departments = result as TSelectNonAcademicDepartment[];
  return departments[0] || null;
};

// -----------------------------------------------------------------------------
// 8. TOGGLE NON-ACADEMIC DEPARTMENT ACTIVE STATUS
// -----------------------------------------------------------------------------
export const toggleNonAcademicDepartmentStatusService = async (
  id: string,
  isActive: boolean
): Promise<TSelectNonAcademicDepartment | null> => {
  const result = await db
    .update(nonAcademicDepartments)
    .set({
      isActive,
      updatedAt: new Date(),
    })
    .where(eq(nonAcademicDepartments.id, id))
    .returning();

  const departments = result as TSelectNonAcademicDepartment[];
  return departments[0] || null;
};

// -----------------------------------------------------------------------------
// 9. DELETE NON-ACADEMIC DEPARTMENT
// -----------------------------------------------------------------------------
export const deleteNonAcademicDepartmentService = async (
  id: string
): Promise<boolean> => {
  const result = await db
    .delete(nonAcademicDepartments)
    .where(eq(nonAcademicDepartments.id, id))
    .returning();

  const departments = result as TSelectNonAcademicDepartment[];
  return departments.length > 0;
};