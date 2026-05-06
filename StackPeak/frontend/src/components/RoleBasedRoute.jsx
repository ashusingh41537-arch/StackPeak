import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

function RoleBasedRoute({ allowedRoles = [] }) {
  const token = useSelector((state) => state.auth.token)
  const userRole = useSelector((state) => state.auth.user?.role)
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  const normalizedRole = (userRole || '').toLowerCase()
  const normalizedAllowedRoles = allowedRoles.map((role) => role.toLowerCase())
  const hasAccess = normalizedAllowedRoles.includes(normalizedRole)

  if (!hasAccess) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default RoleBasedRoute
