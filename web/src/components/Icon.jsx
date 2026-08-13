import {
  ArrowRight,
  Book,
  Bookmark,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Cog,
  Cpu,
  FileText,
  Film,
  Grid2X2,
  Hammer,
  Home,
  LogOut,
  Map,
  Pencil,
  Play,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  User,
  Wrench,
  Zap,
} from "lucide-react";

const ICONS = {
  arrowRight: ArrowRight,
  book: Book,
  bookmark: Bookmark,
  chevron: ChevronDown,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  clock: Clock,
  cog: Cog,
  cpu: Cpu,
  edit: Pencil,
  fileText: FileText,
  film: Film,
  grid: Grid2X2,
  hammer: Hammer,
  home: Home,
  logout: LogOut,
  map: Map,
  play: Play,
  plus: Plus,
  search: Search,
  shield: ShieldCheck,
  spark: Sparkles,
  star: Star,
  trash: Trash2,
  user: User,
  wrench: Wrench,
  zap: Zap,
};

export default function Icon({ name, size = 18, strokeWidth = 1.9, ...props }) {
  const IconComponent = ICONS[name] || Sparkles;
  return (
    <IconComponent
      size={size}
      strokeWidth={strokeWidth}
      aria-hidden="true"
      {...props}
    />
  );
}
