import apiClient from './client'

export const getProfile = () => apiClient.get('/students/me')
export const getDashboard = () => apiClient.get('/students/me/dashboard')
export const markTopicComplete = (topicId) => apiClient.post(`/students/me/topics/${topicId}/complete`)
