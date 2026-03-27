import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../features/auth/authSlice'

function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)
  const token = useSelector((state) => state.auth.token)
  const isAdmin = user?.role?.toLowerCase() === 'admin'

  function handleLogout() {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <header className="pp-nav-wrap">
      <nav className="pp-nav">
        <NavLink className="pp-brand" to="/">
          StackPeak
        </NavLink>
        <div className="pp-links">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/jobs">Careers</NavLink>
          <NavLink to="/browse">Explore Roles</NavLink>
          {token ? <NavLink to="/profile">Profile</NavLink> : null}
          {token && isAdmin ? <NavLink to="/admin">Admin</NavLink> : null}
          {token && !isAdmin ? <NavLink to="/companies">Companies</NavLink> : null}
          {token && !isAdmin ? <NavLink to="/applications">Applications</NavLink> : null}
        </div>
        {token ? (
          <div className="pp-nav-actions">
            <span className="pp-user-chip">{user?.fullName || 'User'}</span>
            <button type="button" className="pp-nav-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="pp-nav-actions">
            <button type="button" className="pp-nav-btn" onClick={() => navigate('/login')}>
              Login
            </button>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Navbar
