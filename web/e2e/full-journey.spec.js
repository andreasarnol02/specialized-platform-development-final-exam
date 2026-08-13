import { expect, test } from "@playwright/test";

// Full E2E: browser → web app → real API → MongoDB.
// Prerequisites: API running (PORT 4000, MONGODB_URI set) + web dev server running.
// Run:
//   E2E_BASE_URL=http://127.0.0.1:5173 E2E_LIVE=1 npx playwright test e2e/full-journey.spec.js

const ADMIN_EMAIL = "admin@myskill.test";
const ADMIN_PASSWORD = "admin1234";

test("complete student + admin journey", async ({ page }) => {
  test.skip(!process.env.E2E_LIVE, "needs the real stack — set E2E_LIVE=1");

  const email = `student-${Date.now()}@test.com`;

  // 1. Register a new student
  await page.goto("/register");
  await page.getByPlaceholder("Nama kamu").fill("Budi Uji");
  await page.getByPlaceholder("name@email.com").fill(email);
  await page.locator('input[name="password"]').fill("rahasia123");
  await page.getByRole("button", { name: "Daftar" }).click();

  await expect(page).toHaveURL("/");
  await expect(page.getByText(/Halo, Budi/)).toBeVisible();

  // 2. Home page: categories + content cards
  await expect(page.getByText("Otomotif").first()).toBeVisible();
  await expect(page.locator("a.content-card").first()).toBeVisible();

  // 3. Content list
  await page.goto("/konten");
  await expect(page.locator("a.content-card").first()).toBeVisible();

  // 4. Content detail + bookmark
  await page.locator("a.content-card").first().click();
  await expect(page).toHaveURL(/\/konten\/[a-f0-9]{24}/);
  await expect(page.locator("article")).toBeVisible(); // detail finished rendering
  const detailTitle = await page.locator("h1").innerText();
  await expect(
    page.getByRole("heading", { level: 1, name: detailTitle })
  ).toBeVisible();

  const saveBtn = page.getByRole("button", { name: "Simpan ke bookmark" });
  await expect(saveBtn).toBeVisible();
  await saveBtn.click();
  await expect(
    page.getByRole("button", { name: "Hapus dari bookmark" })
  ).toBeVisible({ timeout: 10_000 });

  // 5. Bookmarks page shows the saved content
  await page.goto("/bookmark");
  await expect(page.getByText(detailTitle)).toBeVisible();

  // 6. Logout
  await page.getByRole("button", { name: "Keluar" }).click();
  await expect(page).toHaveURL(/\/login/);

  // 7. Admin login → create new content
  await page.getByPlaceholder("name@email.com").fill(ADMIN_EMAIL);
  await page.locator('input[name="password"]').fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Masuk" }).click();
  // Login returns to the previous page (redirect) — check the admin session, not the URL.
  await expect(
    page.getByRole("link", { name: "Kelola Konten" })
  ).toBeVisible();

  await page.goto("/admin/konten");
  await page
    .getByRole("link", { name: /Konten Baru/ })
    .first()
    .click();

  const newTitle = `Content E2E ${Date.now()}`;
  await page.locator('input[name="title"]').fill(newTitle);
  await page
    .locator('textarea[name="excerpt"]')
    .fill("Created by the E2E test.");
  await page.locator('select[name="category"]').selectOption("Automotive");
  await page.locator('select[name="type"]').selectOption("article");
  await page
    .locator('textarea[name="body"]')
    .fill("Article body from the E2E test.");
  await page
    .locator('input[name="coverUrl"]')
    .fill("https://picsum.photos/seed/e2e/600/400");
  await page.getByRole("button", { name: "Simpan Konten" }).click();

  await expect(page).toHaveURL(/\/admin\/konten$/);
  const row = page.locator(".admin-table-row", { hasText: newTitle });
  await expect(row).toBeVisible();
  await expect(row.getByText("Terbit")).toBeVisible();

  // 8. Admin unpublishes the content (soft delete)
  await row.getByRole("button", { name: "Turunkan" }).click();
  await expect(row.getByText("Belum Terbit")).toBeVisible();

  // 9. Logout admin, log in as the student again → unpublished content must not show
  await page.getByRole("button", { name: "Keluar" }).click();
  await page.getByPlaceholder("name@email.com").fill(email);
  await page.locator('input[name="password"]').fill("rahasia123");
  await page.getByRole("button", { name: "Masuk" }).click();
  await expect(page.getByRole("button", { name: "Keluar" })).toBeVisible();

  await page.goto(`/konten?search=${encodeURIComponent(newTitle)}`);
  // Unpublished content must not appear as a result card
  // (the title still appears in the "Search results for: ..." pill).
  await expect(
    page.locator("a.content-card", { hasText: newTitle })
  ).toHaveCount(0);
});
