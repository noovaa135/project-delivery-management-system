import type { Session } from "next-auth";

import type { OrganizationRole } from "@/schemas/organization";

export const protectedRoutePrefixes = ["/dashboard"] as const;

export function isProtectedPath(pathname: string) {
  return protectedRoutePrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function hasOrganizationRole(
  userRole: OrganizationRole | null | undefined,
  allowedRoles: readonly OrganizationRole[],
) {
  return Boolean(userRole && allowedRoles.includes(userRole));
}

export function getPrimaryOrganizationRole(session: Session | null) {
  return session?.user?.role ?? null;
}

export function canAccessAdminArea(session: Session | null) {
  return hasOrganizationRole(getPrimaryOrganizationRole(session), ["SYSTEM_ADMIN"]);
}
