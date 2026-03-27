import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5024/api/v1'

const authApi = axios.create({
  baseURL: API_BASE_URL,
})

export async function registerUser(formValues) {
  // Backend expects JSON body mapped to RegisterRequest.
  const payload = {
    fullname: formValues.fullName,
    email: formValues.email,
    phoneNumber: formValues.phoneNumber,
    password: formValues.password,
    role: formValues.role,
  }

  const response = await authApi.post('/user/register', payload)
  return response.data
}

export async function loginUser(credentials) {
  const response = await authApi.post('/user/login', credentials)
  return response.data
}

export async function getMyProfile(token) {
  const response = await authApi.get('/user/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export async function updateMyProfile(formValues, token) {
  const formData = new FormData()
  formData.append('FullName', formValues.fullName || '')
  formData.append('PhoneNumber', formValues.phoneNumber || '')
  formData.append('Bio', formValues.bio || '')
  formData.append('Skills', formValues.skills || '')

  if (formValues.profileImage) {
    formData.append('profileImage', formValues.profileImage)
  }

  if (formValues.resume) {
    formData.append('resume', formValues.resume)
  }

  const response = await authApi.put('/user/profile/update', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export default authApi