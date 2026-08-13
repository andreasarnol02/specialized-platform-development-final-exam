const Content = require("../models/content");
const { sendServerError, sendWriteError } = require("../utils/httpError");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Pick the writable fields from the request body.
const contentPayload = (body) => {
  const payload = {
    title: body.title,
    excerpt: body.excerpt,
    category: body.category,
    type: body.type,
    coverUrl: body.coverUrl,
  };

  // Only articles carry a body; videos use videoUrl.
  if (body.type === "article" || body.body !== undefined) {
    payload.body = body.body;
  }
  if (body.type === "video" || body.videoUrl !== undefined) {
    payload.videoUrl = body.videoUrl;
  }

  if (body.durationMinutes !== undefined) {
    payload.durationMinutes = body.durationMinutes;
  }
  if (body.isStudentProject !== undefined) {
    payload.isStudentProject = body.isStudentProject;
  }
  if (body.isPublished !== undefined) {
    payload.isPublished = body.isPublished;
  }

  return payload;
};

// POST /api/contents — admin only. createdBy comes from req.user.id.
const createContent = async (req, res) => {
  try {
    const content = await Content.create({
      ...contentPayload(req.body),
      createdBy: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Konten berhasil dibuat",
      data: content,
    });
  } catch (error) {
    return sendWriteError(res, error);
  }
};

// GET /api/contents?search=&category=&type=&page=
// Public list only returns isPublished:true content, newest first, default limit 12.
// Admins see everything, including unpublished content (admin management page).
const getContents = async (req, res) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 12);
    const filter =
      req.user?.role === "admin" ? {} : { isPublished: true };

    if (req.query.search) {
      filter.title = {
        $regex: escapeRegex(req.query.search.trim()),
        $options: "i",
      };
    }

    if (req.query.category) {
      filter.category = req.query.category.trim();
    }

    if (req.query.type) {
      filter.type = req.query.type.trim();
    }

    const [contents, total] = await Promise.all([
      Content.find(filter)
        .populate("createdBy", "name email role")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Content.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      message: "Konten berhasil dimuat",
      data: {
        contents,
        page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

// GET /api/contents/:id — 404 if not found or not published (admins may view
// unpublished content, e.g. from the admin management page).
const getContentById = async (req, res) => {
  try {
    const filter = {
      _id: req.params.id,
      ...(req.user?.role === "admin" ? {} : { isPublished: true }),
    };
    const content = await Content.findOne(filter).populate(
      "createdBy",
      "name email role"
    );

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Konten tidak ditemukan",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Konten berhasil dimuat",
      data: content,
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

// PUT /api/contents/:id — admin only. body/videoUrl consistency is re-validated.
const updateContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Konten tidak ditemukan",
        data: null,
      });
    }

    const merged = {
      ...content.toObject(),
      ...req.body,
      type: req.body.type || content.type,
    };

    Object.assign(content, contentPayload(merged));
    await content.save();

    return res.status(200).json({
      success: true,
      message: "Konten berhasil diperbarui",
      data: content,
    });
  } catch (error) {
    return sendWriteError(res, error);
  }
};

// DELETE /api/contents/:id — admin only. Soft delete: sets isPublished false.
const deleteContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Konten tidak ditemukan",
        data: null,
      });
    }

    content.isPublished = false;
    await content.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      message: "Konten berhasil disembunyikan",
      data: content,
    });
  } catch (error) {
    return sendWriteError(res, error);
  }
};

module.exports = {
  createContent,
  getContents,
  getContentById,
  updateContent,
  deleteContent,
};
