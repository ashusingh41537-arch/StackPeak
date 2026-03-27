import { useEffect, useState } from 'react'
import { getAppliedJobs } from '../services/jobApi'

function useAppliedJobs(token) {
  const [appliedJobs, setAppliedJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadAppliedJobs() {
      if (!token) {
        setAppliedJobs([])
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setErrorMessage('')

      try {
        const data = await getAppliedJobs(token)
        const list = Array.isArray(data?.applications) ? data.applications : []

        if (isMounted) {
          setAppliedJobs(list)
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error?.response?.data?.message || 'Applied jobs load nahi ho paye.')
          setAppliedJobs([])
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadAppliedJobs()

    return () => {
      isMounted = false
    }
  }, [token])

  return { appliedJobs, isLoading, errorMessage }
}

export default useAppliedJobs
