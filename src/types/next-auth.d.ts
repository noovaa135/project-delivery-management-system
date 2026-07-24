import type { OrganizationRole } from "@/schemas/organization";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: OrganizationRole | null;
      organizationId?: string | null;
      organizationName?: string | null;
    };
  }

  interface User {
    role?: OrganizationRole | null;
    organizationId?: string | null;
    organizationName?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: OrganizationRole | null;
    organizationId?: string | null;
    organizationName?: string | null;
  }
}
