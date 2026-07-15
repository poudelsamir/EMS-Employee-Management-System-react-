import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, act } from "@testing-library/react";
import Attendance from "./Attendance";
import { dummyAttendanceData } from "../assets/assets";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const renderAndFinishLoading = async () => {
  render(<Attendance />);
  await act(async () => {
    vi.advanceTimersByTime(1000);
  });
};

describe("Attendance page", () => {
  it("shows a loading state before data has been fetched", () => {
    const { container } = render(<Attendance />);

    expect(screen.queryByText("Attendance")).not.toBeInTheDocument();
    expect(container.querySelector(".animate-spin")).not.toBeNull();
  });

  it("renders the page header, stats and history once loading completes", async () => {
    await renderAndFinishLoading();

    expect(screen.getByText("Attendance")).toBeInTheDocument();
    expect(
      screen.getByText("Track your work hours and daily check-ins"),
    ).toBeInTheDocument();
    // AttendanceStats
    expect(screen.getByText("Days Present")).toBeInTheDocument();
    // AttendanceHistory renders a row per dummy record
    expect(screen.getByText("Recent Activity")).toBeInTheDocument();
  });

  it("shows the CheckInButton (not the deleted-employee notice) by default", async () => {
    await renderAndFinishLoading();

    expect(
      screen.queryByText(/employee records have been marked as deleted/i),
    ).not.toBeInTheDocument();
  });

  it("shows 'Clock In' when there is no attendance record for today", async () => {
    // Ensure "today" does not coincide with any of the dummy data dates.
    vi.setSystemTime(new Date("2099-01-01T00:00:00.000Z"));

    await renderAndFinishLoading();

    expect(screen.getByText("Clock In")).toBeInTheDocument();
  });

  it("passes today's matching record to CheckInButton so it reflects a completed day", async () => {
    // Pin "now" to the same moment as an existing dummy record's date so
    // the page's todayRecord lookup finds a match.
    vi.setSystemTime(new Date(dummyAttendanceData[0].date));

    await renderAndFinishLoading();

    // dummyAttendanceData[0] already has a checkOut, so the button area
    // should render the "Work Day Completed" state instead of Clock In/Out.
    expect(screen.getByText("Work Day Completed")).toBeInTheDocument();
  });
});