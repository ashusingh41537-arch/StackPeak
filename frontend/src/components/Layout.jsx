import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div className="pp-shell" id="top">
      <Navbar />
      <main className="pp-main">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
