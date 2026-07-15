import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import AttendanceStats from "./AttendanceStats";

afterEach(() => {
  cleanup();
});

describe("AttendanceStats", () => {
  it("renders all three stat labels", () => {
    render(<AttendanceStats history={[]} />);

    expect(screen.getByText("Days Present")).toBeInTheDocument();
    expect(screen.getByText("Late Arrival")).toBeInTheDocument();
    expect(screen.getByText("Avg. Work Hrs")).toBeInTheDocument();
  });

  it("shows 0 for present/late counts when history is empty", () => {
    render(<AttendanceStats history={[]} />);

    const zeros = screen.getAllByText("0");
    expect(zeros).toHaveLength(2);
  });

  it("counts PRESENT and LATE records towards 'Days Present'", () => {
    const history = [
      { status: "PRESENT" },
      { status: "PRESENT" },
      { status: "LATE" },
      { status: "ABSENT" },
    ];

    render(<AttendanceStats history={history} />);

    // 2 PRESENT + 1 LATE = 3 days present
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("only counts LATE records for 'Late Arrival'", () => {
    const history = [
      { status: "PRESENT" },
      { status: "LATE" },
      { status: "LATE" },
      { status: "ABSENT" },
    ];

    render(<AttendanceStats history={history} />);

    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("always displays a static average of '8.5 Hrs' regardless of history contents", () => {
    render(
      <AttendanceStats
        history={[{ status: "PRESENT" }, { status: "LATE" }]}
      />,
    );

    expect(screen.getByText("8.5 Hrs")).toBeInTheDocument();
  });

  it("renders three stat cards", () => {
    const { container } = render(<AttendanceStats history={[]} />);
    // one icon per stat card
    expect(container.querySelectorAll("svg")).toHaveLength(3);
  });
});