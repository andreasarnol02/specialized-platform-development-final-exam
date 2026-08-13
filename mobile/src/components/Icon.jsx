import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookOpen,
  Calendar,
  Car,
  Check,
  ChevronDown,
  Clock3,
  Grid2X2,
  Heart,
  House,
  Loader2,
  LogOut,
  Map,
  Minus,
  Package,
  Play,
  Plus,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Trash2,
  TriangleAlert,
  User,
  X,
  Zap,
} from "lucide-react-native";
import { theme } from "../theme";

// Icon mapper — subset of the marketplace icon map, adapted for My Skill.
const ICONS = {
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  bolt: Zap,
  book: BookOpen,
  calendar: Calendar,
  bookmark: Bookmark,
  car: Car,
  check: Check,
  chevron: ChevronDown,
  clock: Clock3,
  grid: Grid2X2,
  heart: Heart,
  home: House,
  loader: Loader2,
  logout: LogOut,
  map: Map,
  minus: Minus,
  package: Package,
  phone: Smartphone,
  play: Play,
  plus: Plus,
  search: Search,
  shield: ShieldCheck,
  spark: Sparkles,
  star: Star,
  trash: Trash2,
  user: User,
  warning: TriangleAlert,
  close: X,
};

export default function Icon({
  name,
  size = 18,
  strokeWidth = 1.9,
  color,
  ...props
}) {
  const Cmp = ICONS[name] || Sparkles;
  return (
    <Cmp
      size={size}
      strokeWidth={strokeWidth}
      color={color || theme.colors.ink}
      {...props}
    />
  );
}
