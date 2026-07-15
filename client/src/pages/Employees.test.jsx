import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Employees from "./Employees";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const renderEmployees = () =>
  render(
    <MemoryRouter>
      <Employees />
    </MemoryRouter>,
  );

const finishLoading = async () => {
  await act(async () => {
    vi.advanceTimersByTime(1000);
  });
};

describe("Employees page", () => {
  it("fetches and displays all employees on initial mount", async () => {
    renderEmployees();
    await finishLoading();

    expect(screen.getByText("David Michael")).toBeInTheDocument();
    expect(screen.getByText("Alex Matthew")).toBeInTheDocument();
    expect(screen.getAllByText("John Doe").length).toBeGreaterThan(0);
  });

  it("re-fetches and filters the employee list when the department filter changes", async () => {
    renderEmployees();
    await finishLoading();

    // Sanity check: unfiltered list contains employees from multiple departments.
    expect(screen.getByText("David Michael")).toBeInTheDocument();
    expect(screen.getByText("Alex Matthew")).toBeInTheDocument();

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "IT Support" } });

    await finishLoading();

    expect(screen.getByText("David Michael")).toBeInTheDocument();
    expect(screen.queryByText("Alex Matthew")).not.toBeInTheDocument();
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
  });

  it("shows the 'No employees found' message when the selected department has no employees", async () => {
    renderEmployees();
    await finishLoading();

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "Finance" } });

    await finishLoading();

    expect(screen.getByText("No employees found")).toBeInTheDocument();
  });

  it("resets to the full employee list when the department filter is cleared", async () => {
    renderEmployees();
    await finishLoading();

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "IT Support" } });
    await finishLoading();
    expect(screen.queryByText("Alex Matthew")).not.toBeInTheDocument();

    fireEvent.change(select, { target: { value: "" } });
    await finishLoading();

    expect(screen.getByText("Alex Matthew")).toBeInTheDocument();
    expect(screen.getByText("David Michael")).toBeInTheDocument();
  });

  it("shows a loading spinner while re-fetching after a department change", async () => {
    const { container } = renderEmployees();
    await finishLoading();
    expect(container.querySelector(".animate-spin")).toBeNull();

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "IT Support" } });

    // Immediately after the change, loading should be true again (before timers advance).
    expect(container.querySelector(".animate-spin")).not.toBeNull();

    await finishLoading();
    expect(container.querySelector(".animate-spin")).toBeNull();
  });
});