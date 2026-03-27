import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

function PublicRoute() {
  const token = useSelector((state) => state.auth.token)

  if (token) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default PublicRoute
