import { Link } from "react-router";
import Icon from "./Icon";

// The API stores English category values; labels are the Indonesian display
// strings shown to users. Links must use category.value (English) in the URL.
export const CATEGORIES = [
  { value: "Automotive", label: "Otomotif", icon: "wrench", tone: "mint" },
  { value: "Electronics", label: "Elektronika", icon: "cpu", tone: "blue" },
  { value: "Electrical", label: "Kelistrikan", icon: "zap", tone: "amber" },
  { value: "Construction", label: "Konstruksi", icon: "hammer", tone: "peach" },
  {
    value: "Machining & Welding",
    label: "Pemesinan & Pengelasan",
    icon: "cog",
    tone: "lavender",
  },
];

export default function CategoryRow() {
  return (
    <div className="category-row">
      {CATEGORIES.map((category) => (
        <Link
          to={`/konten?category=${encodeURIComponent(category.value)}`}
          className="category-item"
          key={category.value}
        >
          <span className={`category-icon tone-${category.tone}`}>
            <Icon name={category.icon} size={21} />
          </span>
          <span className="category-label">{category.label}</span>
        </Link>
      ))}
    </div>
  );
}
