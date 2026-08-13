import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import Icon from "./Icon";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const searchInputRef = useRef(null);

  useEffect(() => {
    const focusSearch = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };

    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const value = search.trim();
    navigate(value ? `/konten?search=${encodeURIComponent(value)}` : "/konten");
  };

  return (
    <header className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand">
          <span className="navbar-brand-mark">my</span>
          <span>
            my<span className="brand-accent">skill</span>
          </span>
        </Link>

        <nav className="navbar-links" aria-label="Navigasi utama">
          <NavLink to="/" end>
            Beranda
          </NavLink>
          <NavLink to="/konten">Konten</NavLink>
          <NavLink to="/bookmark">Bookmark</NavLink>
          <NavLink to="/profile">Profil</NavLink>
          {user?.role === "admin" && (
            <NavLink to="/admin/konten" className="navbar-admin-link">
              Kelola Konten
            </NavLink>
          )}
        </nav>

        <form className="navbar-search" onSubmit={handleSearch} role="search">
          <Icon name="search" size={18} />
          <input
            type="search"
            ref={searchInputRef}
            placeholder="Cari konten..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Cari konten"
            aria-keyshortcuts="Control+K Meta+K"
          />
          <kbd title="Tekan Cmd atau Ctrl + K untuk mencari">Cmd/Ctrl K</kbd>
        </form>

        <div className="navbar-actions">
          {user ? (
            <div className="navbar-user">
              <Link to="/profile" className="navbar-user-link">
                <span className="navbar-avatar">{user.name?.[0] || "A"}</span>
                <span>{user.name?.split(" ")[0] || user.email}</span>
                <Icon name="chevron" size={14} />
              </Link>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={handleLogout}
              >
                Keluar
              </button>
            </div>
          ) : (
            <div className="navbar-user">
              <Link to="/login">Masuk</Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Daftar
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
