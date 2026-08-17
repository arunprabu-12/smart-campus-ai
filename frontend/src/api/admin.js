import apiClient from './client'

// Departments, regulations, semesters
export const getDepartments = () => apiClient.get('/admin/departments')
export const createDepartment = (payload) => apiClient.post('/admin/departments', payload)
export const getRegulations = () => apiClient.get('/admin/regulations')
export const createRegulation = (payload) => apiClient.post('/admin/regulations', payload)
export const getSemesters = (regulationId) => apiClient.get('/admin/semesters', { params: { regulation_id: regulationId } })
export const createSemester = (payload) => apiClient.post('/admin/semesters', payload)

// Courses
export const adminGetCourses = (semesterId) => apiClient.get('/admin/courses', { params: { semester_id: semesterId } })
export const adminCreateCourse = (payload) => apiClient.post('/admin/courses', payload)
export const adminUpdateCourse = (id, payload) => apiClient.put(`/admin/courses/${id}`, payload)
export const adminDeleteCourse = (id) => apiClient.delete(`/admin/courses/${id}`)

// Units & Topics
export const createUnit = (payload) => apiClient.post('/admin/units', payload)
export const deleteUnit = (id) => apiClient.delete(`/admin/units/${id}`)
export const createTopic = (payload) => apiClient.post('/admin/topics', payload)
export const updateTopic = (id, payload) => apiClient.put(`/admin/topics/${id}`, payload)
export const deleteTopic = (id) => apiClient.delete(`/admin/topics/${id}`)

// Tests & Questions
export const createTest = (payload) => apiClient.post('/admin/tests', payload)
export const createQuestion = (payload) => apiClient.post('/admin/questions', payload)
export const deleteQuestion = (id) => apiClient.delete(`/admin/questions/${id}`)

// Resources
export const createResource = (payload) => apiClient.post('/admin/resources', payload)

// Students
export const adminGetStudents = (skip = 0, limit = 50) =>
  apiClient.get('/admin/students', { params: { skip, limit } })

// Documents
export const getDocuments = () => apiClient.get('/admin/documents')
export const uploadDocument = (formData) =>
  apiClient.post('/admin/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
