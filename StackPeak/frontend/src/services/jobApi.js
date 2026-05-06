import authApi from './authApi'

export async function getJobById(jobId) {
  const response = await authApi.get(`/job/get/${jobId}`)
  return response.data
}

export async function applyJob(jobId, token) {
  const response = await authApi.get(`/application/apply/${jobId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export async function getAppliedJobs(token) {
  const response = await authApi.get('/application/get', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export async function getApplicantsByJob(jobId, token) {
  const response = await authApi.get(`/application/${jobId}/applicants`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export async function updateApplicantStatus(applicationId, status, token) {
  const response = await authApi.post(`/application/status/${applicationId}/update`, JSON.stringify(status), {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  return response.data
}
