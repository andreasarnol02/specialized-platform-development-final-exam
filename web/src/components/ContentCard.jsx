import { Link } from "react-router";
import Icon from "./Icon";
import ContentImage from "./ContentImage";
import { getCategoryLabel, getContentCover } from "../utils/content";
import { formatDate, formatDuration } from "../utils/format";

export default function ContentCard({ content }) {
  const cover = getContentCover(content);

  return (
    <Link to={`/konten/${content._id}`} className="content-card">
      <div className="content-card-cover">
        <ContentImage src={cover} alt={content.title} loading="lazy" />
        <span className="content-card-type">
          <Icon
            name={content.type === "video" ? "film" : "fileText"}
            size={13}
          />
          {content.type === "video" ? "Video" : "Artikel"}
        </span>
        {content.isStudentProject && (
          <span className="content-card-badge">Praktek Siswa</span>
        )}
      </div>
      <div className="content-card-body">
        <span className="content-card-category">
          {getCategoryLabel(content.category) || "Umum"}
        </span>
        <h3 className="content-card-title">{content.title}</h3>
        <p className="content-card-excerpt">{content.excerpt}</p>
        <div className="content-card-meta">
          <span>
            <Icon name="clock" size={12} />{" "}
            {formatDuration(content.durationMinutes)}
          </span>
          {content.createdAt && <span>{formatDate(content.createdAt)}</span>}
        </div>
      </div>
    </Link>
  );
}
