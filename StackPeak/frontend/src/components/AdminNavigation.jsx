import { NavLink } from 'react-router-dom'

function AdminNavigation() {
  return (
    <aside className="pp-admin-nav">
      <h2>Admin Panel</h2>
      <nav className="pp-admin-links">
        <NavLink to="/admin" end>
          Dashboard
        </NavLink>
        <NavLink to="/admin/companies">Manage Companies</NavLink>
        <NavLink to="/admin/jobs">Manage Jobs</NavLink>
        <NavLink to="/admin/users">Manage Users</NavLink>
      </nav>
    </aside>
  )
}

export default AdminNavigation
