const express = require("express");
const router = express.Router();
const { protect, requireAdmin } = require("../middleware/authMiddleware");
const validate = require("../middleware/validation");

const {
  createContent,
  getContents,
  getContentById,
  updateContent,
  deleteContent,
} = require("../controllers/contentController");
const {
  contentFields,
  contentUpdate,
  mongoId,
  contentQuery,
} = require("./validators");

// ALL content routes require a token (gated content / BR-1).
router.get("/", protect, contentQuery, validate, getContents);
router.get("/:id", protect, mongoId("id"), validate, getContentById);

// Content writes are admin only.
router.post("/", protect, requireAdmin, contentFields, validate, createContent);
router.put(
  "/:id",
  protect,
  requireAdmin,
  mongoId("id"),
  contentUpdate,
  validate,
  updateContent
);
router.delete(
  "/:id",
  protect,
  requireAdmin,
  mongoId("id"),
  validate,
  deleteContent
);

module.exports = router;
