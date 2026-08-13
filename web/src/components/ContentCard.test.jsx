import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import ContentCard from "./ContentCard";

describe("ContentCard", () => {
  const base = {
    _id: "content-1",
    title: "Merawat Mesin Motor 4 Tak",
    excerpt: "Langkah-langkah perawatan rutin.",
    category: "Automotive",
    type: "article",
    durationMinutes: 15,
    coverUrl: "https://cdn.example.com/cover.jpg",
  };

  test("renders cover, category, title, and duration", () => {
    render(
      <MemoryRouter>
        <ContentCard content={base} />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("img", { name: "Merawat Mesin Motor 4 Tak" })
    ).toHaveAttribute("src", "https://cdn.example.com/cover.jpg");
    expect(screen.getByText("Merawat Mesin Motor 4 Tak")).toBeInTheDocument();
    expect(screen.getByText("Otomotif")).toBeInTheDocument();
    expect(screen.getByText("15 menit")).toBeInTheDocument();
    expect(screen.getByText("Artikel")).toBeInTheDocument();
  });

  test("renders the student project badge when flagged", () => {
    render(
      <MemoryRouter>
        <ContentCard content={{ ...base, isStudentProject: true }} />
      </MemoryRouter>
    );

    expect(screen.getByText("Praktek Siswa")).toBeInTheDocument();
  });

  test("does not render the student project badge by default", () => {
    render(
      <MemoryRouter>
        <ContentCard content={base} />
      </MemoryRouter>
    );

    expect(screen.queryByText("Praktek Siswa")).not.toBeInTheDocument();
  });

  test("labels video content as video", () => {
    render(
      <MemoryRouter>
        <ContentCard content={{ ...base, type: "video", durationMinutes: 5 }} />
      </MemoryRouter>
    );

    expect(screen.getByText("Video")).toBeInTheDocument();
    expect(screen.getByText("5 menit")).toBeInTheDocument();
  });
});
