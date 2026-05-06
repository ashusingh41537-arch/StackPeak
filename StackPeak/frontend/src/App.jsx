import { Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout from './components/AdminLayout'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import RoleBasedRoute from './components/RoleBasedRoute'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminJobsPage from './pages/AdminJobsPage'
import AdminApplicantsPage from './pages/AdminApplicantsPage'
import AdminCompaniesPage from './pages/AdminCompaniesPage'
import AdminUsersPage from './pages/AdminUsersPage'
import ApplicationsPage from './pages/ApplicationsPage'
import BrowsePage from './pages/BrowsePage'
import CompaniesPage from './pages/CompaniesPage'
import HomePage from './pages/HomePage'
import JobDetailsPage from './pages/JobDetailsPage'
import JobsPage from './pages/JobsPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import UserProfilePage from './pages/UserProfilePage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:jobId" element={<JobDetailsPage />} />
        <Route path="/browse" element={<BrowsePage />} />

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
        </Route>

        <Route element={<RoleBasedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="companies" element={<AdminCompaniesPage />} />
            <Route path="jobs" element={<AdminJobsPage />} />
            <Route path="jobs/:jobId/applicants" element={<AdminApplicantsPage />} />
            <Route path="users" element={<AdminUsersPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
