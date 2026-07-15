import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { format } from "date-fns";
import AttendanceHistory from "./AttendanceHistory";
import { getDayTypeDisplay, getWorkingHoursDisplay } from "../../assets/assets";

afterEach(() => {
  cleanup();
});

const presentRecord = {
  _id: "r1",
  date: "2026-03-14T18:30:00.000Z",
  checkIn: "2026-03-15T10:42:33.966Z",
  checkOut: "2026-03-15T18:42:37.476Z",
  status: "PRESENT",
  workingHours: 8,
  dayType: "Full Day",
};

const lateRecord = {
  _id: "r2",
  date: "2026-03-13T18:30:00.000Z",
  checkIn: "2026-03-14T13:48:41.416Z",
  checkOut: "2026-03-14T21:48:42.430Z",
  status: "LATE",
  workingHours: 8,
  dayType: "Full Day",
};

const inProgressRecord = {
  _id: "r3",
  date: "2026-03-16T18:30:00.000Z",
  checkIn: "2026-03-17T09:00:00.000Z",
  checkOut: null,
  status: "PRESENT",
  workingHours: null,
  dayType: null,
};

const absentRecord = {
  _id: "r4",
  date: "2026-03-17T18:30:00.000Z",
  checkIn: null,
  checkOut: null,
  status: "ABSENT",
  workingHours: null,
  dayType: null,
};

describe("AttendanceHistory", () => {
  it("renders the table column headers", () => {
    render(<AttendanceHistory history={[]} />);

    ["Date", "Check In", "Check Out", "Working Hours", "Day Type", "Status"].forEach(
      (header) => {
        expect(screen.getByText(header)).toBeInTheDocument();
      },
    );
  });

  it("renders 'No Records Found' spanning all columns when history is empty", () => {
    const { container } = render(<AttendanceHistory history={[]} />);

    expect(screen.getByText("No Records Found")).toBeInTheDocument();
    const cell = container.querySelector("td[colspan='6']");
    expect(cell).not.toBeNull();
  });

  it("formats date, check-in and check-out using date-fns for a complete record", () => {
    render(<AttendanceHistory history={[presentRecord]} />);

    expect(
      screen.getByText(format(new Date(presentRecord.date), "MMM dd, yyyy")),
    ).toBeInTheDocument();
    expect(
      screen.getByText(format(new Date(presentRecord.checkIn), "hh:mm a")),
    ).toBeInTheDocument();
    expect(
      screen.getByText(format(new Date(presentRecord.checkOut), "hh:mm a")),
    ).toBeInTheDocument();
  });

  it("shows a '-' placeholder for missing check-out (still checked in)", () => {
    render(<AttendanceHistory history={[inProgressRecord]} />);

    expect(
      screen.getByText(format(new Date(inProgressRecord.checkIn), "hh:mm a")),
    ).toBeInTheDocument();
    // checkOut cell falls back to "-"
    const dashCells = screen.getAllByText("-");
    expect(dashCells.length).toBeGreaterThan(0);
  });

  it("shows '-' for both check-in and check-out when a record has neither", () => {
    render(<AttendanceHistory history={[absentRecord]} />);

    const dashCells = screen.getAllByText("-");
    // one for checkIn, one for checkOut
    expect(dashCells.length).toBeGreaterThanOrEqual(2);
  });

  it("renders the working hours display returned by getWorkingHoursDisplay", () => {
    render(<AttendanceHistory history={[presentRecord]} />);

    expect(
      screen.getByText(getWorkingHoursDisplay(presentRecord)),
    ).toBeInTheDocument();
  });

  it("renders the day type badge with the label and class from getDayTypeDisplay", () => {
    render(<AttendanceHistory history={[presentRecord]} />);

    const { label, className } = getDayTypeDisplay(presentRecord);
    const badge = screen.getByText(label);
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain("badge");
    className.split(" ").filter(Boolean).forEach((cls) => {
      expect(badge.className).toContain(cls);
    });
  });

  it("applies badge-success class for PRESENT status", () => {
    render(<AttendanceHistory history={[presentRecord]} />);
    const statusBadge = screen.getByText("PRESENT");
    expect(statusBadge.className).toContain("badge-success");
  });

  it("applies badge-warning class for LATE status", () => {
    render(<AttendanceHistory history={[lateRecord]} />);
    const statusBadge = screen.getByText("LATE");
    expect(statusBadge.className).toContain("badge-warning");
  });

  it("applies badge-danger class for any other status", () => {
    render(<AttendanceHistory history={[absentRecord]} />);
    const statusBadge = screen.getByText("ABSENT");
    expect(statusBadge.className).toContain("badge-danger");
  });

  it("renders one row per history record", () => {
    const { container } = render(
      <AttendanceHistory history={[presentRecord, lateRecord, absentRecord]} />,
    );
    const rows = container.querySelectorAll("tbody tr");
    expect(rows).toHaveLength(3);
  });
});