import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import client from "../api/client";
import Icon from "../components/Icon";
import BookmarkButton from "../components/BookmarkButton";
import ContentImage from "../components/ContentImage";
import { Spinner, ErrorState } from "../components/states";
import {
  getCategoryLabel,
  getContentCover,
  getVideoEmbedUrl,
} from "../utils/content";
import { formatDate, formatDuration } from "../utils/format";

export default function ContentDetailPage() {
  const { id } = useParams();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    client
      .get(`/contents/${id}`)
      .then(({ data }) => setContent(data.data ?? data))
      .catch(() => setError("Konten tidak ditemukan."))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <Spinner />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const cover = getContentCover(content);
  const embedUrl =
    content.type === "video" ? getVideoEmbedUrl(content.videoUrl) : null;
  const isVideo = content.type === "video";

  return (
    <article className="detail">
      <nav className="breadcrumb">
        <Link to="/konten">Konten</Link>
        <span>/</span>
        <span>{getCategoryLabel(content.category) || "Umum"}</span>
      </nav>

      {cover && (
        <div className="detail-cover">
          <ContentImage src={cover} alt={content.title} />
        </div>
      )}

      <header className="detail-header">
        <div className="detail-meta">
          <span className="chip chip-category">
            {getCategoryLabel(content.category) || "Umum"}
          </span>
          <span className="chip">
            <Icon name={isVideo ? "film" : "fileText"} size={13} />
            {isVideo ? "Video" : "Artikel"}
          </span>
          {content.durationMinutes ? (
            <span className="chip">
              <Icon name="clock" size={13} />{" "}
              {formatDuration(content.durationMinutes)}
            </span>
          ) : null}
          {content.isStudentProject && (
            <span className="chip chip-project">
              <Icon name="star" size={13} /> Praktek Siswa
            </span>
          )}
        </div>

        <h1>{content.title}</h1>
        {content.excerpt && <p className="detail-excerpt">{content.excerpt}</p>}

        <div className="detail-sub">
          <span>
            {content.createdAt
              ? `Dipublikasikan ${formatDate(content.createdAt)}`
              : "Konten My Skill"}
          </span>
          <BookmarkButton contentId={content._id} />
        </div>
      </header>

      {isVideo ? (
        <section className="video-section">
          {embedUrl ? (
            <div className="video-frame">
              <iframe
                src={embedUrl}
                title={content.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : content.videoUrl ? (
            <video
              className="video-player"
              controls
              preload="metadata"
              src={content.videoUrl}
            >
              Browser kamu tidak mendukung pemutar video.
            </video>
          ) : (
            <p className="muted">Video belum tersedia.</p>
          )}
          {content.body && (
            <div className="article-body">
              <h2>Deskripsi Video</h2>
              <p>{content.body}</p>
            </div>
          )}
        </section>
      ) : (
        <section className="article-body">
          {content.body ? (
            <p>{content.body}</p>
          ) : (
            <p className="muted">Konten artikel belum tersedia.</p>
          )}
        </section>
      )}

      <div className="detail-back">
        <Link to="/konten" className="btn btn-ghost">
          <Icon name="chevronLeft" size={15} /> Kembali ke Daftar Konten
        </Link>
      </div>
    </article>
  );
}
