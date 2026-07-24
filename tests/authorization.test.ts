import { describe, expect, it } from "vitest";

import { canAccessAdminArea, hasOrganizationRole, isProtectedPath } from "@/server/auth/authorization";

describe("authorization helpers", () => {
  it("identifies protected application routes", () => {
    expect(isProtectedPath("/dashboard")).toBe(true);
    expect(isProtectedPath("/dashboard/reports")).toBe(true);
    expect(isProtectedPath("/sign-in")).toBe(false);
  });

  it("validates allowed organization roles", () => {
    expect(hasOrganizationRole("PROJECT_MANAGER", ["SYSTEM_ADMIN", "PROJECT_MANAGER"])).toBe(true);
    expect(hasOrganizationRole("CLIENT", ["SYSTEM_ADMIN", "PROJECT_MANAGER"])).toBe(false);
  });

  it("only permits system admins into admin areas", () => {
    expect(canAccessAdminArea({ user: { id: "u1", role: "SYSTEM_ADMIN" }, expires: "soon" })).toBe(true);
    expect(canAccessAdminArea({ user: { id: "u1", role: "TEAM_MEMBER" }, expires: "soon" })).toBe(false);
  });
});
