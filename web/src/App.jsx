import { Routes, Route } from "react-router";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AnalyticsTracker from "./components/AnalyticsTracker";
import HomePage from "./pages/HomePage";
import ContentsPage from "./pages/ContentsPage";
import ContentDetailPage from "./pages/ContentDetailPage";
import BookmarksPage from "./pages/BookmarksPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminContentsPage from "./admin/pages/AdminContentsPage";
import AdminContentFormPage from "./admin/pages/AdminContentFormPage";
import { AuthProvider } from "./context/AuthContext";

function AppShell() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="container app-main">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/konten"
            element={
              <ProtectedRoute>
                <ContentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/konten/:id"
            element={
              <ProtectedRoute>
                <ContentDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookmark"
            element={
              <ProtectedRoute>
                <BookmarksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/konten"
            element={
              <AdminRoute>
                <AdminContentsPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/konten/baru"
            element={
              <AdminRoute>
                <AdminContentFormPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/konten/:id/edit"
            element={
              <AdminRoute>
                <AdminContentFormPage />
              </AdminRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <footer className="footer">
        <div className="container">
          2026 My Skill - Proyek Kelompok
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <>
      <AnalyticsTracker />
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </>
  );
}
