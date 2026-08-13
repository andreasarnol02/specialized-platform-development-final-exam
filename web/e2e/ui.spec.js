import { expect, test } from "@playwright/test";

// Fast UI tests with the API mocked at the route level (no API server / database).
// For a full E2E run against the real stack (API + MongoDB), use E2E_LIVE=1:
//   E2E_BASE_URL=http://127.0.0.1:5173 E2E_LIVE=1 npx playwright test e2e/full-journey.spec.js

const student = {
  id: "student-1",
  name: "Budi Uji",
  email: "budi@test.com",
  role: "student",
};

const contents = [
  {
    _id: "konten-1",
    title: "Cara Ganti Oli Mesin Motor",
    excerpt: "Panduan ganti oli sendiri.",
    category: "Automotive",
    type: "article",
    body: "Isi artikel.",
    coverUrl: "https://picsum.photos/seed/oli/600/400",
    durationMinutes: 12,
    isStudentProject: false,
    isPublished: true,
  },
];

test.beforeEach(async ({ page }) => {
  // Seed a fake session (token + user) so protected routes are accessible.
  await page.addInitScript((user) => {
    localStorage.setItem(
      "myskill_token",
      JSON.stringify({ token: "fake-token", user })
    );
  }, student);
  await page.route("**/api/auth/me", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: student }),
    })
  );
});

test("guest is redirected to sign in when opening a protected page", async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.removeItem("myskill_token"));
  await page.goto("/konten");

  await expect(page).toHaveURL(/\/login\?redirect=/);
  await expect(
    page.getByRole("heading", { name: "Masuk ke My Skill" })
  ).toBeVisible();
});

test("register page shows the sign-up form", async ({ page }) => {
  await page.goto("/register");

  await expect(
    page.getByRole("heading", { name: "Daftar untuk My Skill" })
  ).toBeVisible();
  await expect(page.getByPlaceholder("Nama kamu")).toBeVisible();
  await expect(page.getByPlaceholder("name@email.com")).toBeVisible();
  await expect(page.getByRole("button", { name: "Daftar" })).toBeVisible();
});

test("content list renders content cards from the API", async ({ page }) => {
  await page.route("**/api/contents**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: { contents, page: 1, pages: 1, total: 1 },
      }),
    })
  );

  await page.goto("/konten");

  await expect(page.getByText("Cara Ganti Oli Mesin Motor")).toBeVisible();
  await expect(page.getByText("Otomotif").first()).toBeVisible();
});

test("admin page rejects non-admin users", async ({ page }) => {
  await page.goto("/admin/konten");

  await expect(page).toHaveURL(/\/konten$/);
});

test("article detail page shows the content body", async ({ page }) => {
  await page.route("**/api/contents/konten-1", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: contents[0] }),
    })
  );

  await page.goto("/konten/konten-1");

  await expect(
    page.getByRole("heading", { level: 1, name: "Cara Ganti Oli Mesin Motor" })
  ).toBeVisible();
  await expect(page.getByText("Isi artikel.")).toBeVisible();
});
