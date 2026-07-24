import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AppShell } from "@/components/app-shell";

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

vi.mock("next-auth/react", () => ({
  signOut: vi.fn(),
}));

vi.mock("@/components/theme-provider", () => ({
  useTheme: () => ({ theme: "light", toggleTheme: vi.fn(), setTheme: vi.fn() }),
}));

describe("application shell", () => {
  it("renders primary navigation placeholders and workspace label", () => {
    render(
      <AppShell user={{ name: "Admin User", email: "admin@example.com", organizationName: "Default Workspace" }}>
        <div>Overview content</div>
      </AppShell>,
    );

    expect(screen.getByLabelText("Main navigation")).toBeInTheDocument();
    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("Invoices")).toBeInTheDocument();
    expect(screen.getByText("Team")).toBeInTheDocument();
    expect(screen.getByText("Overview content")).toBeInTheDocument();
  });
});
