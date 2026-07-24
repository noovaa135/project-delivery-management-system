import { describe, expect, it } from "vitest";

import { validateEnv } from "@/config/env";

describe("environment validation", () => {
  it("accepts required foundation environment variables", () => {
    const env = validateEnv({
      DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/pdms?schema=public",
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
      AUTH_URL: "http://localhost:3000",
      AUTH_SECRET: "test-auth-secret-that-is-long-enough",
      NODE_ENV: "test",
    });

    expect(env.NODE_ENV).toBe("test");
    expect(env.DATABASE_URL).toContain("postgresql://");
  });

  it("rejects short auth secrets", () => {
    expect(() =>
      validateEnv({
        DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/pdms?schema=public",
        NEXT_PUBLIC_APP_URL: "http://localhost:3000",
        AUTH_URL: "http://localhost:3000",
        AUTH_SECRET: "short",
        NODE_ENV: "test",
      }),
    ).toThrow();
  });
});
