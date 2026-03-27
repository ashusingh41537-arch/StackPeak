import authApi from './authApi'

export async function getAdminJobs(token) {
  const response = await authApi.get('/job/getadminjobs', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export async function createAdminJob(token, payload) {
  const response = await authApi.post('/job/post', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export async function updateAdminJob(token, jobId, payload) {
  const response = await authApi.put(`/job/update/${jobId}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export async function deleteAdminJob(token, jobId) {
  const response = await authApi.delete(`/job/delete/${jobId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}
