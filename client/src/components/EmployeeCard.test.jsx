import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EmployeeCard from "./EmployeeCard";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const baseEmployee = {
  id: "1",
  firstName: "John",
  lastName: "Doe",
  position: "Software Engineer",
  department: "Engineering",
  isDeleted: false,
};

describe("EmployeeCard", () => {
  it("renders the employee's name, position and department", () => {
    render(<EmployeeCard employee={baseEmployee} onDelete={vi.fn()} onEdit={vi.fn()} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("Engineering")).toBeInTheDocument();
  });

  it("falls back to 'Remote' when department is missing", () => {
    render(
      <EmployeeCard
        employee={{ ...baseEmployee, department: undefined }}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />,
    );

    expect(screen.getByText("Remote")).toBeInTheDocument();
  });

  it("shows a DELETED badge and hides edit/delete actions when isDeleted is true", () => {
    render(
      <EmployeeCard
        employee={{ ...baseEmployee, isDeleted: true }}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />,
    );

    expect(screen.getByText("DELETED")).toBeInTheDocument();
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("calls window.confirm with the corrected (typo-free) confirmation message when delete is clicked", async () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);
    const user = userEvent.setup();

    render(<EmployeeCard employee={baseEmployee} onDelete={vi.fn()} onEdit={vi.fn()} />);

    const buttons = screen.getAllByRole("button");
    // Second button in the hover overlay is the delete button (edit is first).
    await user.click(buttons[1]);

    expect(confirmSpy).toHaveBeenCalledTimes(1);
    expect(confirmSpy).toHaveBeenCalledWith(
      "Are you sure you want to delete this employee?",
    );
    // Ensure the old typo'd message is not what gets shown.
    expect(confirmSpy).not.toHaveBeenCalledWith(
      expect.stringContaining("em[ployee"),
    );
  });

  it("calls onEdit with the employee when the edit button is clicked", async () => {
    const onEdit = vi.fn();
    const user = userEvent.setup();

    render(<EmployeeCard employee={baseEmployee} onDelete={vi.fn()} onEdit={onEdit} />);

    const buttons = screen.getAllByRole("button");
    await user.click(buttons[0]);

    expect(onEdit).toHaveBeenCalledWith(baseEmployee);
  });
});