import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import BookmarkButton from "./BookmarkButton";
import client from "../api/client";

jest.mock("../api/client", () => ({
  post: jest.fn(),
  delete: jest.fn(),
}));

describe("BookmarkButton", () => {
  beforeEach(() => jest.clearAllMocks());

  test("saves a bookmark when not saved yet", async () => {
    client.post.mockResolvedValue({
      data: { success: true, data: { saved: true } },
    });

    render(<BookmarkButton contentId="content-1" />);

    const button = screen.getByRole("button", { name: "Simpan ke bookmark" });
    fireEvent.click(button);

    await waitFor(() =>
      expect(client.post).toHaveBeenCalledWith("/bookmarks/content-1")
    );
    expect(
      screen.getByRole("button", { name: "Hapus dari bookmark" })
    ).toBeInTheDocument();
    expect(screen.getByText("Tersimpan")).toBeInTheDocument();
  });

  test("removes a bookmark when already saved", async () => {
    client.delete.mockResolvedValue({
      data: { success: true, data: { saved: false } },
    });
    render(<BookmarkButton contentId="content-1" initiallySaved />);

    const button = screen.getByRole("button", {
      name: "Hapus dari bookmark",
    });
    fireEvent.click(button);

    await waitFor(() =>
      expect(client.delete).toHaveBeenCalledWith("/bookmarks/content-1")
    );
    expect(
      screen.getByRole("button", { name: "Simpan ke bookmark" })
    ).toBeInTheDocument();
  });

  test("shows an error toast when the API call fails", async () => {
    client.post.mockRejectedValue({
      response: { data: { message: "Failed to save." } },
    });

    render(<BookmarkButton contentId="content-1" />);

    fireEvent.click(
      screen.getByRole("button", { name: "Simpan ke bookmark" })
    );

    expect(await screen.findByText("Failed to save.")).toBeInTheDocument();
  });
});
