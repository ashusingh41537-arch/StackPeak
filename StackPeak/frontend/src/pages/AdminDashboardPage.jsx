import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useAdminCompanies from '../hooks/useAdminCompanies'
import useAdminJobs from '../hooks/useAdminJobs'
import useAdminUsers from '../hooks/useAdminUsers'

function AdminDashboardPage() {
  const token = useSelector((state) => state.auth.token)

  const { companies } = useAdminCompanies(token)
  const { jobs } = useAdminJobs(token)
  const { users } = useAdminUsers(token)

  const totalCompanies = companies.length
  const totalJobs = jobs.length
  const totalUsers = users.length

  const recentJobs = jobs.slice(0, 5)

  return (
    <section>
      <h1 className="pp-page-title">Admin Dashboard</h1>

      {/* 🔢 Stats Cards */}
      <div className="pp-list">
        <article className="pp-card">
          <h2>Total Companies</h2>
          <p>{totalCompanies}</p>
        </article>

        <article className="pp-card">
          <h2>Total Jobs</h2>
          <p>{totalJobs}</p>
        </article>

        <article className="pp-card">
          <h2>Total Users</h2>
          <p>{totalUsers}</p>
        </article>
      </div>

      {/* ⚡ Quick Actions */}
      <div className="pp-list">
        <article className="pp-card">
          <h2>Quick Actions</h2>
          <div className="pp-action-row">
            <Link to="/admin/companies" className="pp-link-btn">
              Manage Companies
            </Link>
            <Link to="/admin/jobs" className="pp-link-btn">
              Manage Jobs
            </Link>
            <Link to="/admin/users" className="pp-link-btn">
              Manage Users
            </Link>
          </div>
        </article>
      </div>

      {/* 🆕 Recent Jobs */}
      <div className="pp-list">
        <article className="pp-card">
          <h2>Recent Jobs</h2>

          {recentJobs.length === 0 ? (
            <p>No jobs found.</p>
          ) : (
            <ul className="pp-simple-list">
              {recentJobs.map((job) => (
                <li key={job.id}>
                  {job.title} - {job.location}
                </li>
              ))}
            </ul>
          )}
        </article>
      </div>
    </section>
  )
}

export default AdminDashboardPage