import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import useAdminUsers from '../hooks/useAdminUsers'
import { updateUserRole } from '../services/adminUserApi'

function AdminUsersPage() {
  const token = useSelector((state) => state.auth.token)
  const currentUserId = useSelector((state) => state.auth.user?.id)
  const { users, isLoading, errorMessage, reloadUsers } = useAdminUsers(token)

  const [searchText, setSearchText] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [actionMessage, setActionMessage] = useState('')

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const text = `${user.fullName || ''} ${user.email || ''} ${user.phoneNumber || ''}`.toLowerCase()
      const matchesSearch = text.includes(searchText.toLowerCase())
      const matchesRole = roleFilter === 'all' || (user.role || '').toLowerCase() === roleFilter
      return matchesSearch && matchesRole
    })
  }, [users, searchText, roleFilter])

  async function onRoleChange(userId, nextRole) {
    if (!token) return

    setActionMessage('')
    try {
      const data = await updateUserRole(token, userId, nextRole)
      setActionMessage(data?.message || 'Role updated.')
      await reloadUsers()
    } catch (error) {
      setActionMessage(error?.response?.data?.message || 'Role update failed.')
    }
  }

  return (
    <section>
      <h1 className="pp-page-title">Admin Users</h1>

      <div className="pp-filter-row">
        <input
          className="pp-text-input"
          placeholder="Search by name, email, phone..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <select className="pp-select-input" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="student">Student</option>
        </select>
      </div>

      {isLoading ? <p className="pp-info-line">Loading users...</p> : null}
      {errorMessage ? <p className="pp-error-block">{errorMessage}</p> : null}
      {actionMessage ? <p className="pp-info-line">{actionMessage}</p> : null}

      <div className="pp-list">
        {filteredUsers.map((user) => (
          <article className="pp-card" key={user.id}>
            <h2>{user.fullName || 'User'}</h2>
            <p>{user.email || '-'}</p>
            <p>{user.phoneNumber || '-'}</p>
            <p>Current Role: {(user.role || 'student').toUpperCase()}</p>

            <div className="pp-action-row">
              <select
                className="pp-select-input"
                value={(user.role || 'student').toLowerCase()}
                onChange={(e) => onRoleChange(user.id, e.target.value)}
                disabled={user.id === currentUserId}
              >
                <option value="admin">Admin</option>
                <option value="student">Student</option>
              </select>
            </div>
            {user.id === currentUserId ? (
              <p className="pp-info-line">Aapka role yahan lock hai.</p>
            ) : null}
          </article>
        ))}
      </div>

      {!isLoading && filteredUsers.length === 0 ? (
        <p className="pp-info-line">Koi user match nahi hua.</p>
      ) : null}
    </section>
  )
}

export default AdminUsersPage
