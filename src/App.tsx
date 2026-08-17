import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Public Pages
import { HomePage } from './pages/HomePage';
import { JobsPage } from './pages/JobsPage';
import { JobDetailPage } from './pages/JobDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Job Seeker Pages
import { SeekerDashboardPage } from './pages/seeker/SeekerDashboardPage';
import { SavedJobsPage } from './pages/seeker/SavedJobsPage';
import { SeekerProfilePage } from './pages/seeker/SeekerProfilePage';

// Employer Pages
import { EmployerDashboardPage } from './pages/employer/EmployerDashboardPage';
import { PostJobPage } from './pages/employer/PostJobPage';
import { EmployerApplicationsPage } from './pages/employer/EmployerApplicationsPage';
import { EmployerProfilePage } from './pages/employer/EmployerProfilePage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <div className="min-h-screen bg-[#FBFBFA] flex flex-col text-slate-900 font-sans antialiased selection:bg-[#6DD5C4]/30 selection:text-slate-900">
            <ScrollToTop />
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Discovery & Auth Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/jobs" element={<JobsPage />} />
                <Route path="/jobs/:id" element={<JobDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Job Seeker Protected Routes */}
                <Route
                  path="/seeker/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['job_seeker', 'admin']}>
                      <SeekerDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/seeker/saved"
                  element={
                    <ProtectedRoute allowedRoles={['job_seeker', 'admin']}>
                      <SavedJobsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/seeker/profile"
                  element={
                    <ProtectedRoute allowedRoles={['job_seeker', 'admin']}>
                      <SeekerProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Employer Protected Routes */}
                <Route
                  path="/employer/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['employer', 'admin']}>
                      <EmployerDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/employer/post-job"
                  element={
                    <ProtectedRoute allowedRoles={['employer', 'admin']}>
                      <PostJobPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/employer/edit-job/:id"
                  element={
                    <ProtectedRoute allowedRoles={['employer', 'admin']}>
                      <PostJobPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/employer/applications"
                  element={
                    <ProtectedRoute allowedRoles={['employer', 'admin']}>
                      <EmployerApplicationsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/employer/profile"
                  element={
                    <ProtectedRoute allowedRoles={['employer', 'admin']}>
                      <EmployerProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Protected Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Fallback */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
