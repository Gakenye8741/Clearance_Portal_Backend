import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, boolean, integer, jsonb, index, uuid } from 'drizzle-orm/pg-core';

// ==========================================
// ENUM DEFINITIONS (PostgreSQL Enums)
// ==========================================
export const userRoleEnum = ['student', 'school_dean', 'hod', 'school_administrator'] as const;

export const clearanceStatusEnum = ['pending', 'in_progress', 'fully_cleared', 'rejected'] as const;

export const approvalStatusEnum = ['pending', 'cleared', 'flagged'] as const;

export const fileTypeEnum = ['receipt', 'project_doc', 'clearance_slip', 'other'] as const;

export const verificationStatusEnum = ['unverified', 'approved', 'rejected'] as const;

export const ticketStatusEnum = ['open', 'in_review', 'resolved', 'closed'] as const;

export const notificationTypeEnum = ['status_update', 'department_flag', 'ticket_reply', 'announcement'] as const;

// ==========================================
// SCHOOLS TABLE (Dynamic)
// ==========================================
export const schools = pgTable('schools', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(), // e.g., 'School of Science', 'School of Agriculture'
  code: text('code').notNull().unique(), // e.g., 'SCI', 'AGR'
  description: text('description'),
  deanId: uuid('dean_id').references(() => users.id, { onDelete: 'set null' }), // Assigned School Dean
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==========================================
// SCHOOL DEPARTMENTS TABLE (Dynamic)
// ==========================================
export const schoolDepartments = pgTable('school_departments', {
  id: uuid('id').defaultRandom().primaryKey(),
  schoolId: uuid('school_id').references(() => schools.id, { onDelete: 'cascade' }).notNull(),
  hodId: uuid('hod_id').references(() => users.id, { onDelete: 'set null' }), // Assigned Head of Department (HOD)
  name: text('name').notNull().unique(), // e.g., 'Department of Computing and Information Technology'
  code: text('code').notNull().unique(), // e.g., 'DCIT'
  description: text('description'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}) as any;

// ==========================================
// 1. NON-ACADEMIC / SERVICE DEPARTMENTS TABLE
// ==========================================
export const nonAcademicDepartments = pgTable('non_academic_departments', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(), // e.g., 'Library', 'Finance', 'Hostels'
  code: text('code').notNull().unique(), // e.g., 'LIB', 'FIN', 'HOST'
  type: text('type').notNull().default('service'), // 'service'
  description: text('description'),
  hodId: uuid('hod_id').references(() => users.id, { onDelete: 'set null' }), // Assigned Head of Department (HOD)
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}) as any;

// ==========================================
// 2. USERS TABLE
// ==========================================
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role', { enum: userRoleEnum }).notNull(),
  departmentId: uuid('department_id').references(() => nonAcademicDepartments.id, { onDelete: 'set null' }),
  regNumber: text('reg_number').unique(), // Format example: SC/COM/0008/22
  phoneNumber: text('phone_number'),
  profilePictureUrl: text('profile_picture_url'),
  schoolId: uuid('school_id').references(() => schools.id, { onDelete: 'set null' }),
  schoolDepartmentId: uuid('school_department_id').references(() => schoolDepartments.id, { onDelete: 'set null' }),
  yearOfStudy: integer('year_of_study').default(1).notNull(), // Managed and locked by admin/system logic
  lastLoginAt: timestamp('last_login_at'),
  passwordResetToken: text('password_reset_token'),
  passwordResetExpires: timestamp('password_reset_expires'),
  acceptTerms: boolean('accept_terms').default(false).notNull(),
  termsAcceptedAt: timestamp('terms_accepted_at'),
  isVerified: boolean('is_verified').default(false).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    emailIdx: index('user_email_idx').on(table.email),
    regNumberIdx: index('user_reg_number_idx').on(table.regNumber),
    roleIdx: index('user_role_idx').on(table.role),
  };
}) as any;

// ==========================================
// 3. CLEARANCE REQUESTS TABLE
// ==========================================
export const clearanceRequests = pgTable('clearance_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  studentId: uuid('student_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  academicYear: text('academic_year').notNull(), // e.g., '2025/2026'
  semester: text('semester').notNull(), // e.g., 'Semester II'
  status: text('status').notNull().default('pending'), // 'pending', 'in_progress', 'fully_cleared', 'rejected'
  completionPercentage: integer('completion_percentage').default(0).notNull(),
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    studentIdIdx: index('clearance_student_id_idx').on(table.studentId),
  };
});

