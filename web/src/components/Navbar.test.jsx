import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Navbar from "./Navbar";

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({ user: null, logout: jest.fn() }),
}));

describe("Navbar", () => {
  test("focuses the content search on Cmd/Ctrl+K", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const input = screen.getByRole("searchbox", { name: "Cari konten" });
    input.value = "mesin";
    input.focus();
    input.setSelectionRange(0, input.value.length);
    input.blur();

    fireEvent.keyDown(window, { key: "k", metaKey: true });

    expect(input).toHaveFocus();
  });

  test("supports Ctrl+K for non-Mac keyboards", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const input = screen.getByRole("searchbox", { name: "Cari konten" });
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });

    expect(input).toHaveFocus();
  });

  test("hides the admin link for non-admin users", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.queryByText("Kelola Konten")).not.toBeInTheDocument();
  });
});
