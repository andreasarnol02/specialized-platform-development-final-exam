jest.mock("../src/models/content", () => ({
  findById: jest.fn(),
}));

const Content = require("../src/models/content");
const {
  updateContent,
  deleteContent,
} = require("../src/controllers/contentController");

const makeResponse = () => {
  const response = {
    status: jest.fn(),
    json: jest.fn(),
  };
  response.status.mockReturnValue(response);
  return response;
};

const makeContent = (createdBy = "admin-1") => ({
  _id: "content-a",
  title: "How to Change Engine Oil",
  excerpt: "Excerpt",
  category: "Automotive",
  type: "article",
  body: "Old body",
  coverUrl: "https://example.com/cover.jpg",
  isPublished: true,
  createdBy,
  toObject() {
    return { ...this };
  },
  save: jest.fn().mockResolvedValue(undefined),
});

describe("content controller — admin ownership & gating", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("update returns 404 when content is missing", async () => {
    Content.findById.mockResolvedValue(null);
    const res = makeResponse();

    await updateContent(
      {
        user: { id: "admin-1", role: "admin" },
        params: { id: "missing" },
        body: { title: "Updated" },
      },
      res
    );

    expect(Content.findById).toHaveBeenCalledWith("missing");
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, data: null })
    );
  });

  test("update mutates content and saves it", async () => {
    const content = makeContent("admin-1");
    Content.findById.mockResolvedValue(content);
    const res = makeResponse();

    await updateContent(
      {
        user: { id: "admin-1", role: "admin" },
        params: { id: "content-a" },
        body: { title: "New Title", excerpt: "New excerpt" },
      },
      res
    );

    expect(content.title).toBe("New Title");
    expect(content.save).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, data: content })
    );
  });

  test("delete soft deletes (sets isPublished false) and keeps the document", async () => {
    const content = makeContent("admin-1");
    Content.findById.mockResolvedValue(content);
    const res = makeResponse();

    await deleteContent(
      { user: { id: "admin-1", role: "admin" }, params: { id: "content-a" } },
      res
    );

    expect(content.isPublished).toBe(false);
    expect(content.save).toHaveBeenCalledWith({ validateBeforeSave: false });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: expect.stringContaining("disembunyikan"),
      })
    );
  });

  test("delete returns 404 when content is missing", async () => {
    Content.findById.mockResolvedValue(null);
    const res = makeResponse();

    await deleteContent(
      { user: { id: "admin-1", role: "admin" }, params: { id: "missing" } },
      res
    );

    expect(res.status).toHaveBeenCalledWith(404);
  });
});
