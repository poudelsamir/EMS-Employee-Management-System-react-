import { describe, it, expect } from "vitest";
import { dummyAttendanceData } from "./assets";

describe("dummyAttendanceData", () => {
  it("includes the newly added LATE attendance record", () => {
    const record = dummyAttendanceData.find(
      (r) => r._id === "69ab415b9f8a807df391d7bcc",
    );

    expect(record).toBeDefined();
    expect(record).toMatchObject({
      employeeId: "69b411e6f8a807df391d7b13",
      status: "LATE",
      workingHours: 8,
      dayType: "Full Day",
    });
  });

  it("has a valid date, checkIn and checkOut for the new record", () => {
    const record = dummyAttendanceData.find(
      (r) => r._id === "69ab415b9f8a807df391d7bcc",
    );

    expect(new Date(record.date).toString()).not.toBe("Invalid Date");
    expect(new Date(record.checkIn).toString()).not.toBe("Invalid Date");
    expect(new Date(record.checkOut).toString()).not.toBe("Invalid Date");
    expect(new Date(record.checkOut).getTime()).toBeGreaterThan(
      new Date(record.checkIn).getTime(),
    );
  });

  it("contains at least one PRESENT and one LATE record for stats/history tests", () => {
    const statuses = dummyAttendanceData.map((r) => r.status);
    expect(statuses).toContain("PRESENT");
    expect(statuses).toContain("LATE");
  });
});