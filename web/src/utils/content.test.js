import { getContentCover, getVideoEmbedUrl, getYouTubeId } from "./content";

describe("content helpers", () => {
  test("uses the canonical cover URL", () => {
    expect(
      getContentCover({ coverUrl: "https://cdn.example.com/cover.jpg" })
    ).toBe("https://cdn.example.com/cover.jpg");
    expect(getContentCover({})).toBe("");
    expect(getContentCover(null)).toBe("");
  });

  test("extracts YouTube ids from watch, youtu.be, shorts, and embed URLs", () => {
    expect(getYouTubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
      "dQw4w9WgXcQ"
    );
    expect(getYouTubeId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(getYouTubeId("https://www.youtube.com/shorts/dQw4w9WgXcQ")).toBe(
      "dQw4w9WgXcQ"
    );
    expect(getYouTubeId("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe(
      "dQw4w9WgXcQ"
    );
    expect(getYouTubeId("https://cdn.example.com/video.mp4")).toBeNull();
  });

  test("converts YouTube links to embed URLs and leaves direct files alone", () => {
    expect(
      getVideoEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
    ).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
    expect(getVideoEmbedUrl("https://cdn.example.com/video.mp4")).toBeNull();
    expect(getVideoEmbedUrl("")).toBeNull();
  });
});
