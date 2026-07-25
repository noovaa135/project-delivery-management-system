import { hash } from "bcryptjs";
import { prisma } from "../src/lib/db";

const email = process.env.SEED_ADMIN_EMAIL;
const password = process.env.SEED_ADMIN_PASSWORD;
const name = process.env.SEED_ADMIN_NAME ?? "System Administrator";

async function main() {
  if (!email || !password) {
    console.log("Skipping seed: SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD are not set.");
    return;
  }

  const passwordHash = await hash(password, 12);

  const adminUser = await prisma.user.upsert({
    where: { email },
    update: { name, passwordHash },
    create: { email, name, passwordHash },
  });

  const pmUser = await prisma.user.upsert({
    where: { email: "pm@pdms.local" },
    update: {},
    create: {
      email: "pm@pdms.local",
      name: "Sarah Chen",
      passwordHash,
    },
  });

  const devUser = await prisma.user.upsert({
    where: { email: "dev@pdms.local" },
    update: {},
    create: {
      email: "dev@pdms.local",
      name: "Marcus Johnson",
      passwordHash,
    },
  });

  const clientUser = await prisma.user.upsert({
    where: { email: "client@pdms.local" },
    update: {},
    create: {
      email: "client@pdms.local",
      name: "Emily Rodriguez",
      passwordHash,
    },
  });

  const stakeholderUser = await prisma.user.upsert({
    where: { email: "stakeholder@pdms.local" },
    update: {},
    create: {
      email: "stakeholder@pdms.local",
      name: "David Kim",
      passwordHash,
    },
  });

  const org = await prisma.organization.upsert({
    where: { slug: "default-workspace" },
    update: {},
    create: { name: "Default Workspace", slug: "default-workspace" },
  });

  const memberships = [
    { userId: adminUser.id, role: "SYSTEM_ADMIN" },
    { userId: pmUser.id, role: "PROJECT_MANAGER" },
    { userId: devUser.id, role: "TEAM_MEMBER" },
    { userId: clientUser.id, role: "CLIENT" },
    { userId: stakeholderUser.id, role: "STAKEHOLDER" },
  ];

  for (const m of memberships) {
    await prisma.organizationMember.upsert({
      where: { organizationId_userId: { organizationId: org.id, userId: m.userId } },
      update: { role: m.role },
      create: { organizationId: org.id, userId: m.userId, role: m.role },
    });
  }

  const projectsData = [
    {
      name: "E-Commerce Platform Redesign",
      description: "Complete overhaul of the customer-facing e-commerce platform with modern UX and improved performance.",
      status: "ACTIVE",
      priority: "HIGH",
      startDate: new Date("2026-01-15"),
      targetDate: new Date("2026-09-30"),
      budget: 450000,
      health: "on_track",
    },
    {
      name: "Mobile App v2",
      description: "Native mobile application for iOS and Android with offline support and push notifications.",
      status: "ACTIVE",
      priority: "HIGH",
      startDate: new Date("2026-03-01"),
      targetDate: new Date("2026-11-15"),
      budget: 320000,
      health: "at_risk",
    },
    {
      name: "CRM Integration Hub",
      description: "Integration layer connecting Salesforce, HubSpot, and internal CRM systems.",
      status: "PLANNING",
      priority: "MEDIUM",
      startDate: new Date("2026-07-01"),
      targetDate: new Date("2026-12-31"),
      budget: 180000,
      health: "on_track",
    },
    {
      name: "Data Analytics Dashboard",
      description: "Real-time analytics dashboard for executive team with customizable reports and data visualizations.",
      status: "ACTIVE",
      priority: "MEDIUM",
      startDate: new Date("2026-02-01"),
      targetDate: new Date("2026-08-15"),
      budget: 250000,
      health: "blocked",
    },
    {
      name: "Payment Gateway Migration",
      description: "Migrate from legacy payment processor to new provider with enhanced security features.",
      status: "COMPLETED",
      priority: "CRITICAL",
      startDate: new Date("2025-11-01"),
      targetDate: new Date("2026-02-28"),
      completedAt: new Date("2026-02-20"),
      budget: 95000,
      health: "on_track",
    },
  ];

  const createdProjects = [];
  for (const p of projectsData) {
    const project = await prisma.project.upsert({
      where: { id: p.name.toLowerCase().replace(/\s+/g, "-") },
      update: {
        name: p.name,
        description: p.description,
        status: p.status,
        priority: p.priority,
        startDate: p.startDate,
        targetDate: p.targetDate,
        completedAt: p.completedAt ?? null,
        budget: p.budget,
        health: p.health,
      },
      create: {
        id: p.name.toLowerCase().replace(/\s+/g, "-"),
        name: p.name,
        description: p.description,
        status: p.status,
        priority: p.priority,
        startDate: p.startDate,
        targetDate: p.targetDate,
        completedAt: p.completedAt ?? null,
        budget: p.budget,
        health: p.health,
        organizationId: org.id,
      },
    });
    createdProjects.push(project);
  }

  const projectMemberships = [
    { projectId: createdProjects[0]!.id, userId: pmUser.id, role: "PROJECT_MANAGER" },
    { projectId: createdProjects[0]!.id, userId: devUser.id, role: "TEAM_MEMBER" },
    { projectId: createdProjects[0]!.id, userId: clientUser.id, role: "CLIENT" },
    { projectId: createdProjects[1]!.id, userId: pmUser.id, role: "PROJECT_MANAGER" },
    { projectId: createdProjects[1]!.id, userId: devUser.id, role: "TEAM_MEMBER" },
    { projectId: createdProjects[2]!.id, userId: pmUser.id, role: "PROJECT_MANAGER" },
    { projectId: createdProjects[3]!.id, userId: pmUser.id, role: "PROJECT_MANAGER" },
    { projectId: createdProjects[3]!.id, userId: devUser.id, role: "TEAM_MEMBER" },
    { projectId: createdProjects[4]!.id, userId: pmUser.id, role: "PROJECT_MANAGER" },
    { projectId: createdProjects[4]!.id, userId: devUser.id, role: "TEAM_MEMBER" },
  ];

  for (const pm of projectMemberships) {
    await prisma.projectMember.upsert({
      where: { projectId_userId: { projectId: pm.projectId, userId: pm.userId } },
      update: { role: pm.role },
      create: pm,
    });
  }

  const milestonesData = [
    { name: "Requirements Gathering", projectIdx: 0, dueDate: new Date("2026-02-15"), status: "completed", completedAt: new Date("2026-02-10"), progress: 100 },
    { name: "UI/UX Prototype Approval", projectIdx: 0, dueDate: new Date("2026-04-01"), status: "completed", completedAt: new Date("2026-03-28"), progress: 100 },
    { name: "Core Feature Development", projectIdx: 0, dueDate: new Date("2026-06-30"), status: "in_progress", progress: 65 },
    { name: "Integration Testing", projectIdx: 0, dueDate: new Date("2026-08-15"), status: "pending", progress: 0 },
    { name: "Production Deployment", projectIdx: 0, dueDate: new Date("2026-09-30"), status: "pending", progress: 0 },
    { name: "App Architecture Design", projectIdx: 1, dueDate: new Date("2026-04-15"), status: "completed", completedAt: new Date("2026-04-10"), progress: 100 },
    { name: "Development Sprint 1", projectIdx: 1, dueDate: new Date("2026-07-01"), status: "in_progress", progress: 40 },
    { name: "Development Sprint 2", projectIdx: 1, dueDate: new Date("2026-09-01"), status: "pending", progress: 0 },
    { name: "Beta Release", projectIdx: 1, dueDate: new Date("2026-10-15"), status: "pending", progress: 0 },
    { name: "Technical Discovery", projectIdx: 2, dueDate: new Date("2026-08-01"), status: "pending", progress: 10 },
    { name: "Dashboard Wireframes", projectIdx: 3, dueDate: new Date("2026-03-15"), status: "completed", completedAt: new Date("2026-03-10"), progress: 100 },
    { name: "Data Pipeline Setup", projectIdx: 3, dueDate: new Date("2026-05-01"), status: "completed", completedAt: new Date("2026-04-25"), progress: 100 },
    { name: "Visualization Components", projectIdx: 3, dueDate: new Date("2026-07-01"), status: "in_progress", progress: 30 },
    { name: "User Acceptance Testing", projectIdx: 3, dueDate: new Date("2026-08-01"), status: "pending", progress: 0 },
    { name: "Migration Planning", projectIdx: 4, dueDate: new Date("2025-11-15"), status: "completed", completedAt: new Date("2025-11-12"), progress: 100 },
    { name: "Migration Execution", projectIdx: 4, dueDate: new Date("2026-01-31"), status: "completed", completedAt: new Date("2026-01-25"), progress: 100 },
    { name: "Post-Migration Validation", projectIdx: 4, dueDate: new Date("2026-02-28"), status: "completed", completedAt: new Date("2026-02-20"), progress: 100 },
  ];

  const createdMilestones = [];
  for (const m of milestonesData) {
    const milestone = await prisma.milestone.create({
      data: {
        name: m.name,
        dueDate: m.dueDate,
        status: m.status,
        completedAt: m.completedAt ?? null,
        progress: m.progress,
        projectId: createdProjects[m.projectIdx]!.id,
      },
    });
    createdMilestones.push(milestone);
  }

  const tasksData = [
    { title: "Set up CI/CD pipeline", projectIdx: 0, assigneeIdx: 2, status: "DONE", priority: "HIGH", dueDate: new Date("2026-03-15"), milestoneIdx: 0 },
    { title: "Design system components", projectIdx: 0, assigneeIdx: 2, status: "DONE", priority: "MEDIUM", dueDate: new Date("2026-04-01"), milestoneIdx: 1 },
    { title: "Implement product listing page", projectIdx: 0, assigneeIdx: 2, status: "IN_PROGRESS", priority: "HIGH", dueDate: new Date("2026-05-15"), milestoneIdx: 2 },
    { title: "Implement shopping cart", projectIdx: 0, assigneeIdx: 2, status: "IN_PROGRESS", priority: "HIGH", dueDate: new Date("2026-06-01"), milestoneIdx: 2 },
    { title: "Checkout flow integration", projectIdx: 0, assigneeIdx: 2, status: "TODO", priority: "CRITICAL", dueDate: new Date("2026-07-01"), milestoneIdx: 2 },
    { title: "Payment API integration", projectIdx: 0, assigneeIdx: 1, status: "TODO", priority: "CRITICAL", dueDate: new Date("2026-07-15"), milestoneIdx: 2 },
    { title: "Set up push notifications", projectIdx: 1, assigneeIdx: 2, status: "IN_PROGRESS", priority: "HIGH", dueDate: new Date("2026-06-01"), milestoneIdx: 6 },
    { title: "Offline data sync", projectIdx: 1, assigneeIdx: 2, status: "TODO", priority: "HIGH", dueDate: new Date("2026-07-15"), milestoneIdx: 6 },
    { title: "User authentication flows", projectIdx: 1, assigneeIdx: 2, status: "IN_PROGRESS", priority: "CRITICAL", dueDate: new Date("2026-06-15"), milestoneIdx: 6 },
    { title: "API specification document", projectIdx: 2, assigneeIdx: 1, status: "TODO", priority: "MEDIUM", dueDate: new Date("2026-07-15"), milestoneIdx: 9 },
    { title: "Database schema design", projectIdx: 2, assigneeIdx: 1, status: "TODO", priority: "MEDIUM", dueDate: new Date("2026-08-01"), milestoneIdx: 9 },
    { title: "Interactive chart component", projectIdx: 3, assigneeIdx: 2, status: "IN_PROGRESS", priority: "HIGH", dueDate: new Date("2026-06-15"), milestoneIdx: 12 },
    { title: "Data export functionality", projectIdx: 3, assigneeIdx: 2, status: "TODO", priority: "MEDIUM", dueDate: new Date("2026-07-01"), milestoneIdx: 12 },
    { title: "Real-time data pipeline", projectIdx: 3, assigneeIdx: 1, status: "DONE", priority: "HIGH", dueDate: new Date("2026-04-25"), milestoneIdx: 11 },
    { title: "User permission cleanup", projectIdx: 3, assigneeIdx: 2, status: "IN_REVIEW", priority: "HIGH", dueDate: new Date("2026-06-15"), milestoneIdx: 12 },
  ];

  const userIds = [adminUser.id, pmUser.id, devUser.id, clientUser.id, stakeholderUser.id];

  for (const t of tasksData) {
    await prisma.task.create({
      data: {
        title: t.title,
        status: t.status,
        priority: t.priority,
        dueDate: t.dueDate,
        assigneeId: userIds[t.assigneeIdx],
        projectId: createdProjects[t.projectIdx]!.id,
        milestoneId: createdMilestones[t.milestoneIdx]!.id,
      },
    });
  }

  const deliverablesData = [
    { name: "UI Design System (Figma)", projectIdx: 0, status: "approved", milestoneIdx: 1, uploadedByIdx: 2 },
    { name: "Technical Architecture Document", projectIdx: 0, status: "approved", milestoneIdx: 0, uploadedByIdx: 1 },
    { name: "API Documentation", projectIdx: 0, status: "pending", milestoneIdx: 2, uploadedByIdx: 2 },
    { name: "Mobile App Prototype", projectIdx: 1, status: "pending", milestoneIdx: 6, uploadedByIdx: 2 },
    { name: "Wireframe Mockups", projectIdx: 3, status: "approved", milestoneIdx: 10, uploadedByIdx: 2 },
    { name: "Migration Report", projectIdx: 4, status: "approved", milestoneIdx: 15, uploadedByIdx: 1 },
  ];

  for (const d of deliverablesData) {
    await prisma.deliverable.create({
      data: {
        name: d.name,
        status: d.status,
        fileName: `${d.name.toLowerCase().replace(/\s+/g, "-")}.pdf`,
        fileUrl: `/files/${d.name.toLowerCase().replace(/\s+/g, "-")}.pdf`,
        fileSize: Math.floor(Math.random() * 5000) + 100,
        uploadedById: userIds[d.uploadedByIdx],
        projectId: createdProjects[d.projectIdx]!.id,
        milestoneId: createdMilestones[d.milestoneIdx]!.id,
      },
    });
  }

  const invoicesData = [
    { invoiceNumber: "INV-2026-001", projectIdx: 0, amount: 75000, tax: 15000, status: "PAID", dueDate: new Date("2026-03-15"), paidAt: new Date("2026-03-10"), clientIdx: 3 },
    { invoiceNumber: "INV-2026-002", projectIdx: 0, amount: 120000, tax: 24000, status: "SENT", dueDate: new Date("2026-07-15"), clientIdx: 3 },
    { invoiceNumber: "INV-2026-003", projectIdx: 1, amount: 80000, tax: 16000, status: "PAID", dueDate: new Date("2026-05-01"), paidAt: new Date("2026-04-28"), clientIdx: 3 },
    { invoiceNumber: "INV-2026-004", projectIdx: 1, amount: 60000, tax: 12000, status: "OVERDUE", dueDate: new Date("2026-06-15"), clientIdx: 3 },
    { invoiceNumber: "INV-2026-005", projectIdx: 3, amount: 45000, tax: 9000, status: "DRAFT", dueDate: new Date("2026-08-01"), clientIdx: 3 },
    { invoiceNumber: "INV-2026-006", projectIdx: 4, amount: 95000, tax: 19000, status: "PAID", dueDate: new Date("2026-02-28"), paidAt: new Date("2026-02-25"), clientIdx: 3 },
  ];

  for (const inv of invoicesData) {
    const created = await prisma.invoice.upsert({
      where: { invoiceNumber: inv.invoiceNumber },
      update: {},
      create: {
        invoiceNumber: inv.invoiceNumber,
        amount: inv.amount,
        tax: inv.tax,
        total: inv.amount + inv.tax,
        status: inv.status,
        dueDate: inv.dueDate,
        paidAt: inv.paidAt ?? null,
        projectId: createdProjects[inv.projectIdx]!.id,
        clientId: userIds[inv.clientIdx],
      },
    });

    if (inv.status === "PAID" && inv.paidAt) {
      await prisma.payment.create({
        data: {
          amount: inv.amount + inv.tax,
          method: "bank_transfer",
          reference: `PAY-${inv.invoiceNumber}`,
          paidAt: inv.paidAt,
          invoiceId: created.id,
        },
      });
    }
  }

  const notificationsData = [
    { userId: adminUser.id, title: "Milestone completed", message: "UI/UX Prototype Approval milestone was completed ahead of schedule.", type: "success", link: "/dashboard/milestones" },
    { userId: adminUser.id, title: "New invoice due", message: "INV-2026-004 is now overdue. Follow up with client.", type: "warning", link: "/dashboard/invoices" },
    { userId: adminUser.id, title: "Task assigned", message: "You have been assigned to 'Checkout flow integration'.", type: "info", link: "/dashboard/my-tasks" },
    { userId: pmUser.id, title: "Project at risk", message: "Data Analytics Dashboard is blocked due to data pipeline issues.", type: "error", link: "/dashboard/projects" },
    { userId: pmUser.id, title: "New deliverable uploaded", message: "Mobile App Prototype has been uploaded for review.", type: "info", link: "/dashboard/deliverables" },
    { userId: devUser.id, title: "Task update", message: "'Implement product listing page' status changed to In Progress.", type: "info", link: "/dashboard/my-tasks" },
    { userId: clientUser.id, title: "Invoice paid", message: "INV-2026-003 has been marked as paid.", type: "success", link: "/dashboard/invoices" },
    { userId: stakeholderUser.id, title: "Project status update", message: "Monthly progress report for E-Commerce Platform Redesign is available.", type: "info", link: "/dashboard/reports" },
    { userId: adminUser.id, title: "Payment received", message: "Payment of $90,000 received for INV-2026-001.", type: "success", link: "/dashboard/invoices" },
    { userId: adminUser.id, title: "Team update", message: "Sarah Chen completed 'API specification document'.", type: "info", link: "/dashboard/my-tasks" },
  ];

  for (const n of notificationsData) {
    await prisma.notification.create({ data: n });
  }

  const activityLogsData = [
    { action: "created", entity: "project", entityId: createdProjects[0]!.id, description: "E-Commerce Platform Redesign project created", userId: adminUser.id, projectId: createdProjects[0]!.id },
    { action: "updated_status", entity: "milestone", entityId: createdMilestones[1]!.id, description: "UI/UX Prototype Approval marked as completed", userId: pmUser.id, projectId: createdProjects[0]!.id },
    { action: "completed", entity: "task", entityId: null, description: "Set up CI/CD pipeline completed by Marcus Johnson", userId: devUser.id, projectId: createdProjects[0]!.id },
    { action: "uploaded", entity: "deliverable", entityId: null, description: "UI Design System (Figma) uploaded and approved", userId: devUser.id, projectId: createdProjects[0]!.id },
    { action: "created", entity: "invoice", entityId: null, description: "INV-2026-002 sent to client for $144,000", userId: adminUser.id, projectId: createdProjects[0]!.id },
    { action: "payment_received", entity: "invoice", entityId: null, description: "Payment received for INV-2026-001", userId: adminUser.id, projectId: createdProjects[0]!.id },
    { action: "updated_status", entity: "project", entityId: createdProjects[1]!.id, description: "Mobile App v2 marked as at-risk", userId: pmUser.id, projectId: createdProjects[1]!.id },
    { action: "started", entity: "milestone", entityId: createdMilestones[6]!.id, description: "Development Sprint 1 started for Mobile App v2", userId: pmUser.id, projectId: createdProjects[1]!.id },
    { action: "completed", entity: "project", entityId: createdProjects[4]!.id, description: "Payment Gateway Migration completed successfully", userId: adminUser.id, projectId: createdProjects[4]!.id },
    { action: "updated_status", entity: "task", entityId: null, description: "User permission cleanup blocked - awaiting security review", userId: devUser.id, projectId: createdProjects[3]!.id },
  ];

  for (const log of activityLogsData) {
    await prisma.activityLog.create({ data: log });
  }

  console.log("Seed complete. Created admin, PM, dev, client, stakeholder users.");
  console.log("Projects: E-Commerce Platform Redesign, Mobile App v2, CRM Integration Hub, Data Analytics Dashboard, Payment Gateway Migration");
  console.log("Demo accounts (password: AdminPass1234!):");
  console.log("  admin@pdms.local (SYSTEM_ADMIN)");
  console.log("  pm@pdms.local (PROJECT_MANAGER)");
  console.log("  dev@pdms.local (TEAM_MEMBER)");
  console.log("  client@pdms.local (CLIENT)");
  console.log("  stakeholder@pdms.local (STAKEHOLDER)");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
