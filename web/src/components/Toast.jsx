import { useEffect } from "react";
import Icon from "./Icon";

export default function Toast({ message, tone = "success", onClose }) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 3200);
    return () => window.clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div
      className={`toast toast-${tone}`}
      role={tone === "error" ? "alert" : "status"}
    >
      <span className="toast-icon">
        <Icon name={tone === "error" ? "spark" : "shield"} size={17} />
      </span>
      <span>{message}</span>
      <button type="button" onClick={onClose} aria-label="Tutup notifikasi">
        &times;
      </button>
    </div>
  );
}
