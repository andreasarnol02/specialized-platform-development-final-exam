// Cover image of a content item (may be empty -> placeholder rendered).
export const getContentImage = (content) => content?.coverUrl || "";

// "Video" for videos, "Article" for everything else (and the default).
export const getTypeLabel = (type) =>
  String(type || "").toLowerCase() === "video" ? "Video" : "Article";

// English API category values -> Indonesian display labels.
const CATEGORY_LABELS = {
  Automotive: "Otomotif",
  Electronics: "Elektronika",
  Electrical: "Kelistrikan",
  Construction: "Konstruksi",
  "Machining & Welding": "Pemesinan & Pengelasan",
};

// Indonesian display label for an API category value (fallback: raw value).
export const getCategoryLabel = (value) =>
  CATEGORY_LABELS[value] ?? String(value || "");

// "Student Practice" badge condition.
export const isStudentProject = (content) => Boolean(content?.isStudentProject);
