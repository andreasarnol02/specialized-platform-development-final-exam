const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Content",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indeks unik gabungan: satu user hanya boleh bookmark satu konten sekali.
bookmarkSchema.index({ user: 1, content: 1 }, { unique: true });

module.exports = mongoose.model("Bookmark", bookmarkSchema);
