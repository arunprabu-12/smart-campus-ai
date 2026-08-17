import apiClient from './client'

export const getCoursesForSemester = (semesterId) => apiClient.get(`/courses/semester/${semesterId}`)
export const getCourse = (courseId) => apiClient.get(`/courses/${courseId}`)
export const getCourseProgress = (courseId) => apiClient.get(`/courses/${courseId}/progress`)
export const getCourseVideos = (courseId, topic = '') => apiClient.get(`/courses/${courseId}/videos`, { params: { topic } })
export const markTopicComplete = (topicId) => apiClient.post(`/students/me/topics/${topicId}/complete`)