// ==========================================
// 4. DEPARTMENT APPROVALS TABLE
// ==========================================
export const departmentApprovals = pgTable('department_approvals', {
  id: uuid('id').defaultRandom().primaryKey(),
  clearanceRequestId: uuid('clearance_request_id').references(() => clearanceRequests.id, { onDelete: 'cascade' }).notNull(),
  departmentId: uuid('department_id').references(() => nonAcademicDepartments.id, { onDelete: 'restrict' }).notNull(),
  officerId: uuid('officer_id').references(() => users.id, { onDelete: 'set null' }), // Officer or HOD who reviewed it
  status: text('status').notNull().default('pending'), // 'pending', 'cleared', 'flagged'
  badgeColorVariant: text('badge_color_variant').default('warning').notNull(), // UI helper for dashboard status badges
  remarks: text('remarks'), // Mandatory comment/reason if flagged or rejected
  reviewedAt: timestamp('reviewed_at'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    requestDeptIdx: index('approval_request_dept_idx').on(table.clearanceRequestId, table.departmentId),
  };
});

// ==========================================
// 5. STUDENT DOCUMENT UPLOADS TABLE
// ==========================================
export const documentUploads = pgTable('document_uploads', {
  id: uuid('id').defaultRandom().primaryKey(),
  clearanceRequestId: uuid('clearance_request_id').references(() => clearanceRequests.id, { onDelete: 'cascade' }).notNull(),
  departmentId: uuid('department_id').references(() => nonAcademicDepartments.id, { onDelete: 'restrict' }).notNull(),
  uploaderId: uuid('uploader_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  fileName: text('file_name').notNull(),
  fileUrl: text('file_url').notNull(),
  fileType: text('file_type').notNull(), // 'receipt', 'project_doc', 'clearance_slip', 'other'
  fileSize: integer('file_size'), // in bytes
  verificationStatus: text('verification_status').default('unverified').notNull(), // 'unverified', 'approved', 'rejected'
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
});

// ==========================================
// 6. CRYPTOGRAPHIC CERTIFICATES TABLE
// ==========================================
export const certificates = pgTable('certificates', {
  id: uuid('id').defaultRandom().primaryKey(),
  clearanceRequestId: uuid('clearance_request_id').references(() => clearanceRequests.id, { onDelete: 'cascade' }).notNull().unique(),
  studentId: uuid('student_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  certificateCode: text('certificate_code').notNull().unique(), // e.g., CLR-2026-98765
  digitalSignature: text('digital_signature').notNull(), // RSA/ECDSA cryptographic signature hash
  payloadJson: jsonb('payload_json').notNull(), // Raw signed certificate data payload
  issuedAt: timestamp('issued_at').defaultNow().notNull(),
}, (table) => {
  return {
    certCodeIdx: index('certificate_code_idx').on(table.certificateCode),
  };
});

// ==========================================
// 7. ANNOUNCEMENTS TABLE
// ==========================================
export const announcements = pgTable('announcements', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  authorId: uuid('author_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  targetRole: text('target_role'), // null for all, or specific role like 'student'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==========================================
// 8. SUPPORT TICKETS / APPEALS TABLE
// ==========================================
export const supportTickets = pgTable('support_tickets', {
  id: uuid('id').defaultRandom().primaryKey(),
  clearanceRequestId: uuid('clearance_request_id').references(() => clearanceRequests.id, { onDelete: 'cascade' }).notNull(),
  studentId: uuid('student_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  departmentId: uuid('department_id').references(() => nonAcademicDepartments.id, { onDelete: 'restrict' }).notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  status: text('status').default('open').notNull(), // 'open', 'in_review', 'resolved', 'closed'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==========================================
// 9. TICKET MESSAGES TABLE
// ==========================================
export const ticketMessages = pgTable('ticket_messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  ticketId: uuid('ticket_id').references(() => supportTickets.id, { onDelete: 'cascade' }).notNull(),
  senderId: uuid('sender_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  message: text('message').notNull(),
  sentAt: timestamp('sent_at').defaultNow().notNull(),
});

// ==========================================
// 10. NOTIFICATIONS TABLE
// ==========================================
export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type', { enum: notificationTypeEnum }).notNull(),
  priority: text('priority').notNull().default('normal'),
  actionUrl: text('action_url'),
  metadataJson: jsonb('metadata_json'),
  isRead: boolean('is_read').default(false).notNull(),
  readAt: timestamp('read_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return {
    userIdIdx: index('notification_user_id_idx').on(table.userId),
    isReadIdx: index('notification_is_read_idx').on(table.isRead),
    createdAtIdx: index('notification_created_at_idx').on(table.createdAt),
  };
});

// ==========================================
// 13. DEFAULTERS TABLE
// ==========================================
export const defaulters = pgTable('defaulters', {
  id: uuid('id').defaultRandom().primaryKey(),
  clearanceRequestId: uuid('clearance_request_id').references(() => clearanceRequests.id, { onDelete: 'cascade' }).notNull(),
  departmentId: uuid('department_id').references(() => nonAcademicDepartments.id, { onDelete: 'cascade' }).notNull(),
  reason: text('reason').notNull(),
  status: text('status').default('pending').notNull(),
  flaggedBy: uuid('flagged_by').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    defaulterRequestDeptIdx: index('defaulter_request_dept_idx').on(table.clearanceRequestId, table.departmentId),
  };
});

// ==========================================
// 14. SYSTEM SETTINGS TABLE
// ==========================================
export const systemSettings = pgTable('system_settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  key: text('key').notNull().unique(),
  value: text('value').notNull(),
  description: text('description'),
  updatedBy: uuid('updated_by').references(() => users.id, { onDelete: 'set null' }),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==========================================
// 15. NOTIFICATION LOGS TABLE
// ==========================================
export const notificationLogs = pgTable('notification_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  channel: text('channel').notNull(),
  status: text('status').notNull().default('sent'),
  sentAt: timestamp('sent_at').defaultNow().notNull(),
});

// ==========================================
// 16. DEPARTMENT OFFICER SCHEDULES TABLE
// ==========================================
export const departmentSchedules = pgTable('department_schedules', {
  id: uuid('id').defaultRandom().primaryKey(),
  departmentId: uuid('department_id').references(() => nonAcademicDepartments.id, { onDelete: 'cascade' }).notNull(),
  dayOfWeek: text('day_of_week').notNull(),
  openTime: text('open_time').notNull(),
  closeTime: text('close_time').notNull(),
  isAvailable: boolean('is_available').default(true).notNull(),
});

// ==========================================
// 17. CLEARANCE METRICS CACHE TABLE
// ==========================================
export const clearanceMetricsCache = pgTable('clearance_metrics_cache', {
  id: uuid('id').defaultRandom().primaryKey(),
  metricKey: text('metric_key').notNull().unique(),
  metricValue: integer('metric_value').notNull().default(0),
  lastUpdated: timestamp('last_updated').defaultNow().notNull(),
});

// ==========================================
// 18. AUDIT LOGS TABLE
// ==========================================
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  actorId: uuid('actor_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  action: text('action').notNull(),
  targetEntity: text('target_entity'),
  targetId: uuid('target_id'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
}, (table) => {
  return {
    actorIdIdx: index('audit_actor_id_idx').on(table.actorId),
    timestampIdx: index('audit_timestamp_idx').on(table.timestamp),
  };
});

// ==========================================
// DRIZZLE RELATIONS DEFINITIONS
// ==========================================

export const schoolsRelations = relations(schools, ({ one, many }) => ({
  dean: one(users, {
    fields: [schools.deanId],
    references: [users.id],
    relationName: 'schoolDean',
  }),
  schoolDepartments: many(schoolDepartments),
  users: many(users),
}));

export const schoolDepartmentsRelations = relations(schoolDepartments, ({ one, many }) => ({
  school: one(schools, {
    fields: [schoolDepartments.schoolId],
    references: [schools.id],
  }),
  hod: one(users, {
    fields: [schoolDepartments.hodId],
    references: [users.id],
    relationName: 'schoolDepartmentHod',
  }),
  users: many(users),
}));

export const nonAcademicDepartmentsRelations = relations(nonAcademicDepartments, ({ one, many }) => ({
  hod: one(users, {
    fields: [nonAcademicDepartments.hodId],
    references: [users.id],
    relationName: 'nonAcademicDepartmentHod',
  }),
  users: many(users),
  departmentApprovals: many(departmentApprovals),
  documentUploads: many(documentUploads),
  supportTickets: many(supportTickets),
  departmentSchedules: many(departmentSchedules),
  defaulters: many(defaulters),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  department: one(nonAcademicDepartments, {
    fields: [users.departmentId],
    references: [nonAcademicDepartments.id],
  }),
  school: one(schools, {
    fields: [users.schoolId],
    references: [schools.id],
  }),
  schoolDepartment: one(schoolDepartments, {
    fields: [users.schoolDepartmentId],
    references: [schoolDepartments.id],
  }),
  nonAcademicDepartmentsLed: many(nonAcademicDepartments, { relationName: 'nonAcademicDepartmentHod' }),
  schoolDepartmentsLed: many(schoolDepartments, { relationName: 'schoolDepartmentHod' }),
  schoolsLed: many(schools, { relationName: 'schoolDean' }),
  clearanceRequests: many(clearanceRequests),
  departmentApprovalsAsOfficer: many(departmentApprovals, { relationName: 'officerApprovals' }),
  documentUploads: many(documentUploads),
  certificates: many(certificates),
  announcements: many(announcements),
  supportTickets: many(supportTickets),
  ticketMessages: many(ticketMessages),
  notifications: many(notifications),
  defaultersFlagged: many(defaulters, { relationName: 'defaulterFlaggedBy' }),
  systemSettingsUpdated: many(systemSettings),
  notificationLogs: many(notificationLogs),
  auditLogs: many(auditLogs),
}));

export const clearanceRequestsRelations = relations(clearanceRequests, ({ one, many }) => ({
  student: one(users, {
    fields: [clearanceRequests.studentId],
    references: [users.id],
  }),
  departmentApprovals: many(departmentApprovals),
  documentUploads: many(documentUploads),
  certificate: one(certificates),
  supportTickets: many(supportTickets),
  defaulters: many(defaulters),
}));

export const departmentApprovalsRelations = relations(departmentApprovals, ({ one }) => ({
  clearanceRequest: one(clearanceRequests, {
    fields: [departmentApprovals.clearanceRequestId],
    references: [clearanceRequests.id],
  }),
  department: one(nonAcademicDepartments, {
    fields: [departmentApprovals.departmentId],
    references: [nonAcademicDepartments.id],
  }),
  officer: one(users, {
    fields: [departmentApprovals.officerId],
    references: [users.id],
    relationName: 'officerApprovals',
  }),
}));

export const documentUploadsRelations = relations(documentUploads, ({ one }) => ({
  clearanceRequest: one(clearanceRequests, {
    fields: [documentUploads.clearanceRequestId],
    references: [clearanceRequests.id],
  }),
  department: one(nonAcademicDepartments, {
    fields: [documentUploads.departmentId],
    references: [nonAcademicDepartments.id],
  }),
  uploader: one(users, {
    fields: [documentUploads.uploaderId],
    references: [users.id],
  }),
}));

export const certificatesRelations = relations(certificates, ({ one }) => ({
  clearanceRequest: one(clearanceRequests, {
    fields: [certificates.clearanceRequestId],
    references: [clearanceRequests.id],
  }),
  student: one(users, {
    fields: [certificates.studentId],
    references: [users.id],
  }),
}));

export const announcementsRelations = relations(announcements, ({ one }) => ({
  author: one(users, {
    fields: [announcements.authorId],
    references: [users.id],
  }),
}));

export const supportTicketsRelations = relations(supportTickets, ({ one, many }) => ({
  clearanceRequest: one(clearanceRequests, {
    fields: [supportTickets.clearanceRequestId],
    references: [clearanceRequests.id],
  }),
  student: one(users, {
    fields: [supportTickets.studentId],
    references: [users.id],
  }),
  department: one(nonAcademicDepartments, {
    fields: [supportTickets.departmentId],
    references: [nonAcademicDepartments.id],
  }),
  messages: many(ticketMessages),
}));

export const ticketMessagesRelations = relations(ticketMessages, ({ one }) => ({
  ticket: one(supportTickets, {
    fields: [ticketMessages.ticketId],
    references: [supportTickets.id],
  }),
  sender: one(users, {
    fields: [ticketMessages.senderId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const defaultersRelations = relations(defaulters, ({ one }) => ({
  clearanceRequest: one(clearanceRequests, {
    fields: [defaulters.clearanceRequestId],
    references: [clearanceRequests.id],
  }),
  department: one(nonAcademicDepartments, {
    fields: [defaulters.departmentId],
    references: [nonAcademicDepartments.id],
  }),
  flaggedByUser: one(users, {
    fields: [defaulters.flaggedBy],
    references: [users.id],
    relationName: 'defaulterFlaggedBy',
  }),
}));

export const systemSettingsRelations = relations(systemSettings, ({ one }) => ({
  updatedByUser: one(users, {
    fields: [systemSettings.updatedBy],
    references: [users.id],
  }),
}));

export const notificationLogsRelations = relations(notificationLogs, ({ one }) => ({
  user: one(users, {
    fields: [notificationLogs.userId],
    references: [users.id],
  }),
}));

export const departmentSchedulesRelations = relations(departmentSchedules, ({ one }) => ({
  department: one(nonAcademicDepartments, {
    fields: [departmentSchedules.departmentId],
    references: [nonAcademicDepartments.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  actor: one(users, {
    fields: [auditLogs.actorId],
    references: [users.id],
  }),
}));

// ==========================================
// TYPE DEFINITIONS (Inferred Models)
// ==========================================

export type SelectSchool = typeof schools.$inferSelect;
export type InsertSchool = typeof schools.$inferInsert;

export type SelectSchoolDepartment = typeof schoolDepartments.$inferSelect;
export type InsertSchoolDepartment = typeof schoolDepartments.$inferInsert;

export type TSelectNonAcademicDepartment = typeof nonAcademicDepartments.$inferSelect;
export type TInsertNonAcademicDepartment = typeof nonAcademicDepartments.$inferInsert;

export type TSelectUsers = typeof users.$inferSelect;
export type TInsertUsers = typeof users.$inferInsert;

export type SelectClearanceRequest = typeof clearanceRequests.$inferSelect;
export type InsertClearanceRequest = typeof clearanceRequests.$inferInsert;

export type SelectDepartmentApproval = typeof departmentApprovals.$inferSelect;
export type InsertDepartmentApproval = typeof departmentApprovals.$inferInsert;

export type SelectDocumentUpload = typeof documentUploads.$inferSelect;
export type InsertDocumentUpload = typeof documentUploads.$inferInsert;

export type SelectCertificate = typeof certificates.$inferSelect;
export type InsertCertificate = typeof certificates.$inferInsert;

export type SelectAnnouncement = typeof announcements.$inferSelect;
export type InsertAnnouncement = typeof announcements.$inferInsert;

export type SelectSupportTicket = typeof supportTickets.$inferSelect;
export type InsertSupportTicket = typeof supportTickets.$inferInsert;

export type SelectTicketMessage = typeof ticketMessages.$inferSelect;
export type InsertTicketMessage = typeof ticketMessages.$inferInsert;

export type SelectNotification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

export type SelectDefaulter = typeof defaulters.$inferSelect;
export type InsertDefaulter = typeof defaulters.$inferInsert;

export type SelectSystemSetting = typeof systemSettings.$inferSelect;
export type InsertSystemSetting = typeof systemSettings.$inferInsert;

export type SelectNotificationLog = typeof notificationLogs.$inferSelect;
export type InsertNotificationLog = typeof notificationLogs.$inferInsert;

export type SelectDepartmentSchedule = typeof departmentSchedules.$inferSelect;
export type InsertDepartmentSchedule = typeof departmentSchedules.$inferInsert;

export type SelectClearanceMetricsCache = typeof clearanceMetricsCache.$inferSelect;
export type InsertClearanceMetricsCache = typeof clearanceMetricsCache.$inferInsert;

export type SelectAuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;