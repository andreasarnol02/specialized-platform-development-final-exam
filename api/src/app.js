const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const contentRoutes = require("./routes/contentRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");
const app = express();

// Middleware
const allowedOrigins = (
  process.env.CORS_ORIGINS || "http://localhost:5173,http://127.0.0.1:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/auth", authRoutes);
app.use("/api/contents", contentRoutes);
app.use("/api/bookmarks", bookmarkRoutes);

// Health route (public)
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API My Skill berjalan",
    data: { status: "ok" },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Rute tidak ditemukan",
    data: null,
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({
    success: false,
    message: "Terjadi kesalahan internal server",
    data: null,
  });
});

module.exports = app;
