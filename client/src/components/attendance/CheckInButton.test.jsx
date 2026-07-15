import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent, act } from "@testing-library/react";
import CheckInButton from "./CheckInButton";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("CheckInButton", () => {
  it("shows the 'Work Day Completed' message and no button when today's record has a checkOut", () => {
    render(<CheckInButton todayRecord={{ checkOut: "2026-03-15T18:42:37.476Z" }} onAction={vi.fn()} />);

    expect(screen.getByText("Work Day Completed")).toBeInTheDocument();
    expect(screen.getByText(/Great job! See you tommorrow/)).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("shows 'Clock In' when there is no today's record", () => {
    render(<CheckInButton todayRecord={undefined} onAction={vi.fn()} />);

    expect(screen.getByText("Clock In")).toBeInTheDocument();
    expect(screen.getByText("Start your work day")).toBeInTheDocument();
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  it("shows 'Clock Out' when the employee is currently checked in but hasn't checked out", () => {
    render(
      <CheckInButton todayRecord={{ isCheckedIn: true }} onAction={vi.fn()} />,
    );

    expect(screen.getByText("Clock Out")).toBeInTheDocument();
    expect(screen.getByText("Click to end your shift")).toBeInTheDocument();
  });

  it("shows a loading state and disables the button while the action is processing", () => {
    render(<CheckInButton todayRecord={undefined} onAction={vi.fn()} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(screen.getByText("Proessing...")).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it("calls onAction and clears the loading state after the simulated delay completes", () => {
    const onAction = vi.fn();
    render(<CheckInButton todayRecord={undefined} onAction={onAction} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(onAction).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(onAction).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Clock In")).toBeInTheDocument();
    expect(screen.getByRole("button")).not.toBeDisabled();
  });
});