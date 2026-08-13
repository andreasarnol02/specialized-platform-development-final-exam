import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";
import Icon from "../components/Icon";
import CategoryRow from "../components/CategoryRow";
import ContentCard from "../components/ContentCard";
import { ErrorState, Spinner } from "../components/states";

export default function HomePage() {
  const { user } = useAuth();
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    client
      .get("/contents", { params: { page: 1 } })
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

  if (loading) return <Spinner />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const featured = contents.slice(0, 8);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-copy">
          <p className="hero-greeting">
            Halo, {user?.name?.split(" ")[0] || "Siswa"}.
          </p>
          <h1>
            Karya praktek <em>siswa SMK</em>
          </h1>
          <p>
            Artikel dan video tentang membuat barang, memperbaiki kendaraan,
            dan merapikan rumah.
          </p>
          <div className="hero-actions">
            <Link to="/konten" className="btn btn-primary btn-lg">
              Jelajahi Konten <Icon name="arrowRight" size={16} />
            </Link>
            <Link to="/bookmark" className="btn btn-ghost btn-lg">
              Bookmark Saya
            </Link>
          </div>
          <div className="hero-proof">
            <span>
              <strong>{contents.length}</strong> konten tersedia
            </span>
            <span>
              <strong>Praktek Siswa</strong> karya dari siswa
            </span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card">
            <span className="hero-card-icon">
              <Icon name="wrench" size={26} />
            </span>
            <span>Praktek Siswa</span>
            <strong>Karya dari proyek kelas nyata</strong>
            <small>
              <Icon name="spark" size={13} /> Artikel dan video
            </small>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <h2>Jelajahi Bidang</h2>
          </div>
          <Link to="/konten" className="heading-link">
            Lihat Semua <Icon name="arrowRight" size={15} />
          </Link>
        </div>
        <CategoryRow />
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <h2>Konten Terbaru</h2>
          </div>
          <Link to="/konten" className="heading-link">
            Lihat Semua <Icon name="arrowRight" size={15} />
          </Link>
        </div>
        {featured.length === 0 ? (
          <p className="muted">Belum ada konten.</p>
        ) : (
          <div className="content-grid">
            {featured.map((content) => (
              <ContentCard key={content._id} content={content} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
