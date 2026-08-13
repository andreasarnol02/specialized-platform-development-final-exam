jest.mock("../src/models/bookmark", () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  findOneAndDelete: jest.fn(),
}));

jest.mock("../src/models/content", () => ({
  findOne: jest.fn(),
}));

const Bookmark = require("../src/models/bookmark");
const Content = require("../src/models/content");
const {
  getMyBookmarks,
  toggleBookmark,
  removeBookmark,
} = require("../src/controllers/bookmarkController");

const makeResponse = () => {
  const response = {
    status: jest.fn(),
    json: jest.fn(),
  };
  response.status.mockReturnValue(response);
  return response;
};

const makeFindQuery = (result) => {
  const query = {
    populate: jest.fn(),
    sort: jest.fn(),
  };
  query.populate.mockReturnValue(query);
  query.sort.mockResolvedValue(result);
  return query;
};

describe("bookmark controller — toggle, duplicates, ownership", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("getMyBookmarks returns bookmarks belonging to req.user.id, newest first", async () => {
    const bookmarks = [
      {
        _id: "bm-1",
        content: { _id: "c-1", title: "A" },
        createdAt: new Date(),
      },
    ];
    Bookmark.find.mockReturnValue(makeFindQuery(bookmarks));
    const res = makeResponse();

    await getMyBookmarks({ user: { id: "user-a" } }, res);

    expect(Bookmark.find).toHaveBeenCalledWith({ user: "user-a" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({ bookmarks: expect.any(Array) }),
      })
    );
  });

  test("toggle returns 404 when content does not exist or is not published", async () => {
    Content.findOne.mockResolvedValue(null);
    const res = makeResponse();

    await toggleBookmark(
      { user: { id: "user-a" }, params: { contentId: "content-x" } },
      res
    );

    expect(Content.findOne).toHaveBeenCalledWith({
      _id: "content-x",
      isPublished: true,
    });
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("toggle creates a new bookmark when none exists (saved:true)", async () => {
    Content.findOne.mockResolvedValue({ _id: "c-1", isPublished: true });
    Bookmark.findOne.mockResolvedValue(null);
    const created = {
      _id: "bm-1",
      content: "c-1",
      user: "user-a",
      createdAt: new Date(),
    };
    Bookmark.create.mockResolvedValue(created);
    const res = makeResponse();

    await toggleBookmark(
      { user: { id: "user-a" }, params: { contentId: "c-1" } },
      res
    );

    expect(Bookmark.findOne).toHaveBeenCalledWith({
      user: "user-a",
      content: "c-1",
    });
    expect(Bookmark.create).toHaveBeenCalledWith({
      user: "user-a",
      content: "c-1",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({ saved: true }),
      })
    );
  });

  test("toggle is idempotent: existing bookmark returns saved:true with no duplicate create", async () => {
    Content.findOne.mockResolvedValue({ _id: "c-1", isPublished: true });
    const existing = { _id: "bm-1", content: "c-1", user: "user-a" };
    Bookmark.findOne.mockResolvedValue(existing);
    const res = makeResponse();

    await toggleBookmark(
      { user: { id: "user-a" }, params: { contentId: "c-1" } },
      res
    );

    expect(Bookmark.create).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({ saved: true }),
      })
    );
  });

  test("remove deletes the bookmark owned by req.user.id and returns saved:false", async () => {
    const removed = { _id: "bm-1", content: "c-1", user: "user-a" };
    Bookmark.findOneAndDelete.mockResolvedValue(removed);
    const res = makeResponse();

    await removeBookmark(
      { user: { id: "user-a" }, params: { contentId: "c-1" } },
      res
    );

    expect(Bookmark.findOneAndDelete).toHaveBeenCalledWith({
      user: "user-a",
      content: "c-1",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({ saved: false }),
      })
    );
  });

  test("remove enforces ownership: user B cannot delete user A's bookmark -> 404", async () => {
    // DB query scoped to user-b never finds user-a's bookmark -> returns null
    Bookmark.findOneAndDelete.mockResolvedValue(null);
    const res = makeResponse();

    await removeBookmark(
      { user: { id: "user-b" }, params: { contentId: "c-1" } },
      res
    );

    expect(Bookmark.findOneAndDelete).toHaveBeenCalledWith({
      user: "user-b",
      content: "c-1",
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, data: null })
    );
  });
});
