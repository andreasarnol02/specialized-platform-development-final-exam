const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validation");

const {
  register,
  login,
  getCurrentUser,
} = require("../controllers/authController");
const {
  register: registerValidator,
  login: loginValidator,
} = require("./validators");

// Rate limit only credential-based endpoints to prevent brute force.
// /me must stay outside the limiter: the app polls it on every screen focus.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Terlalu banyak permintaan, coba lagi nanti.",
});

// POST /api/auth/register — register a new student, returns a token immediately.
router.post("/register", authLimiter, registerValidator, validate, register);

// POST /api/auth/login — log a user in.
router.post("/login", authLimiter, loginValidator, validate, login);

// GET /api/auth/me — profile of the logged-in user.
router.get("/me", protect, getCurrentUser);

module.exports = router;
