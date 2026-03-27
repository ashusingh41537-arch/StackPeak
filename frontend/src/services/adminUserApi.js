import authApi from './authApi'

export async function getAdminUsers(token) {
  const response = await authApi.get('/user/admin/all', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export async function updateUserRole(token, userId, role) {
  const response = await authApi.put(
    `/user/admin/role/${userId}`,
    { role },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  return response.data
}
