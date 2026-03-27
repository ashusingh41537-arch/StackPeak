import authApi from './authApi'

export async function getAdminCompanies(token) {
  const response = await authApi.get('/company/get', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export async function createCompany(token, companyName) {
  const response = await authApi.post(
    '/company/register',
    { name: companyName },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  return response.data
}

export async function updateCompany(token, companyId, formValues) {
  const formData = new FormData()
  formData.append('name', formValues.name || '')
  formData.append('description', formValues.description || '')
  formData.append('website', formValues.website || '')
  formData.append('location', formValues.location || '')

  if (formValues.logoFile) {
    formData.append('file', formValues.logoFile)
  }

  const response = await authApi.put(`/company/update/${companyId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export async function deleteCompany(token, companyId) {
  const response = await authApi.delete(`/company/delete/${companyId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}