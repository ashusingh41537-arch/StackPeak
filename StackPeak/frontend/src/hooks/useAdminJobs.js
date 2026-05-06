import { useCallback, useEffect, useState } from 'react'
import { getAdminJobs } from '../services/adminJobApi'

function useAdminJobs(token) {
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const reloadJobs = useCallback(async () => {
    if (!token) {
      setJobs([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setErrorMessage('')

    try {
      const data = await getAdminJobs(token)
      const list = Array.isArray(data?.jobs) ? data.jobs : []
      setJobs(list)
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Jobs load nahi hue.')
      setJobs([])
    } finally {
      setIsLoading(false)
    }
  }, [token])

  useEffect(() => {
    reloadJobs()
  }, [reloadJobs])

  return { jobs, isLoading, errorMessage, reloadJobs }
}

export default useAdminJobs
