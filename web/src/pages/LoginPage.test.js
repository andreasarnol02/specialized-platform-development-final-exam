import { getSafeRedirect } from "./LoginPage";

describe("getSafeRedirect", () => {
  test("allows internal paths", () => {
    expect(getSafeRedirect("/konten/123")).toBe("/konten/123");
    expect(getSafeRedirect("/admin/konten/baru")).toBe("/admin/konten/baru");
  });

  test("rejects external and malformed redirects", () => {
    expect(getSafeRedirect("//evil.example")).toBe("/");
    expect(getSafeRedirect("%2F%2Fevil.example")).toBe("/");
    expect(getSafeRedirect("%E0%A4%A")).toBe("/");
  });
});
