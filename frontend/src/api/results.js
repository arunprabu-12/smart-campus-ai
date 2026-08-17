import apiClient from './client'

export const getResultSummary = () => apiClient.get('/results/student/summary')
export const getTopicWise = () => apiClient.get('/results/student/topic-wise')
export const getTestWise = () => apiClient.get('/results/student/test-wise')
export const getSemesterResult = (semesterId) => apiClient.get(`/results/student/semester/${semesterId}`)
