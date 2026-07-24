import "@testing-library/jest-dom/vitest";

process.env.DATABASE_URL ??= "postgresql://postgres:postgres@localhost:5432/pdms?schema=public";
process.env.NEXT_PUBLIC_APP_URL ??= "http://localhost:3000";
process.env.AUTH_URL ??= "http://localhost:3000";
process.env.AUTH_SECRET ??= "test-auth-secret-that-is-long-enough";
(process.env as Record<string, string>).NODE_ENV = "test";
