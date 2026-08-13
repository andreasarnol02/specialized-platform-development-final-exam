import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import client from "../../api/client";
import { Spinner } from "../../components/states";
import ContentImage from "../../components/ContentImage";
import { CATEGORIES } from "../../components/CategoryRow";

const EMPTY = {
  title: "",
  excerpt: "",
  category: "",
  type: "article",
  body: "",
  videoUrl: "",
  coverUrl: "",
  durationMinutes: "",
  isStudentProject: false,
};

export default function AdminContentFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    client
      .get(`/contents/${id}`)
      .then(({ data }) => {
        const c = data.data ?? data;
        setForm({
          title: c.title || "",
          excerpt: c.excerpt || "",
          category: c.category || "",
          type: c.type || "article",
          body: c.body || "",
          videoUrl: c.videoUrl || "",
          coverUrl: c.coverUrl || "",
          durationMinutes: c.durationMinutes ?? "",
          isStudentProject: Boolean(c.isStudentProject),
        });
      })
      .catch(() => setError("Konten tidak ditemukan."))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setForm({
      ...form,
      [name]: inputType === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) {
      setError("Judul wajib diisi.");
      return;
    }
    if (!form.category) {
      setError("Kategori wajib diisi.");
      return;
    }
    if (form.type === "article" && !form.body.trim()) {
      setError("Isi artikel wajib diisi untuk tipe artikel.");
      return;
    }
    if (form.type === "video" && !form.videoUrl.trim()) {
      setError("URL video wajib diisi untuk tipe video.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      category: form.category,
      type: form.type,
      coverUrl: form.coverUrl.trim(),
      durationMinutes: form.durationMinutes
        ? Number(form.durationMinutes)
        : undefined,
      isStudentProject: form.isStudentProject,
    };
    if (form.type === "article") payload.body = form.body.trim();
    if (form.type === "video") payload.videoUrl = form.videoUrl.trim();

    setSubmitting(true);
    try {
      if (isEdit) {
        await client.put(`/contents/${id}`, payload);
      } else {
        await client.post("/contents", payload);
      }
      navigate("/admin/konten");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyimpan konten.");
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="form-page">
      <div className="page-head">
        <div>
          <span className="eyebrow">
            {isEdit ? "EDIT KONTEN" : "KONTEN BARU"}
          </span>
          <h1>{isEdit ? "Edit Konten" : "Konten Baru"}</h1>
        </div>
      </div>

      <form className="panel form-card" onSubmit={handleSubmit}>
        {error && <div className="alert alert-error">{error}</div>}

        <label className="field">
          <span>Judul *</span>
          <input
            type="text"
            name="title"
            required
            placeholder="Contoh: Merawat Mesin Motor 4 Tak"
            value={form.title}
            onChange={handleChange}
          />
        </label>

        <label className="field">
          <span>Ringkasan (excerpt)</span>
          <textarea
            name="excerpt"
            rows={2}
            placeholder="Ringkasan singkat yang ditampilkan di kartu konten"
            value={form.excerpt}
            onChange={handleChange}
          />
        </label>

        <div className="form-row">
          <label className="field">
            <span>Kategori *</span>
            <select
              name="category"
              required
              value={form.category}
              onChange={handleChange}
            >
              <option value="" disabled>
                Pilih kategori
              </option>
              {CATEGORIES.map((category) => (
                <option value={category.value} key={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Tipe konten *</span>
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="article">Artikel</option>
              <option value="video">Video</option>
            </select>
          </label>

          <label className="field">
            <span>Durasi (menit)</span>
            <input
              type="number"
              inputMode="numeric"
              name="durationMinutes"
              min={0}
              placeholder="15"
              value={form.durationMinutes}
              onChange={handleChange}
            />
          </label>
        </div>

        {form.type === "article" ? (
          <label className="field">
            <span>Isi artikel *</span>
            <textarea
              name="body"
              rows={10}
              required
              placeholder="Tulis materi di sini..."
              value={form.body}
              onChange={handleChange}
            />
            <em className="field-help">
              Teks ditampilkan apa adanya (paragraf dan baris baru
              dipertahankan).
            </em>
          </label>
        ) : (
          <label className="field">
            <span>URL Video *</span>
            <input
              type="url"
              name="videoUrl"
              required
              placeholder="https://www.youtube.com/watch?v=... atau https://example.com/video.mp4"
              value={form.videoUrl}
              onChange={handleChange}
            />
            <em className="field-help">
              Tautan YouTube diputar sebagai embed secara otomatis; tautan
              mp4/webm diputar di pemutar bawaan.
            </em>
          </label>
        )}

        <label className="field">
          <span>URL Sampul (coverUrl)</span>
          <input
            type="url"
            name="coverUrl"
            placeholder="https://example.com/cover.jpg"
            value={form.coverUrl}
            onChange={handleChange}
          />
        </label>

        {form.coverUrl && (
          <div className="form-preview">
            <ContentImage src={form.coverUrl} alt="Pratinjau sampul konten" />
          </div>
        )}

        <label className="checkbox-field">
          <input
            type="checkbox"
            name="isStudentProject"
            checked={form.isStudentProject}
            onChange={handleChange}
          />
          <span>Tandai sebagai hasil praktek siswa</span>
        </label>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => navigate("/admin/konten")}
          >
            Batal
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting
              ? "Menyimpan..."
              : isEdit
                ? "Simpan Perubahan"
                : "Simpan Konten"}
          </button>
        </div>
      </form>
    </div>
  );
}
