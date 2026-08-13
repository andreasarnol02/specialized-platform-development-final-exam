import { getContentImage, getTypeLabel, isStudentProject } from "./content";

describe("getContentImage", () => {
  it("returns the coverUrl", () => {
    expect(getContentImage({ coverUrl: "x" })).toBe("x");
  });

  it("returns an empty string when there is no cover", () => {
    expect(getContentImage({})).toBe("");
  });

  it("returns an empty string for null", () => {
    expect(getContentImage(null)).toBe("");
  });
});

describe("getTypeLabel", () => {
  it("labels videos as Video", () => {
    expect(getTypeLabel("video")).toBe("Video");
    expect(getTypeLabel("VIDEO")).toBe("Video");
  });

  it("labels articles as Article", () => {
    expect(getTypeLabel("article")).toBe("Article");
  });

  it("defaults to Article for missing types", () => {
    expect(getTypeLabel(undefined)).toBe("Article");
    expect(getTypeLabel(null)).toBe("Article");
  });
});

describe("isStudentProject", () => {
  it("is true when isStudentProject is set", () => {
    expect(isStudentProject({ isStudentProject: true })).toBe(true);
  });

  it("is false when isStudentProject is falsy or missing", () => {
    expect(isStudentProject({ isStudentProject: false })).toBe(false);
    expect(isStudentProject({})).toBe(false);
    expect(isStudentProject(null)).toBe(false);
  });
});
