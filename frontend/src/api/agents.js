import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const getPeerMatches = () => {
  return apiClient.get('/students/peer-match')
}

export const generateQuiz = (courseId) => {
  return apiClient.get(`/advisor/generate-quiz/${courseId}`)
}

export const searchSmart = (query) => {
  return apiClient.post('/search/', { query })
}
