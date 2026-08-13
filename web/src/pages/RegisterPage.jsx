import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Nama lengkap wajib diisi.");
      return;
    }
    if (form.password.length < 8) {
      setError("Kata sandi minimal 8 karakter.");
      return;
    }

    setSubmitting(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal daftar. Coba lagi."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Daftar untuk My Skill</h1>
        <p className="auth-sub">Buat akun untuk mengakses artikel dan video.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <label className="field">
          <span>Nama Lengkap</span>
          <input
            type="text"
            name="name"
            required
            placeholder="Nama kamu"
            value={form.name}
            onChange={handleChange}
          />
        </label>

        <label className="field">
          <span>Email</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="name@email.com"
            value={form.email}
            onChange={handleChange}
          />
        </label>

        <label className="field">
          <span>Kata Sandi</span>
          <input
            type="password"
            name="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="Minimal 8 karakter"
            value={form.password}
            onChange={handleChange}
          />
        </label>

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={submitting}
        >
          {submitting ? "Memproses..." : "Daftar"}
        </button>

        <p className="auth-alt">
          Sudah punya akun? <Link to="/login">Masuk</Link>
        </p>
      </form>
    </div>
  );
}
