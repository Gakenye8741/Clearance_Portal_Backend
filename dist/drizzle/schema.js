"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLogsRelations = exports.departmentSchedulesRelations = exports.notificationLogsRelations = exports.systemSettingsRelations = exports.requirementProgressRelations = exports.departmentRequirementsRelations = exports.notificationsRelations = exports.ticketMessagesRelations = exports.supportTicketsRelations = exports.announcementsRelations = exports.certificatesRelations = exports.documentUploadsRelations = exports.departmentApprovalsRelations = exports.clearanceRequestsRelations = exports.usersRelations = exports.departmentsRelations = exports.auditLogs = exports.clearanceMetricsCache = exports.departmentSchedules = exports.notificationLogs = exports.systemSettings = exports.requirementProgress = exports.departmentRequirements = exports.notifications = exports.ticketMessages = exports.supportTickets = exports.announcements = exports.certificates = exports.documentUploads = exports.departmentApprovals = exports.clearanceRequests = exports.users = exports.departments = exports.notificationTypeEnum = exports.ticketStatusEnum = exports.verificationStatusEnum = exports.fileTypeEnum = exports.approvalStatusEnum = exports.clearanceStatusEnum = exports.departmentTypeEnum = exports.userRoleEnum = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
// ==========================================
// ENUM DEFINITIONS (PostgreSQL Enums)
// ==========================================
exports.userRoleEnum = ['student', 'department_officer', 'hod', 'school_administrator'];
exports.departmentTypeEnum = ['service', 'academic'];
exports.clearanceStatusEnum = ['pending', 'in_progress', 'fully_cleared', 'rejected'];
exports.approvalStatusEnum = ['pending', 'cleared', 'flagged'];
exports.fileTypeEnum = ['receipt', 'project_doc', 'clearance_slip', 'other'];
exports.verificationStatusEnum = ['unverified', 'approved', 'rejected'];
exports.ticketStatusEnum = ['open', 'in_review', 'resolved', 'closed'];
exports.notificationTypeEnum = ['status_update', 'department_flag', 'ticket_reply', 'announcement'];
// ==========================================
// 1. DEPARTMENTS TABLE
// ==========================================
exports.departments = (0, pg_core_1.pgTable)('departments', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    name: (0, pg_core_1.text)('name').notNull().unique(), // e.g., 'Library', 'Finance', 'Hostels', 'Computer Science'
    code: (0, pg_core_1.text)('code').notNull().unique(), // e.g., 'LIB', 'FIN', 'HOST', 'CS'
    type: (0, pg_core_1.text)('type').notNull(), // 'service' or 'academic'
    description: (0, pg_core_1.text)('description'),
    isActive: (0, pg_core_1.boolean)('is_active').default(true).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
// ==========================================
// 2. USERS TABLE (Enhanced Schema)
// ==========================================
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    name: (0, pg_core_1.text)('name').notNull(),
    email: (0, pg_core_1.text)('email').notNull().unique(),
    passwordHash: (0, pg_core_1.text)('password_hash').notNull(),
    role: (0, pg_core_1.text)('role', { enum: exports.userRoleEnum }).notNull(), // 'student', 'department_officer', 'hod', 'school_administrator'
    departmentId: (0, pg_core_1.uuid)('department_id').references(() => exports.departments.id, { onDelete: 'set null' }),
    regNumber: (0, pg_core_1.text)('reg_number').unique(), // Specifically for students (e.g., LAI/2022/12345)
    phoneNumber: (0, pg_core_1.text)('phone_number'),
    // --- New Additions ---
    profilePictureUrl: (0, pg_core_1.text)('profile_picture_url'), // User avatar or passport photo
    facultyOrSchool: (0, pg_core_1.text)('faculty_or_school'), // e.g., 'School of Computing and Informatics'
    yearOfStudy: (0, pg_core_1.integer)('year_of_study'), // e.g., 4 (for students)
    lastLoginAt: (0, pg_core_1.timestamp)('last_login_at'), // Track recent user activity/session
    passwordResetToken: (0, pg_core_1.text)('password_reset_token'), // For secure forgot-password flows
    passwordResetExpires: (0, pg_core_1.timestamp)('password_reset_expires'), // Expiration time for reset token
    acceptTerms: (0, pg_core_1.boolean)('accept_terms').default(false).notNull(), // Terms and conditions acceptance flag
    termsAcceptedAt: (0, pg_core_1.timestamp)('terms_accepted_at'), // Exact timestamp when user accepted terms
    isVerified: (0, pg_core_1.boolean)('is_verified').default(false).notNull(),
    isActive: (0, pg_core_1.boolean)('is_active').default(true).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
}, (table) => {
    return {
        emailIdx: (0, pg_core_1.index)('user_email_idx').on(table.email),
        regNumberIdx: (0, pg_core_1.index)('user_reg_number_idx').on(table.regNumber),
        roleIdx: (0, pg_core_1.index)('user_role_idx').on(table.role),
    };
});
// ==========================================
// 3. CLEARANCE REQUESTS TABLE
// ==========================================
exports.clearanceRequests = (0, pg_core_1.pgTable)('clearance_requests', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    studentId: (0, pg_core_1.uuid)('student_id').references(() => exports.users.id, { onDelete: 'cascade' }).notNull(),
    academicYear: (0, pg_core_1.text)('academic_year').notNull(), // e.g., '2025/2026'
    semester: (0, pg_core_1.text)('semester').notNull(), // e.g., 'Semester II'
    status: (0, pg_core_1.text)('status').notNull().default('pending'), // 'pending', 'in_progress', 'fully_cleared', 'rejected'
    completionPercentage: (0, pg_core_1.integer)('completion_percentage').default(0).notNull(),
    submittedAt: (0, pg_core_1.timestamp)('submitted_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
}, (table) => {
    return {
        studentIdIdx: (0, pg_core_1.index)('clearance_student_id_idx').on(table.studentId),
    };
});
// ==========================================
// 4. DEPARTMENT APPROVALS TABLE
// ==========================================
exports.departmentApprovals = (0, pg_core_1.pgTable)('department_approvals', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    clearanceRequestId: (0, pg_core_1.uuid)('clearance_request_id').references(() => exports.clearanceRequests.id, { onDelete: 'cascade' }).notNull(),
    departmentId: (0, pg_core_1.uuid)('department_id').references(() => exports.departments.id, { onDelete: 'restrict' }).notNull(),
    officerId: (0, pg_core_1.uuid)('officer_id').references(() => exports.users.id, { onDelete: 'set null' }), // Officer or HOD who reviewed it
    status: (0, pg_core_1.text)('status').notNull().default('pending'), // 'pending', 'cleared', 'flagged'
    badgeColorVariant: (0, pg_core_1.text)('badge_color_variant').default('warning').notNull(), // UI helper for dashboard status badges
    remarks: (0, pg_core_1.text)('remarks'), // Mandatory comment/reason if flagged or rejected
    reviewedAt: (0, pg_core_1.timestamp)('reviewed_at'),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
}, (table) => {
    return {
        requestDeptIdx: (0, pg_core_1.index)('approval_request_dept_idx').on(table.clearanceRequestId, table.departmentId),
    };
});
// ==========================================
// 5. STUDENT DOCUMENT UPLOADS TABLE
// ==========================================
exports.documentUploads = (0, pg_core_1.pgTable)('document_uploads', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    clearanceRequestId: (0, pg_core_1.uuid)('clearance_request_id').references(() => exports.clearanceRequests.id, { onDelete: 'cascade' }).notNull(),
    departmentId: (0, pg_core_1.uuid)('department_id').references(() => exports.departments.id, { onDelete: 'restrict' }).notNull(),
    uploaderId: (0, pg_core_1.uuid)('uploader_id').references(() => exports.users.id, { onDelete: 'cascade' }).notNull(),
    fileName: (0, pg_core_1.text)('file_name').notNull(),
    fileUrl: (0, pg_core_1.text)('file_url').notNull(),
    fileType: (0, pg_core_1.text)('file_type').notNull(), // 'receipt', 'project_doc', 'clearance_slip', 'other'
    fileSize: (0, pg_core_1.integer)('file_size'), // in bytes
    verificationStatus: (0, pg_core_1.text)('verification_status').default('unverified').notNull(), // 'unverified', 'approved', 'rejected'
    uploadedAt: (0, pg_core_1.timestamp)('uploaded_at').defaultNow().notNull(),
});
// ==========================================
// 6. CRYPTOGRAPHIC CERTIFICATES TABLE
// ==========================================
exports.certificates = (0, pg_core_1.pgTable)('certificates', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    clearanceRequestId: (0, pg_core_1.uuid)('clearance_request_id').references(() => exports.clearanceRequests.id, { onDelete: 'cascade' }).notNull().unique(),
    studentId: (0, pg_core_1.uuid)('student_id').references(() => exports.users.id, { onDelete: 'cascade' }).notNull(),
    certificateCode: (0, pg_core_1.text)('certificate_code').notNull().unique(), // e.g., CLR-2026-98765
    digitalSignature: (0, pg_core_1.text)('digital_signature').notNull(), // RSA/ECDSA cryptographic signature hash
    payloadJson: (0, pg_core_1.jsonb)('payload_json').notNull(), // Raw signed certificate data payload
    issuedAt: (0, pg_core_1.timestamp)('issued_at').defaultNow().notNull(),
}, (table) => {
    return {
        certCodeIdx: (0, pg_core_1.index)('certificate_code_idx').on(table.certificateCode),
    };
});
// ==========================================
// 7. ANNOUNCEMENTS TABLE
// ==========================================
exports.announcements = (0, pg_core_1.pgTable)('announcements', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    title: (0, pg_core_1.text)('title').notNull(),
    content: (0, pg_core_1.text)('content').notNull(),
    authorId: (0, pg_core_1.uuid)('author_id').references(() => exports.users.id, { onDelete: 'cascade' }).notNull(),
    targetRole: (0, pg_core_1.text)('target_role'), // null for all, or specific role like 'student'
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
// ==========================================
// 8. SUPPORT TICKETS / APPEALS TABLE
// ==========================================
exports.supportTickets = (0, pg_core_1.pgTable)('support_tickets', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    clearanceRequestId: (0, pg_core_1.uuid)('clearance_request_id').references(() => exports.clearanceRequests.id, { onDelete: 'cascade' }).notNull(),
    studentId: (0, pg_core_1.uuid)('student_id').references(() => exports.users.id, { onDelete: 'cascade' }).notNull(),
    departmentId: (0, pg_core_1.uuid)('department_id').references(() => exports.departments.id, { onDelete: 'restrict' }).notNull(),
    subject: (0, pg_core_1.text)('subject').notNull(),
    message: (0, pg_core_1.text)('message').notNull(),
    status: (0, pg_core_1.text)('status').default('open').notNull(), // 'open', 'in_review', 'resolved', 'closed'
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
// ==========================================
// 9. TICKET MESSAGES TABLE
// ==========================================
exports.ticketMessages = (0, pg_core_1.pgTable)('ticket_messages', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    ticketId: (0, pg_core_1.uuid)('ticket_id').references(() => exports.supportTickets.id, { onDelete: 'cascade' }).notNull(),
    senderId: (0, pg_core_1.uuid)('sender_id').references(() => exports.users.id, { onDelete: 'cascade' }).notNull(),
    message: (0, pg_core_1.text)('message').notNull(),
    sentAt: (0, pg_core_1.timestamp)('sent_at').defaultNow().notNull(),
});
// ==========================================
// 10. NOTIFICATIONS TABLE (Detailed Schema with Enum)
// ==========================================
exports.notifications = (0, pg_core_1.pgTable)('notifications', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    userId: (0, pg_core_1.uuid)('user_id').references(() => exports.users.id, { onDelete: 'cascade' }).notNull(),
    title: (0, pg_core_1.text)('title').notNull(),
    message: (0, pg_core_1.text)('message').notNull(),
    type: (0, pg_core_1.text)('type', { enum: exports.notificationTypeEnum }).notNull(), // 'status_update', 'department_flag', 'ticket_reply', 'announcement'
    priority: (0, pg_core_1.text)('priority').notNull().default('normal'), // 'low', 'normal', 'high', 'urgent'
    actionUrl: (0, pg_core_1.text)('action_url'), // Deep link to relevant page (e.g., '/clearance/status' or '/tickets/123')
    metadataJson: (0, pg_core_1.jsonb)('metadata_json'), // Additional payload data for rich frontend rendering
    isRead: (0, pg_core_1.boolean)('is_read').default(false).notNull(),
    readAt: (0, pg_core_1.timestamp)('read_at'), // Exact timestamp when user opened/read the notification
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
}, (table) => {
    return {
        userIdIdx: (0, pg_core_1.index)('notification_user_id_idx').on(table.userId),
        isReadIdx: (0, pg_core_1.index)('notification_is_read_idx').on(table.isRead),
        createdAtIdx: (0, pg_core_1.index)('notification_created_at_idx').on(table.createdAt),
    };
});
// ==========================================
// 11. DEPARTMENT REQUIREMENTS TABLE
// ==========================================
exports.departmentRequirements = (0, pg_core_1.pgTable)('department_requirements', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    departmentId: (0, pg_core_1.uuid)('department_id').references(() => exports.departments.id, { onDelete: 'cascade' }).notNull(),
    title: (0, pg_core_1.text)('title').notNull(), // e.g., 'Zero library books overdue', 'Final year project report submission', 'Zero tuition fee balance'
    description: (0, pg_core_1.text)('description'), // Details of what the department verifies before clicking approve
    isRequired: (0, pg_core_1.boolean)('is_required').default(true).notNull(),
    displayOrder: (0, pg_core_1.integer)('display_order').default(0).notNull(), // UI checklist ordering
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
// ==========================================
// 12. REQUIREMENT PROGRESS TABLE
// ==========================================
exports.requirementProgress = (0, pg_core_1.pgTable)('requirement_progress', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    clearanceRequestId: (0, pg_core_1.uuid)('clearance_request_id').references(() => exports.clearanceRequests.id, { onDelete: 'cascade' }).notNull(),
    requirementId: (0, pg_core_1.uuid)('requirement_id').references(() => exports.departmentRequirements.id, { onDelete: 'cascade' }).notNull(),
    isCompleted: (0, pg_core_1.boolean)('is_completed').default(false).notNull(), // Checkbox state toggle on frontend officer view
    verifiedBy: (0, pg_core_1.uuid)('verified_by').references(() => exports.users.id, { onDelete: 'set null' }),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
}, (table) => {
    return {
        requestReqIdx: (0, pg_core_1.index)('progress_request_req_idx').on(table.clearanceRequestId, table.requirementId),
    };
});
// ==========================================
// 13. SYSTEM SETTINGS TABLE
// ==========================================
exports.systemSettings = (0, pg_core_1.pgTable)('system_settings', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    key: (0, pg_core_1.text)('key').notNull().unique(), // e.g., 'CURRENT_ACADEMIC_YEAR', 'CLEARANCE_PORTAL_STATUS'
    value: (0, pg_core_1.text)('value').notNull(), // e.g., '2025/2026', 'OPEN'
    description: (0, pg_core_1.text)('description'),
    updatedBy: (0, pg_core_1.uuid)('updated_by').references(() => exports.users.id, { onDelete: 'set null' }),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
// ==========================================
// 14. NOTIFICATION LOGS TABLE (Web App Delivery Tracking)
// ==========================================
exports.notificationLogs = (0, pg_core_1.pgTable)('notification_logs', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    userId: (0, pg_core_1.uuid)('user_id').references(() => exports.users.id, { onDelete: 'cascade' }).notNull(),
    channel: (0, pg_core_1.text)('channel').notNull(), // 'in_app', 'email', 'sms'
    status: (0, pg_core_1.text)('status').notNull().default('sent'), // 'sent', 'delivered', 'failed'
    sentAt: (0, pg_core_1.timestamp)('sent_at').defaultNow().notNull(),
});
// ==========================================
// 15. DEPARTMENT OFFICER SCHEDULES TABLE
// ==========================================
exports.departmentSchedules = (0, pg_core_1.pgTable)('department_schedules', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    departmentId: (0, pg_core_1.uuid)('department_id').references(() => exports.departments.id, { onDelete: 'cascade' }).notNull(),
    dayOfWeek: (0, pg_core_1.text)('day_of_week').notNull(), // e.g., 'Monday', 'Tuesday'
    openTime: (0, pg_core_1.text)('open_time').notNull(), // e.g., '08:00 AM'
    closeTime: (0, pg_core_1.text)('close_time').notNull(), // e.g., '05:00 PM'
    isAvailable: (0, pg_core_1.boolean)('is_available').default(true).notNull(),
});
// ==========================================
// 16. CLEARANCE METRICS CACHE TABLE
// ==========================================
exports.clearanceMetricsCache = (0, pg_core_1.pgTable)('clearance_metrics_cache', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    metricKey: (0, pg_core_1.text)('metric_key').notNull().unique(), // e.g., 'TOTAL_COMPLETED_CLEARANCES', 'PENDING_FINANCE_QUEUE'
    metricValue: (0, pg_core_1.integer)('metric_value').notNull().default(0),
    lastUpdated: (0, pg_core_1.timestamp)('last_updated').defaultNow().notNull(),
});
// ==========================================
// 17. AUDIT LOGS TABLE
// ==========================================
exports.auditLogs = (0, pg_core_1.pgTable)('audit_logs', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    actorId: (0, pg_core_1.uuid)('actor_id').references(() => exports.users.id, { onDelete: 'cascade' }).notNull(),
    action: (0, pg_core_1.text)('action').notNull(), // e.g., 'APPROVED_STUDENT', 'OVERRODE_FLAG', 'UPDATED_ROLE', 'FLAGGED_DEFICIT'
    targetEntity: (0, pg_core_1.text)('target_entity'), // e.g., 'department_approvals', 'users'
    targetId: (0, pg_core_1.uuid)('target_id'),
    ipAddress: (0, pg_core_1.text)('ip_address'),
    userAgent: (0, pg_core_1.text)('user_agent'),
    timestamp: (0, pg_core_1.timestamp)('timestamp').defaultNow().notNull(),
}, (table) => {
    return {
        actorIdIdx: (0, pg_core_1.index)('audit_actor_id_idx').on(table.actorId),
        timestampIdx: (0, pg_core_1.index)('audit_timestamp_idx').on(table.timestamp),
    };
});
// ==========================================
// DRIZZLE RELATIONS DEFINITIONS
// ==========================================
exports.departmentsRelations = (0, drizzle_orm_1.relations)(exports.departments, ({ many }) => ({
    users: many(exports.users),
    departmentApprovals: many(exports.departmentApprovals),
    documentUploads: many(exports.documentUploads),
    supportTickets: many(exports.supportTickets),
    departmentRequirements: many(exports.departmentRequirements),
    departmentSchedules: many(exports.departmentSchedules),
}));
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.users, ({ one, many }) => ({
    department: one(exports.departments, {
        fields: [exports.users.departmentId],
        references: [exports.departments.id],
    }),
    clearanceRequests: many(exports.clearanceRequests),
    departmentApprovalsAsOfficer: many(exports.departmentApprovals, { relationName: 'officerApprovals' }),
    documentUploads: many(exports.documentUploads),
    certificates: many(exports.certificates),
    announcements: many(exports.announcements),
    supportTickets: many(exports.supportTickets),
    ticketMessages: many(exports.ticketMessages),
    notifications: many(exports.notifications),
    requirementProgressVerified: many(exports.requirementProgress),
    systemSettingsUpdated: many(exports.systemSettings),
    notificationLogs: many(exports.notificationLogs),
    auditLogs: many(exports.auditLogs),
}));
exports.clearanceRequestsRelations = (0, drizzle_orm_1.relations)(exports.clearanceRequests, ({ one, many }) => ({
    student: one(exports.users, {
        fields: [exports.clearanceRequests.studentId],
        references: [exports.users.id],
    }),
    departmentApprovals: many(exports.departmentApprovals),
    documentUploads: many(exports.documentUploads),
    certificate: one(exports.certificates),
    supportTickets: many(exports.supportTickets),
    requirementProgress: many(exports.requirementProgress),
}));
exports.departmentApprovalsRelations = (0, drizzle_orm_1.relations)(exports.departmentApprovals, ({ one }) => ({
    clearanceRequest: one(exports.clearanceRequests, {
        fields: [exports.departmentApprovals.clearanceRequestId],
        references: [exports.clearanceRequests.id],
    }),
    department: one(exports.departments, {
        fields: [exports.departmentApprovals.departmentId],
        references: [exports.departments.id],
    }),
    officer: one(exports.users, {
        fields: [exports.departmentApprovals.officerId],
        references: [exports.users.id],
        relationName: 'officerApprovals',
    }),
}));
exports.documentUploadsRelations = (0, drizzle_orm_1.relations)(exports.documentUploads, ({ one }) => ({
    clearanceRequest: one(exports.clearanceRequests, {
        fields: [exports.documentUploads.clearanceRequestId],
        references: [exports.clearanceRequests.id],
    }),
    department: one(exports.departments, {
        fields: [exports.documentUploads.departmentId],
        references: [exports.departments.id],
    }),
    uploader: one(exports.users, {
        fields: [exports.documentUploads.uploaderId],
        references: [exports.users.id],
    }),
}));
exports.certificatesRelations = (0, drizzle_orm_1.relations)(exports.certificates, ({ one }) => ({
    clearanceRequest: one(exports.clearanceRequests, {
        fields: [exports.certificates.clearanceRequestId],
        references: [exports.clearanceRequests.id],
    }),
    student: one(exports.users, {
        fields: [exports.certificates.studentId],
        references: [exports.users.id],
    }),
}));
exports.announcementsRelations = (0, drizzle_orm_1.relations)(exports.announcements, ({ one }) => ({
    author: one(exports.users, {
        fields: [exports.announcements.authorId],
        references: [exports.users.id],
    }),
}));
exports.supportTicketsRelations = (0, drizzle_orm_1.relations)(exports.supportTickets, ({ one, many }) => ({
    clearanceRequest: one(exports.clearanceRequests, {
        fields: [exports.supportTickets.clearanceRequestId],
        references: [exports.clearanceRequests.id],
    }),
    student: one(exports.users, {
        fields: [exports.supportTickets.studentId],
        references: [exports.users.id],
    }),
    department: one(exports.departments, {
        fields: [exports.supportTickets.departmentId],
        references: [exports.departments.id],
    }),
    messages: many(exports.ticketMessages),
}));
exports.ticketMessagesRelations = (0, drizzle_orm_1.relations)(exports.ticketMessages, ({ one }) => ({
    ticket: one(exports.supportTickets, {
        fields: [exports.ticketMessages.ticketId],
        references: [exports.supportTickets.id],
    }),
    sender: one(exports.users, {
        fields: [exports.ticketMessages.senderId],
        references: [exports.users.id],
    }),
}));
exports.notificationsRelations = (0, drizzle_orm_1.relations)(exports.notifications, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.notifications.userId],
        references: [exports.users.id],
    }),
}));
exports.departmentRequirementsRelations = (0, drizzle_orm_1.relations)(exports.departmentRequirements, ({ one, many }) => ({
    department: one(exports.departments, {
        fields: [exports.departmentRequirements.departmentId],
        references: [exports.departments.id],
    }),
    requirementProgress: many(exports.requirementProgress),
}));
exports.requirementProgressRelations = (0, drizzle_orm_1.relations)(exports.requirementProgress, ({ one }) => ({
    clearanceRequest: one(exports.clearanceRequests, {
        fields: [exports.requirementProgress.clearanceRequestId],
        references: [exports.clearanceRequests.id],
    }),
    requirement: one(exports.departmentRequirements, {
        fields: [exports.requirementProgress.requirementId],
        references: [exports.departmentRequirements.id],
    }),
    verifier: one(exports.users, {
        fields: [exports.requirementProgress.verifiedBy],
        references: [exports.users.id],
    }),
}));
exports.systemSettingsRelations = (0, drizzle_orm_1.relations)(exports.systemSettings, ({ one }) => ({
    updatedByUser: one(exports.users, {
        fields: [exports.systemSettings.updatedBy],
        references: [exports.users.id],
    }),
}));
exports.notificationLogsRelations = (0, drizzle_orm_1.relations)(exports.notificationLogs, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.notificationLogs.userId],
        references: [exports.users.id],
    }),
}));
exports.departmentSchedulesRelations = (0, drizzle_orm_1.relations)(exports.departmentSchedules, ({ one }) => ({
    department: one(exports.departments, {
        fields: [exports.departmentSchedules.departmentId],
        references: [exports.departments.id],
    }),
}));
exports.auditLogsRelations = (0, drizzle_orm_1.relations)(exports.auditLogs, ({ one }) => ({
    actor: one(exports.users, {
        fields: [exports.auditLogs.actorId],
        references: [exports.users.id],
    }),
}));
