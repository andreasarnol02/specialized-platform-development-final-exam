import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, booting } = useAuth();
  const location = useLocation();

  if (booting) return null;

  if (!user) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/konten" replace />;
  }

  return children;
}
