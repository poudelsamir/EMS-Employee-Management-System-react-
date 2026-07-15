import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Sidebar from "./Sidebar";

afterEach(() => {
  cleanup();
});

const renderSidebar = (initialPath = "/dashboard") =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Sidebar />
    </MemoryRouter>,
  );

describe("Sidebar", () => {
  it("shows the Attendance nav item (not Employees) since role resolves to EMPLOYEE", () => {
    renderSidebar();

    // Rendered once for desktop, once for mobile.
    expect(screen.getAllByText("Attendance").length).toBeGreaterThan(0);
    expect(screen.queryByText("Employees")).not.toBeInTheDocument();
  });

  it("labels the current user as 'Employee' rather than 'Administrator'", async () => {
    renderSidebar();

    await waitFor(() => {
      expect(screen.getAllByText("Employee").length).toBeGreaterThan(0);
    });
    expect(screen.queryByText("Administrator")).not.toBeInTheDocument();
  });

  it("always renders the common nav items (Leave, Payslips, Settings)", () => {
    renderSidebar();

    expect(screen.getAllByText("Leave").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Payslips").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Settings").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Dashboard").length).toBeGreaterThan(0);
  });
});