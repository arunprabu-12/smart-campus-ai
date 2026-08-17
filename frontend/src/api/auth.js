import apiClient from './client'

export const registerStudent = (payload) => apiClient.post('/auth/register', payload)
export const loginStudent = (payload) => apiClient.post('/auth/login', payload)
