import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { clearAuthError, login } from '../features/auth/authSlice'

function validateLogin(values) {
  const errors = {}

  if (!values.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = 'Please enter a valid email.'
  }

  if (!values.password.trim()) {
    errors.password = 'Password is required.'
  }

  if (!['student', 'admin'].includes(values.role)) {
    errors.role = 'Role must be student or admin.'
  }

  return errors
}

function LoginPage() {
  const [values, setValues] = useState({ email: '', password: '', role: 'student' })
  const [fieldErrors, setFieldErrors] = useState({})
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { loading, error, token } = useSelector((state) => state.auth)
  const from = location.state?.from?.pathname || '/'

  useEffect(() => {
    if (token) {
      navigate(from, { replace: true })
    }
  }, [token, navigate, from])

  useEffect(() => {
    return () => {
      dispatch(clearAuthError())
    }
  }, [dispatch])

  function onChange(event) {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
    setFieldErrors((prev) => ({ ...prev, [name]: '' }))
  }

  async function onSubmit(event) {
    event.preventDefault()
    const errors = validateLogin(values)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    await dispatch(login(values))
  }

  return (
    <section className="pp-auth-shell">
      <form className="pp-auth-card" onSubmit={onSubmit}>
        <h1>Login</h1>
        <p>Sign in to continue to PrimePulse dashboard.</p>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="rahul@test.com"
          value={values.email}
          onChange={onChange}
        />
        {fieldErrors.email ? <span className="pp-error">{fieldErrors.email}</span> : null}

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Enter password"
          value={values.password}
          onChange={onChange}
        />
        {fieldErrors.password ? (
          <span className="pp-error">{fieldErrors.password}</span>
        ) : null}

        <label htmlFor="role">Role</label>
        <select id="role" name="role" value={values.role} onChange={onChange}>
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>
        {fieldErrors.role ? <span className="pp-error">{fieldErrors.role}</span> : null}

        {error ? <div className="pp-error-block">{error}</div> : null}

        <button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>
        <small>
          New user? <Link to="/signup">Create account</Link>
        </small>
      </form>
    </section>
  )
}

export default LoginPage