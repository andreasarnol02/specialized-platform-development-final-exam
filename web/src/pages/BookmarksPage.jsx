import { useCallback, useEffect, useState } from "react";
import client from "../api/client";
import Icon from "../components/Icon";
import ContentCard from "../components/ContentCard";
import { Spinner, ErrorState, EmptyState } from "../components/states";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    client
      .get("/bookmarks")
      .then(({ data }) => {
        const payload = data.data ?? data;
        setBookmarks(payload.bookmarks ?? payload ?? []);
      })
      .catch(() => setError("Gagal memuat bookmark."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const removeBookmark = (bookmarkId) => {
    setBookmarks((prev) => prev.filter((item) => item._id !== bookmarkId));
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="bookmarks-page">
      <div className="page-heading">
        <div>
          <h1>Bookmark Saya</h1>
          <p>Konten yang kamu simpan untuk dibaca lagi.</p>
        </div>
        {!loading && (
          <span className="result-count">{bookmarks.length} konten</span>
        )}
      </div>

      {bookmarks.length === 0 ? (
        <EmptyState
          icon={<Icon name="bookmark" size={30} />}
          title="Belum ada konten tersimpan"
          message="Gunakan tombol bookmark di halaman konten untuk menyimpannya di sini."
        />
      ) : (
        <div className="content-grid">
          {bookmarks.map((bookmark) => {
            const content = bookmark.content;
            if (!content) return null;
            return (
              <div className="bookmark-item" key={bookmark._id}>
                <ContentCard content={content} />
                <button
                  type="button"
                  className="bookmark-remove"
                  onClick={() => removeBookmark(bookmark._id)}
                  aria-label={`Hapus bookmark ${content.title}`}
                >
                  <Icon name="trash" size={15} /> Hapus
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
