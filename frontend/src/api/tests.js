import apiClient from './client'

export const getTests = (courseId) => apiClient.get(`/tests/course/${courseId}`)
export const getTest = (testId) => apiClient.get(`/tests/${testId}`)
export const startTest = (testId) => apiClient.post(`/tests/${testId}/start`)
export const submitTest = (attemptId, answers, timeTakenSeconds) =>
  apiClient.post(`/tests/attempt/${attemptId}/submit`, {
    answers,
    time_taken_seconds: timeTakenSeconds,
  })
