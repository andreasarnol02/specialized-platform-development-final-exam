import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import client from "../api/client";
import ContentsPage from "./ContentsPage";

jest.mock("../api/client", () => ({
  get: jest.fn(),
}));

describe("ContentsPage", () => {
  test("loads contents using URL search filters", async () => {
    client.get.mockResolvedValue({
      data: {
        data: {
          contents: [
            {
              _id: "content-1",
              title: "Cara Merawat Mesin Motor",
              excerpt: "Langkah perawatan rutin.",
              category: "Automotive",
              type: "article",
              durationMinutes: 10,
              coverUrl: "",
            },
          ],
          page: 1,
          pages: 1,
          total: 1,
        },
      },
    });

    render(
      <MemoryRouter initialEntries={["/konten?search=mesin"]}>
        <ContentsPage />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByText("Cara Merawat Mesin Motor")).toBeInTheDocument()
    );
    expect(client.get).toHaveBeenCalledWith("/contents", {
      params: {
        search: "mesin",
        category: undefined,
        type: undefined,
        page: 1,
      },
    });
    expect(screen.getByText(/Hasil pencarian untuk/)).toBeInTheDocument();
    expect(screen.getByText("1 konten")).toBeInTheDocument();
  });

  test("shows an empty state when no contents match", async () => {
    client.get.mockResolvedValue({
      data: { data: { contents: [], page: 1, pages: 1, total: 0 } },
    });

    render(
      <MemoryRouter initialEntries={["/konten"]}>
        <ContentsPage />
      </MemoryRouter>
    );

    expect(await screen.findByText("Konten tidak ditemukan")).toBeInTheDocument();
  });
});
