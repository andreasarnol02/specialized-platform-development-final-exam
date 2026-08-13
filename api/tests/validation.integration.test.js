const express = require("express");
const { matchedData } = require("express-validator");
const request = require("supertest");
const validate = require("../src/middleware/validation");
const {
  contentFields,
  contentUpdate,
  contentQuery,
  register,
  login,
} = require("../src/routes/validators");

const app = express();
app.use(express.json());

// Mount validator + validate middleware + echo handler.
app.post("/contents", contentFields, validate, (req, res) => {
  res.status(200).json({ success: true, message: "ok", data: req.body });
});
app.put("/contents/:id", contentUpdate, validate, (req, res) => {
  res.status(200).json({ success: true, message: "ok", data: req.body });
});
app.get("/contents", contentQuery, validate, (req, res) => {
  res.status(200).json({
    success: true,
    message: "ok",
    data: matchedData(req, { locations: ["query"] }),
  });
});
app.post("/auth/register", register, validate, (req, res) => {
  res.status(200).json({ success: true, message: "ok", data: req.body });
});
app.post("/auth/login", login, validate, (req, res) => {
  res.status(200).json({ success: true, message: "ok", data: req.body });
});

const validArticleBase = {
  title: "How to Change Motorcycle Engine Oil",
  excerpt: "A short excerpt",
  category: "Automotive",
  type: "article",
  body: "A few paragraphs about changing oil...",
  coverUrl: "https://picsum.photos/seed/cara-ganti-oli/600/400",
};

const validVideoBase = {
  title: "Building a Simple LED Lamp",
  excerpt: "A short excerpt",
  category: "Electronics",
  type: "video",
  videoUrl: "https://www.youtube.com/watch?v=abc123",
  coverUrl: "https://picsum.photos/seed/led/600/400",
};

describe("request validation", () => {
  test("article without body -> 400", async () => {
    const response = await request(app)
      .post("/contents")
      .send({ ...validArticleBase, body: undefined });

    expect(response.status).toBe(400);
    expect(response.body.details).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: "body" })])
    );
  });

  test("video without videoUrl -> 400", async () => {
    const response = await request(app)
      .post("/contents")
      .send({ ...validVideoBase, videoUrl: undefined });

    expect(response.status).toBe(400);
    expect(response.body.details).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: "videoUrl" })])
    );
  });

  test("bad category -> 400", async () => {
    const response = await request(app)
      .post("/contents")
      .send({ ...validArticleBase, category: "Fake Category" });

    expect(response.status).toBe(400);
    expect(response.body.details).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: "category" })])
    );
  });

  test("bad type -> 400", async () => {
    const response = await request(app)
      .post("/contents")
      .send({ ...validArticleBase, type: "podcast" });

    expect(response.status).toBe(400);
    expect(response.body.details).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: "type" })])
    );
  });

  test("invalid coverUrl -> 400", async () => {
    const response = await request(app)
      .post("/contents")
      .send({ ...validArticleBase, coverUrl: "not-a-url" });

    expect(response.status).toBe(400);
    expect(response.body.details).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: "coverUrl" })])
    );
  });

  test("missing excerpt -> 400", async () => {
    const response = await request(app)
      .post("/contents")
      .send({ ...validArticleBase, excerpt: undefined });

    expect(response.status).toBe(400);
    expect(response.body.data).toBeNull();
  });

  test("valid article passes validation -> 200", async () => {
    const response = await request(app)
      .post("/contents")
      .send(validArticleBase);

    expect(response.status).toBe(200);
  });

  test("valid video passes validation -> 200", async () => {
    const response = await request(app).post("/contents").send(validVideoBase);

    expect(response.status).toBe(200);
  });

  test("register rejects short password (< 8) -> 400", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({
        name: "Student A",
        email: "student@example.com",
        password: "short",
      });

    expect(response.status).toBe(400);
    expect(response.body.details).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: "password" })])
    );
  });

  test("register rejects invalid email -> 400", async () => {
    const response = await request(app).post("/auth/register").send({
      name: "Student A",
      email: "not-an-email",
      password: "password123",
    });

    expect(response.status).toBe(400);
    expect(response.body.details).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: "email" })])
    );
  });

  test("login with missing email and password -> 400", async () => {
    const response = await request(app).post("/auth/login").send({});

    expect(response.status).toBe(400);
    expect(response.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: "email" }),
        expect.objectContaining({ field: "password" }),
      ])
    );
  });

  test("coerces page query value before the controller", async () => {
    const response = await request(app).get("/contents?page=2");

    expect(response.status).toBe(200);
    expect(response.body.data.page).toBe(2);
  });

  test("rejects page=0 -> 400", async () => {
    const response = await request(app).get("/contents?page=0");

    expect(response.status).toBe(400);
  });
});
