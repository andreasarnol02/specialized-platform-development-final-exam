import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import AdminContentFormPage from "./AdminContentFormPage";
import client from "../../api/client";

jest.mock("../../api/client", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  },
}));

describe("AdminContentFormPage", () => {
  beforeEach(() => jest.clearAllMocks());

  test("starts with an empty article form for new content", () => {
    render(
      <MemoryRouter>
        <AdminContentFormPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: "Konten Baru" })
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /Judul/ })).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /Isi artikel/ })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: /Kategori/ })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: /Tipe konten/ })
    ).toBeInTheDocument();
  });

  test("prefills the form with existing values when editing", async () => {
    client.get.mockResolvedValue({
      data: {
        data: {
          title: "Pengelasan Dasar",
          excerpt: "Teknik dasar mengelas.",
          category: "Machining & Welding",
          type: "article",
          body: "Persiapan alat dan bahan.",
          coverUrl: "https://cdn.example.com/welding.jpg",
          durationMinutes: 20,
          isStudentProject: true,
        },
      },
    });

    render(
      <MemoryRouter initialEntries={["/admin/konten/content-1/edit"]}>
        <Routes>
          <Route
            path="/admin/konten/:id/edit"
            element={<AdminContentFormPage />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(
      await screen.findByDisplayValue("Pengelasan Dasar")
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("Persiapan alat dan bahan.")
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("Pemesinan & Pengelasan")
    ).toBeInTheDocument();
    // The select displays the Indonesian label but keeps the English API value.
    expect(
      screen.getByRole("combobox", { name: /Kategori/ })
    ).toHaveValue("Machining & Welding");
    expect(screen.getByDisplayValue("20")).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: /praktek siswa/i })
    ).toBeChecked();
    expect(client.get).toHaveBeenCalledWith("/contents/content-1");
  });

  test("switches to a video URL field when type is video", async () => {
    render(
      <MemoryRouter>
        <AdminContentFormPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByRole("combobox", { name: /Tipe konten/ }), {
      target: { value: "video" },
    });

    expect(
      await screen.findByRole("textbox", { name: /URL Video/ })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("textbox", { name: /Isi artikel/ })
    ).not.toBeInTheDocument();
  });
});
