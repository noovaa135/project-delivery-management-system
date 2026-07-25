import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const email = process.env.SEED_ADMIN_EMAIL;
const password = process.env.SEED_ADMIN_PASSWORD;
const name = process.env.SEED_ADMIN_NAME ?? "System Administrator";

async function main() {
  if (!email || !password) {
    console.log("Skipping seed: SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD are not set.");
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin user ${email} already exists. Skipping seed.`);
    return;
  }

  const passwordHash = await hash(password, 12);

  const adminUser = await prisma.user.create({
    data: { email, name, passwordHash },
  });

  let org = await prisma.organization.findUnique({ where: { slug: "default-workspace" } });
  if (!org) {
    org = await prisma.organization.create({
      data: { name: "Default Workspace", slug: "default-workspace" },
    });
  }

  const existingMembership = await prisma.organizationMember.findUnique({
    where: { organizationId_userId: { organizationId: org.id, userId: adminUser.id } },
  });

  if (!existingMembership) {
    await prisma.organizationMember.create({
      data: { organizationId: org.id, userId: adminUser.id, role: "SYSTEM_ADMIN" },
    });
  }

  console.log(`Admin user ${email} created successfully.`);
}

main()
  .catch((error) => {
    console.error("Seed error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
