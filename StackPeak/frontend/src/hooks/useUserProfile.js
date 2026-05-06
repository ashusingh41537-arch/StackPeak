import { useEffect, useState } from 'react'
import { getMyProfile } from '../services/authApi'

function useUserProfile(token) {
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  async function reloadProfile() {
    if (!token) {
      setProfile(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setErrorMessage('')

    try {
      const data = await getMyProfile(token)
      setProfile(data?.user || null)
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Profile load nahi hua.')
      setProfile(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    reloadProfile()
  }, [token])

  return { profile, isLoading, errorMessage, reloadProfile }
}

export default useUserProfile
