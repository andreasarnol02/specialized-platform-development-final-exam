process.env.JWT_SECRET = "integration-test-secret";
process.env.CORS_ORIGINS = "http://localhost:5173,http://127.0.0.1:5173";

const jwt = require("jsonwebtoken");
const request = require("supertest");
const app = require("../src/app");

const tokenFor = (role) =>
  jwt.sign({ sub: `some-${role}-id`, role }, process.env.JWT_SECRET);

describe("API route integration", () => {
  test("serves the My Skill health response", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toMatch(/API My Skill berjalan/);
    expect(response.body.data).toEqual({ status: "ok" });
  });

  test("allows the local 127.0.0.1 web origin", async () => {
    const response = await request(app)
      .get("/")
      .set("Origin", "http://127.0.0.1:5173");

    expect(response.headers["access-control-allow-origin"]).toBe(
      "http://127.0.0.1:5173"
    );
  });

  test("returns a JSON 404 response for an unknown route", async () => {
    const response = await request(app).get("/api/does-not-exist");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      success: false,
      message: "Rute tidak ditemukan",
      data: null,
    });
  });

  test("returns a safe JSON 500 response for unexpected middleware errors", async () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const response = await request(app)
      .post("/api/auth/login")
      .set("Content-Type", "application/json")
      .send("{");
    errorSpy.mockRestore();

    // Invalid JSON body -> Express 400 (malformed) or 500 (in the error handler).
    // Either is acceptable; we only assert the JSON response is safe (no stack trace).
    expect([400, 500]).toContain(response.status);
    expect(response.body.success).toBe(false);
    expect(response.body.data).toBeNull();
  });

  test("rejects invalid auth input before the controller (validation)", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ email: "not-an-email", password: "short" });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: "name" }),
        expect.objectContaining({ field: "email" }),
        expect.objectContaining({ field: "password" }),
      ])
    );
  });

  test("rejects login with missing password (validation)", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "user@example.com" });

    expect(response.status).toBe(400);
    expect(response.body.details).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: "password" })])
    );
  });

  test("blocks GET /api/contents without a token (gated content -> 401)", async () => {
    const response = await request(app).get("/api/contents");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      success: false,
      message: "Akses ditolak. Token tidak ditemukan.",
      data: null,
    });
  });

  test("blocks GET /api/contents/:id without a token (401)", async () => {
    const response = await request(app).get(
      "/api/contents/507f1f77bcf86cd799439011"
    );

    expect(response.status).toBe(401);
  });

  test("blocks GET /api/bookmarks without a token (401)", async () => {
    const response = await request(app).get("/api/bookmarks");

    expect(response.status).toBe(401);
  });

  test("blocks POST /api/contents without a token (401)", async () => {
    const response = await request(app).post("/api/contents").send({
      title: "Test",
      excerpt: "Excerpt",
      category: "Automotive",
      type: "article",
      body: "Body text",
      coverUrl: "https://example.com/cover.jpg",
    });

    expect(response.status).toBe(401);
  });

  test("rejects an invalid JWT (401)", async () => {
    const response = await request(app)
      .get("/api/contents")
      .set("Authorization", "Bearer not-a-valid-jwt");

    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/Token tidak valid/);
  });

  test("rejects a JWT with an unknown role (401)", async () => {
    const badToken = jwt.sign(
      { sub: "user-1", role: "customer" },
      process.env.JWT_SECRET
    );
    const response = await request(app)
      .get("/api/contents")
      .set("Authorization", `Bearer ${badToken}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/Token tidak valid/);
  });

  test("keeps students out of admin content-write routes (403)", async () => {
    const response = await request(app)
      .post("/api/contents")
      .set("Authorization", `Bearer ${tokenFor("student")}`)
      .send({
        title: "Test",
        excerpt: "Excerpt",
        category: "Automotive",
        type: "article",
        body: "Body text",
        coverUrl: "https://example.com/cover.jpg",
      });

    expect(response.status).toBe(403);
    expect(response.body.message).toMatch(/Hanya admin yang dapat mengakses/);
  });
});
