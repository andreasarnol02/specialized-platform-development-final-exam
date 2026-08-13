import Icon from "./Icon";

export function Spinner({ label = "Memuat..." }) {
  return (
    <div className="state-box">
      <div className="spinner" />
      <p>{label}</p>
    </div>
  );
}

export function EmptyState({
  icon = <Icon name="grid" size={28} />,
  title,
  message,
  children,
}) {
  return (
    <div className="state-box">
      <div className="state-icon">{icon}</div>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {children}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="state-box">
      <div className="state-icon">
        <Icon name="shield" size={30} />
      </div>
      <h3>Terjadi kesalahan</h3>
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn btn-primary" onClick={onRetry}>
          Coba Lagi
        </button>
      )}
    </div>
  );
}
