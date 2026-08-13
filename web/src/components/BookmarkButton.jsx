import { useState } from "react";
import client from "../api/client";
import Icon from "./Icon";
import Toast from "./Toast";

export default function BookmarkButton({
  contentId,
  initiallySaved = false,
  onToggle,
}) {
  const [saved, setSaved] = useState(Boolean(initiallySaved));
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);

  const handleToggle = async () => {
    if (busy) return;
    setBusy(true);
    setNotice(null);
    try {
      if (saved) {
        await client.delete(`/bookmarks/${contentId}`);
        setSaved(false);
      } else {
        await client.post(`/bookmarks/${contentId}`);
        setSaved(true);
      }
      onToggle?.(!saved);
    } catch (err) {
      setNotice({
        message: err.response?.data?.message || "Gagal menyimpan bookmark.",
        tone: "error",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className={`bookmark-btn ${saved ? "saved" : ""}`}
        onClick={handleToggle}
        disabled={busy}
        aria-label={saved ? "Hapus dari bookmark" : "Simpan ke bookmark"}
        aria-pressed={saved}
        title={saved ? "Hapus dari bookmark" : "Simpan ke bookmark"}
      >
        <Icon
          name="bookmark"
          size={20}
          fill={saved ? "currentColor" : "none"}
          strokeWidth={saved ? 2.2 : 1.9}
        />
        <span>{saved ? "Tersimpan" : "Simpan"}</span>
      </button>
      {notice && <Toast {...notice} onClose={() => setNotice(null)} />}
    </>
  );
}
