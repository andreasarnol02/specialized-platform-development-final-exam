import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import client from "../api/client";
import Icon from "../components/Icon";
import ContentCard from "../components/ContentCard";
import { Spinner, ErrorState, EmptyState } from "../components/states";
import { CATEGORIES } from "../components/CategoryRow";
import { getCategoryLabel } from "../utils/content";

const TYPE_OPTIONS = [
  { value: "", label: "Semua" },
  { value: "article", label: "Artikel" },
  { value: "video", label: "Video" },
];

export default function ContentsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [contents, setContents] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const type = searchParams.get("type") || "";
  const page = Number(searchParams.get("page") || "1") || 1;

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    client
      .get("/contents", {
        params: {
          search: search || undefined,
          category: category || undefined,
          type: type || undefined,
          page: page || undefined,
        },
      })
      .then(({ data }) => {
        const payload = data.data ?? data;
        setContents(payload.contents ?? payload);
        setPagination(
          payload.page || payload.pages || payload.total
            ? { page: payload.page, pages: payload.pages, total: payload.total }
            : null
        );
      })
      .catch(() => setError("Gagal memuat konten."))
      .finally(() => setLoading(false));
  }, [search, category, type, page]);

  useEffect(() => {
    load();
  }, [load]);

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page");
    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => setSearchParams({}, { replace: true });

  const pages = pagination?.pages ?? 1;
  const total = pagination?.total ?? contents.length;

  return (
    <div className="catalog">
      <div className="page-heading">
        <div>
          <h1>Materi Belajar</h1>
          <p>Cari dan filter artikel serta video.</p>
        </div>
        {!loading && <span className="result-count">{total} konten</span>}
      </div>

      <div className="catalog-toolbar">
        <div className="catalog-search">
          <Icon name="search" size={17} />
          <input
            type="search"
            aria-label="Cari konten"
            placeholder="Cari konten..."
            value={search}
            onChange={(e) => setParam("search", e.target.value)}
          />
        </div>
        <div
          className="type-filter"
          role="group"
          aria-label="Filter tipe konten"
        >
          {TYPE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`filter-chip ${type === option.value ? "active" : ""}`}
              onClick={() => setParam("type", option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="category-chips">
        <button
          type="button"
          className={`filter-chip ${category === "" ? "active" : ""}`}
          onClick={() => setParam("category", "")}
        >
          Semua Kategori
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            type="button"
            className={`filter-chip ${category === cat.value ? "active" : ""}`}
            onClick={() => setParam("category", cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {(search || category || type) && (
        <div className="filter-summary">
          <span>
            {search ? (
              <>
                Hasil pencarian untuk <strong>"{search}"</strong>
              </>
            ) : category ? (
              <>
                Kategori <strong>{getCategoryLabel(category)}</strong>
              </>
            ) : (
              <>
                Tipe <strong>{type}</strong>
              </>
            )}
          </span>
          <button type="button" className="clear-filter" onClick={clearFilters}>
            Hapus Filter
          </button>
        </div>
      )}

      {loading ? (
        <Spinner />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : contents.length === 0 ? (
        <EmptyState
          icon={<Icon name="search" size={30} />}
          title="Konten tidak ditemukan"
          message="Coba kata kunci, kategori, atau tipe lain."
        />
      ) : (
        <div className="content-grid">
          {contents.map((content) => (
            <ContentCard key={content._id} content={content} />
          ))}
        </div>
      )}

      {!loading && !error && pages > 1 && (
        <nav className="pagination" aria-label="Navigasi halaman">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            disabled={page <= 1}
            onClick={() => setParam("page", String(page - 1))}
          >
            <Icon name="chevronLeft" size={15} /> Sebelumnya
          </button>
          <span className="pagination-info">
            Halaman {page} dari {pages}
          </span>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            disabled={page >= pages}
            onClick={() => setParam("page", String(page + 1))}
          >
            Berikutnya <Icon name="chevronRight" size={15} />
          </button>
        </nav>
      )}
    </div>
  );
}
