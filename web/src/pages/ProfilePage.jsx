import { useAuth } from "../context/AuthContext";
import Icon from "../components/Icon";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const roleLabel = user?.role === "admin" ? "Admin" : "Siswa";

  return (
    <div className="profile-page">
      <h1>Profil Saya</h1>
      <div className="panel profile-card">
        <div className="profile-avatar">{user.name?.[0]?.toUpperCase()}</div>
        <div className="profile-fields">
          <div className="summary-row">
            <span>Nama</span>
            <strong>{user.name}</strong>
          </div>
          <div className="summary-row">
            <span>Email</span>
            <strong>{user.email}</strong>
          </div>
          <div className="summary-row">
            <span>Peran</span>
            <strong>
              <span className="chip chip-role">
                <Icon name="user" size={13} /> {roleLabel}
              </span>
            </strong>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={logout}
        >
          Keluar
        </button>
      </div>
    </div>
  );
}
