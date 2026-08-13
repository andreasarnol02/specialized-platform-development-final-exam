const Bookmark = require("../models/bookmark");
const Content = require("../models/content");
const { sendServerError } = require("../utils/httpError");

// GET /api/bookmarks — bookmarks of the logged-in user, content populated, newest first.
const getMyBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user.id })
      .populate({
        path: "content",
        select: "-__v",
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Bookmark berhasil dimuat",
      data: {
        bookmarks: bookmarks.map((b) => ({
          _id: b._id,
          content: b.content,
          createdAt: b.createdAt,
        })),
      },
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

// POST /api/bookmarks/:contentId — toggle-style create.
// If a bookmark already exists, return saved:true (no duplicate). Otherwise create one.
// 404 if the content does not exist or is not published.
const toggleBookmark = async (req, res) => {
  try {
    const { contentId } = req.params;

    // Check the content exists and is published
    const content = await Content.findOne({
      _id: contentId,
      isPublished: true,
    });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Konten tidak ditemukan",
        data: null,
      });
    }

    // Check whether a bookmark already exists
    let bookmark = await Bookmark.findOne({
      user: req.user.id,
      content: contentId,
    });

    if (!bookmark) {
      bookmark = await Bookmark.create({
        user: req.user.id,
        content: contentId,
      });

      return res.status(200).json({
        success: true,
        message: "Konten berhasil disimpan ke bookmark",
        data: { saved: true, bookmark },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Konten sudah disimpan",
      data: { saved: true, bookmark },
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

// DELETE /api/bookmarks/:contentId — removes a bookmark owned by req.user.id only.
// 404 if not found. 200 with saved:false.
const removeBookmark = async (req, res) => {
  try {
    const { contentId } = req.params;

    const bookmark = await Bookmark.findOneAndDelete({
      user: req.user.id,
      content: contentId,
    });

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: "Bookmark tidak ditemukan",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Bookmark dihapus",
      data: { saved: false },
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

module.exports = {
  getMyBookmarks,
  toggleBookmark,
  removeBookmark,
};
