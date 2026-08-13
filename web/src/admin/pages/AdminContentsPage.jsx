import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import client from "../../api/client";
import Icon from "../../components/Icon";
import { Spinner, ErrorState, EmptyState } from "../../components/states";
import { CATEGORIES } from "../../components/CategoryRow";
import { getCategoryLabel } from "../../utils/content";

export default function AdminContentsPage() {
  const [contents, setContents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback((query = "") => {
    setLoading(true);
    setError("");
    client
      .get("/contents", { params: { search: query || undefined } })
      .then(({ data }) => {
        const payload = data.data ?? data;
        setContents(payload.contents ?? payload);
      })
      .catch(() => setError("Gagal memuat konten."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleTogglePublish = async (content) => {
    setError("");
    setNotice("");
    try {
      await client.put(`/contents/${content._id}`, {
        isPublished: !content.isPublished,
      });
      setNotice(
        content.isPublished
          ? `"${content.title}" tidak lagi ditampilkan.`
          : `"${content.title}" berhasil diterbitkan.`
      );
      load(search);
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal memperbarui status konten."
      );
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    load(search.trim());
  };

  return (
    <div className="admin-page">
      <div className="page-head">
        <div>
          <span className="eyebrow">
            <Icon name="shield" size={14} /> ADMIN
          </span>
          <h1>Kelola Konten</h1>
          <p>Semua konten, termasuk yang belum diterbitkan.</p>
        </div>
        <Link to="/admin/konten/baru" className="btn btn-primary">
          <Icon name="plus" size={16} /> Konten Baru
        </Link>
      </div>

      {notice && <div className="alert alert-success">{notice}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <form className="admin-search" onSubmit={handleSearch} role="search">
        <Icon name="search" size={17} />
        <input
          type="search"
          aria-label="Cari konten"
          placeholder="Cari judul konten..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <button type="submit" className="btn btn-primary btn-sm">
          Cari
        </button>
      </form>

      {loading ? (
        <Spinner />
      ) : error && contents.length === 0 ? (
        <ErrorState message={error} onRetry={() => load(search)} />
      ) : contents.length === 0 ? (
        <EmptyState
          icon={<Icon name="fileText" size={32} />}
          title="Belum ada konten"
          message="Buat konten pertamamu agar siswa bisa belajar darinya."
        >
          <Link to="/admin/konten/baru" className="btn btn-primary">
            <Icon name="plus" size={16} /> Konten Baru
          </Link>
        </EmptyState>
      ) : (
        <div className="admin-table">
          <div className="admin-table-row head">
            <span>Judul</span>
            <span>Kategori</span>
            <span>Tipe</span>
            <span>Status</span>
            <span>Aksi</span>
          </div>
          {contents.map((content) => (
            <div className="admin-table-row" key={content._id}>
              <span className="cell-title">
                {content.title}
                {content.isStudentProject && (
                  <span className="badge-project">Praktek Siswa</span>
                )}
              </span>
              <span>{getCategoryLabel(content.category) || "Umum"}</span>
              <span className="cell-type">
                <Icon
                  name={content.type === "video" ? "film" : "fileText"}
                  size={13}
                />
                {content.type === "video" ? "Video" : "Artikel"}
              </span>
              <span>
                {content.isPublished ? (
                  <span className="badge-ok">Terbit</span>
                ) : (
                  <span className="badge-off">Belum Terbit</span>
                )}
              </span>
              <span className="cell-actions">
                <Link
                  to={`/admin/konten/${content._id}/edit`}
                  className="btn btn-ghost btn-sm"
                >
                  <Icon name="edit" size={13} /> Edit
                </Link>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => handleTogglePublish(content)}
                >
                  {content.isPublished ? "Turunkan" : "Terbitkan"}
                </button>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
