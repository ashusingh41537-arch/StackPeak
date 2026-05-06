import { useCallback, useEffect, useState } from 'react'
import { getAdminCompanies } from '../services/companyApi'

function useAdminCompanies(token) {
  const [companies, setCompanies] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const reloadCompanies = useCallback(async () => {
    if (!token) {
      setCompanies([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setErrorMessage('')

    try {
      const data = await getAdminCompanies(token)
      const list = Array.isArray(data?.companies) ? data.companies : []
      setCompanies(list)
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Companies load nahi ho payi.')
      setCompanies([])
    } finally {
      setIsLoading(false)
    }
  }, [token])

  useEffect(() => {
    reloadCompanies()
  }, [reloadCompanies])

  return { companies, isLoading, errorMessage, reloadCompanies }
}

export default useAdminCompanies
