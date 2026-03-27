import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { clearAuthError, signup } from '../features/auth/authSlice'

const initialValues = {
  fullName: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
  role: 'student',
  file: null,
}

function validateSignup(values) {
  const errors = {}

  if (!values.fullName.trim()) {
    errors.fullName = 'Full name is required.'
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = 'Please enter a valid email.'
  }

  if (!values.phoneNumber.trim()) {
    errors.phoneNumber = 'Phone number is required.'
  } else if (!/^\d{10,15}$/.test(values.phoneNumber)) {
    errors.phoneNumber = 'Phone number must be 10-15 digits.'
  }

  if (!values.password.trim()) {
    errors.password = 'Password is required.'
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.'
  }

  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match.'
  }

  if (!['student', 'admin'].includes(values.role)) {
    errors.role = 'Role must be student or admin.'
  }

  return errors
}

function SignupPage() {
  const [values, setValues] = useState(initialValues)
  const [fieldErrors, setFieldErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.auth)

  useEffect(() => {
    return () => {
      dispatch(clearAuthError())
    }
  }, [dispatch])

  function onChange(event) {
    const { name, value, files } = event.target
    if (name === 'file') {
      setValues((prev) => ({ ...prev, file: files?.[0] || null }))
      return
    }

    setValues((prev) => ({ ...prev, [name]: value }))
    setFieldErrors((prev) => ({ ...prev, [name]: '' }))
  }

  async function onSubmit(event) {
    event.preventDefault()
    setSuccessMessage('')

    const errors = validateSignup(values)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    const resultAction = await dispatch(signup(values))
    if (signup.fulfilled.match(resultAction)) {
      setSuccessMessage('Signup successful. Please login to continue.')
      setValues(initialValues)
      setTimeout(() => navigate('/login'), 800)
    }
  }

  return (
    <section className="pp-auth-shell">
      <form className="pp-auth-card" onSubmit={onSubmit}>
        <h1>Signup</h1>
        <p>Create your PrimePulse account.</p>

        <label htmlFor="fullName">Full Name</label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          placeholder="Rahul Sharma"
          value={values.fullName}
          onChange={onChange}
        />
        {fieldErrors.fullName ? <span className="pp-error">{fieldErrors.fullName}</span> : null}

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

        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          id="phoneNumber"
          name="phoneNumber"
          type="text"
          placeholder="9876543210"
          value={values.phoneNumber}
          onChange={onChange}
        />
        {fieldErrors.phoneNumber ? (
          <span className="pp-error">{fieldErrors.phoneNumber}</span>
        ) : null}

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Minimum 6 characters"
          value={values.password}
          onChange={onChange}
        />
        {fieldErrors.password ? <span className="pp-error">{fieldErrors.password}</span> : null}

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Re-enter password"
          value={values.confirmPassword}
          onChange={onChange}
        />
        {fieldErrors.confirmPassword ? (
          <span className="pp-error">{fieldErrors.confirmPassword}</span>
        ) : null}

        <label htmlFor="role">Role</label>
        <select id="role" name="role" value={values.role} onChange={onChange}>
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>
        {fieldErrors.role ? <span className="pp-error">{fieldErrors.role}</span> : null}

        <label htmlFor="file">Profile Photo (optional)</label>
        <input id="file" name="file" type="file" accept="image/*" onChange={onChange} />

        {error ? <div className="pp-error-block">{error}</div> : null}
        {successMessage ? <div className="pp-success-block">{successMessage}</div> : null}

        <button type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Signup'}
        </button>
        <small>
          Already have an account? <Link to="/login">Login</Link>
        </small>
      </form>
    </section>
  )
}

export default SignupPage
