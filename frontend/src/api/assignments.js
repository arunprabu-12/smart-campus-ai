import apiClient from './client'

export const getAssignments = (courseId) => apiClient.get(`/assignments/course/${courseId}`)
export const submitAssignment = (payload) => apiClient.post('/assignments/submit', payload)
