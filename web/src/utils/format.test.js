import { formatDate, formatDuration } from "./format";

describe("formatDuration", () => {
  test("formats minutes with Indonesian labels", () => {
    expect(formatDuration(5)).toBe("5 menit");
    expect(formatDuration(45)).toBe("45 menit");
  });

  test("formats hour spans", () => {
    expect(formatDuration(60)).toBe("1 jam");
    expect(formatDuration(90)).toBe("1 jam 30 menit");
    expect(formatDuration(125)).toBe("2 jam 5 menit");
  });

  test("returns empty string for missing or invalid values", () => {
    expect(formatDuration(null)).toBe("");
    expect(formatDuration(undefined)).toBe("");
    expect(formatDuration(0)).toBe("");
    expect(formatDuration(-3)).toBe("");
  });
});

describe("formatDate", () => {
  test("formats dates with the Indonesian locale", () => {
    const value = formatDate("2026-08-13T09:30:00.000Z");
    expect(value).toContain("2026");
    expect(value).toContain("Agu");
  });

  test("returns empty string for invalid values", () => {
    expect(formatDate(null)).toBe("");
    expect(formatDate("not-a-date")).toBe("");
  });
});
