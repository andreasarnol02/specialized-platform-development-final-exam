const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    excerpt: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Automotive",
        "Electronics",
        "Electrical",
        "Construction",
        "Machining & Welding",
      ],
      index: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["article", "video"],
      index: true,
    },

    body: {
      type: String,
      required: function () {
        return this.type === "article";
      },
    },

    videoUrl: {
      type: String,
      required: function () {
        return this.type === "video";
      },
    },

    coverUrl: {
      type: String,
      required: true,
      match: /^https?:\/\/\S+$/,
    },

    durationMinutes: {
      type: Number,
      min: 1,
      default: undefined,
    },

    isStudentProject: {
      type: Boolean,
      default: false,
    },

    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_document, value) {
        delete value.__v;
        return value;
      },
    },
  }
);

module.exports = mongoose.model("Content", contentSchema);
