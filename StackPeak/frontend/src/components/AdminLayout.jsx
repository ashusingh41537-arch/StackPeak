import { Outlet } from 'react-router-dom'
import AdminNavigation from './AdminNavigation'

function AdminLayout() {
  return (
    <section className="pp-admin-layout">
      <AdminNavigation />
      <main className="pp-admin-main">
        <Outlet />
      </main>
    </section>
  )
}

export default AdminLayout
