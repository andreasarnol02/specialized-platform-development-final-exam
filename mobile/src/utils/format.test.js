import { formatDate, formatDuration, getInitial } from "./format";

describe("formatDate", () => {
  it("formats a local date as an id-ID short date", () => {
    expect(formatDate(new Date(2026, 7, 9, 14, 5))).toBe("9 Agu 2026");
  });

  it("returns an empty string for invalid values", () => {
    expect(formatDate(null)).toBe("");
    expect(formatDate("not-a-date")).toBe("");
  });
});

describe("getInitial", () => {
  it("returns the first character, uppercased", () => {
    expect(getInitial("andi")).toBe("A");
  });

  it("falls back to A for empty names", () => {
    expect(getInitial("")).toBe("A");
    expect(getInitial(null)).toBe("A");
  });
});

describe("formatDuration", () => {
  it("formats minutes only", () => {
    expect(formatDuration(45)).toBe("45 menit");
  });

  it("formats hours and minutes", () => {
    expect(formatDuration(90)).toBe("1 jam 30 menit");
  });

  it("formats whole hours", () => {
    expect(formatDuration(120)).toBe("2 jam");
  });

  it("returns an empty string for zero or missing values", () => {
    expect(formatDuration(0)).toBe("");
    expect(formatDuration(null)).toBe("");
    expect(formatDuration(undefined)).toBe("");
  });
});
