import { z } from "zod";

export const organizationRoleSchema = z.enum([
  "SYSTEM_ADMIN",
  "PROJECT_MANAGER",
  "TEAM_MEMBER",
  "CLIENT",
  "STAKEHOLDER",
]);

export type OrganizationRole = z.infer<typeof organizationRoleSchema>;
