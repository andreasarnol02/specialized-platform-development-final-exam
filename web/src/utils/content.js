export const getContentCover = (content) => content?.coverUrl || "";

// Maps the English category value stored in the API to the Indonesian
// display label, falling back to the raw value when unknown.
const CATEGORY_LABELS = {
  Automotive: "Otomotif",
  Electronics: "Elektronika",
  Electrical: "Kelistrikan",
  Construction: "Konstruksi",
  "Machining & Welding": "Pemesinan & Pengelasan",
};

export const getCategoryLabel = (value) => CATEGORY_LABELS[value] || value || "";

const YOUTUBE_PATTERNS = [
  /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{11})/,
  /youtu\.be\/([\w-]{11})/,
];

export const getYouTubeId = (url) => {
  if (!url) return null;
  for (const pattern of YOUTUBE_PATTERNS) {
    const match = String(url).match(pattern);
    if (match) return match[1];
  }
  return null;
};

// Returns an embeddable URL for YouTube links, otherwise null (the caller
// falls back to a native <video> player for direct mp4/webm URLs).
export const getVideoEmbedUrl = (url) => {
  const id = getYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
};
