import { useEffect, useState } from 'react'
import authApi from '../services/authApi'

function useAllJobs() {
  const [allJobs, setAllJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadJobs() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const response = await authApi.get('/job/get')
        const jobs = Array.isArray(response.data?.jobs) ? response.data.jobs : []

        if (isMounted) {
          setAllJobs(jobs)
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage('Jobs load nahi ho paye. Please backend run karo.')
          setAllJobs([])
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadJobs()

    return () => {
      isMounted = false
    }
  }, [])

  return { allJobs, isLoading, errorMessage }
}

export default useAllJobs
