import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { OverviewDashboard } from "@/components/overview-dashboard";

describe("overview dashboard", () => {
  it("renders the premium dashboard with all sections", () => {
    render(
      <OverviewDashboard
        userName="Maya"
        metrics={{
          activeProjects: 5,
          tasksDue: 12,
          upcomingMilestones: 3,
          projectHealth: 80,
        }}
        activities={[]}
        progress={[]}
      />,
    );

    expect(screen.getByRole("heading", { name: /welcome back, maya/i })).toBeInTheDocument();
    expect(screen.getByText("Active Projects")).toBeInTheDocument();
    expect(screen.getByText("Tasks Due")).toBeInTheDocument();
    expect(screen.getByText("Upcoming Milestones")).toBeInTheDocument();
    expect(screen.getByText("Project Health")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /recent activity/i })).toBeInTheDocument();
  });
});
