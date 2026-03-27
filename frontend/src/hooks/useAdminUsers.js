import { useCallback, useEffect, useState } from 'react'
import { getAdminUsers } from '../services/adminUserApi'

function useAdminUsers(token) {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const reloadUsers = useCallback(async () => {
    if (!token) {
      setUsers([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setErrorMessage('')

    try {
      const data = await getAdminUsers(token)
      const list = Array.isArray(data?.users) ? data.users : []
      setUsers(list)
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Users load nahi hue.')
      setUsers([])
    } finally {
      setIsLoading(false)
    }
  }, [token])

  useEffect(() => {
    reloadUsers()
  }, [reloadUsers])

  return { users, isLoading, errorMessage, reloadUsers }
}

export default useAdminUsers
