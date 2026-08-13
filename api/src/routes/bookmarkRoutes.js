const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validation");

const {
  getMyBookmarks,
  toggleBookmark,
  removeBookmark,
} = require("../controllers/bookmarkController");
const { mongoId } = require("./validators");

// All bookmark routes require a token.
router.get("/", protect, getMyBookmarks);
router.post(
  "/:contentId",
  protect,
  mongoId("contentId"),
  validate,
  toggleBookmark
);
router.delete(
  "/:contentId",
  protect,
  mongoId("contentId"),
  validate,
  removeBookmark
);

module.exports = router;
