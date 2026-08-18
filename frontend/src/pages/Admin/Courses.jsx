import { useState, useEffect } from 'react'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Modal } from '../../components/ui/Modal'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { semestersData } from '../../data/coursesData'

export default function Courses() {
  const { api } = useAdminAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [semFilter, setSemFilter] = useState('')
  const [deptFilter, setDeptFilter] = useState('')

  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [showUnitsModal, setShowUnitsModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState(null)

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    semester: 5,
    department: 'AIDS',
    credits: 4,
    faculty: 'Kapil Dev',
    units: 5
  })

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin-auth/courses')
      setCourses(res.data || [])
    } catch {
      setCourses([
        { id: 1, code: 'AI3501', name: 'Deep Learning Architectures', semester: 5, department: 'AIDS', credits: 4, faculty: 'Kapil Dev', units: 5, topicsCount: 25, studentsCount: 64 },
        { id: 2, code: 'AI3502', name: 'Generative AI & LLMs', semester: 5, department: 'AIDS', credits: 3, faculty: 'Jayasree M', units: 5, topicsCount: 22, studentsCount: 64 },
        { id: 3, code: 'AI3503', name: 'Agentic AI Frameworks', semester: 5, department: 'AIDS', credits: 4, faculty: 'Madhubala K', units: 5, topicsCount: 20, studentsCount: 64 },
        { id: 4, code: 'AI3504', name: 'Manufacturing AI Systems', semester: 5, department: 'AIDS', credits: 3, faculty: 'Selvarani R', units: 5, topicsCount: 18, studentsCount: 64 },
        { id: 5, code: 'AI3505', name: 'Cloud & Vector Databases', semester: 5, department: 'AIDS', credits: 3, faculty: 'Divya S', units: 5, topicsCount: 19, studentsCount: 64 },
      ])
    }
    setLoading(false)
  }

  const handleSaveCourse = (e) => {
    e.preventDefault()
    const newC = { id: Date.now(), ...formData, topicsCount: 20, studentsCount: 64 }
    setCourses(prev => [newC, ...prev])
    setShowAddModal(false)
    alert('New course created successfully!')
  }

  const handleDeleteCourse = () => {
    if (!courseToDelete) return
    setCourses(prev => prev.filter(c => c.id !== courseToDelete.id))
    setCourseToDelete(null)
  }

  const { admin } = useAdminAuth()

  const filtered = courses.filter(c => {
    if (semFilter && String(c.semester) !== String(semFilter)) return false
    if (deptFilter && c.department !== deptFilter) return false
    
    // Staff role filter based on assigned courses
    if (admin?.role === 'staff') {
      const staffDept = admin.department || '';
      const staffName = admin.full_name || '';
      
      const assignedCourses = staffDept.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
      
      const matchesFaculty = c.faculty?.toLowerCase().includes(staffName.toLowerCase()) || staffName.toLowerCase().includes(c.faculty?.toLowerCase());
      const matchesAssigned = assignedCourses.some(assigned => 
        c.name.toLowerCase().includes(assigned) || 
        assigned.includes(c.name.toLowerCase()) ||
        c.code.toLowerCase().includes(assigned)
      );
      
      if (!matchesFaculty && !matchesAssigned) return false;
    }
    
    return true
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Course & Curriculum Management"
        description="Department → Semester → Course → Units → Topics academic hierarchy."
        action={
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            + Add New Course
          </Button>
        }
      />

      {/* Filter Bar */}
      <Card p="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
          <Select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
            <option value="">All Departments</option>
            <option value="AIDS">AIDS</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
          </Select>
          <Select value={semFilter} onChange={(e) => setSemFilter(e.target.value)}>
            <option value="">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
              <option key={s} value={s}>Semester {s}</option>
            ))}
          </Select>
        </div>
      </Card>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(course => (
          <Card key={course.id} p="p-6" className="space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                  {course.code}
                </span>
                <Badge variant="info">Sem {course.semester}</Badge>
              </div>

              <h4 className="font-bold text-slate-900 dark:text-white text-base leading-snug">
                {course.name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Faculty: <span className="font-semibold text-slate-700 dark:text-slate-300">{course.faculty}</span>
              </p>

              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 text-center">
                <div className="bg-slate-50 dark:bg-slate-800/80 p-2 rounded-lg">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{course.credits}</p>
                  <p className="text-[10px] text-slate-400">Credits</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/80 p-2 rounded-lg">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{course.units}</p>
                  <p className="text-[10px] text-slate-400">Units</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/80 p-2 rounded-lg">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{course.studentsCount || 64}</p>
                  <p className="text-[10px] text-slate-400">Students</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => { setSelectedCourse(course); setShowUnitsModal(true); }}
              >
                View Units & Topics
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => { setCourseToDelete(course); setShowDeleteConfirm(true); }}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Course Modal */}
      {showAddModal && (
        <Modal isOpen={true} onClose={() => setShowAddModal(false)} title="Create New Course">
          <form onSubmit={handleSaveCourse} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Course Code</label>
                <Input required value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} placeholder="e.g. AI3506" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Course Name</label>
                <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Computer Vision" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Semester</label>
                <Select value={formData.semester} onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Sem {s}</option>)}
                </Select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Credits</label>
                <Input type="number" min="1" max="6" value={formData.credits} onChange={(e) => setFormData({ ...formData, credits: Number(e.target.value) })} />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Units</label>
                <Input type="number" min="1" max="10" value={formData.units} onChange={(e) => setFormData({ ...formData, units: Number(e.target.value) })} />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Assigned Faculty</label>
              <Input required value={formData.faculty} onChange={(e) => setFormData({ ...formData, faculty: e.target.value })} placeholder="e.g. Dr. Kumar" />
            </div>
            <div className="flex justify-end gap-2 pt-3">
              <Button variant="outline" type="button" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button variant="primary" type="submit">Create Course</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Units & Topics Hierarchy View Modal */}
      {showUnitsModal && selectedCourse && (() => {
        let staticCourseMatch = null;
        for (const semNum in semestersData) {
          const found = semestersData[semNum].find(c => c.course_code === selectedCourse.code);
          if (found) {
            staticCourseMatch = found;
            break;
          }
        }
        
        return (
          <Modal isOpen={true} onClose={() => setShowUnitsModal(false)} title={`${selectedCourse.code} — Units & Topics Breakdown`}>
            <div className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Department: {selectedCourse.department} | Semester: {selectedCourse.semester} | Faculty: {selectedCourse.faculty}
              </p>

              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {staticCourseMatch ? (
                  staticCourseMatch.units.map((unit, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <h5 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                        Unit {idx + 1}: {unit.title}
                      </h5>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                        🎯 Objectives: {unit.learning_objectives}
                      </p>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300">
                        <strong>Topics:</strong> {unit.topics?.join(', ')}
                      </p>
                    </div>
                  ))
                ) : (
                  [1, 2, 3, 4, 5].map(unitNum => (
                    <div key={unitNum} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <h5 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                        Unit {unitNum}: Fundamental Concepts of Module {unitNum}
                      </h5>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Topics: Key theoretical principles, architecture, mathematical formulation, practical lab exercises, and assignment unit questions.
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="outline" onClick={() => setShowUnitsModal(false)}>Close</Button>
              </div>
            </div>
          </Modal>
        );
      })()}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteCourse}
        title="Delete Course"
        message={`Are you sure you want to delete ${courseToDelete?.name} (${courseToDelete?.code})? This will remove all associated unit records.`}
        confirmLabel="Delete Course"
        isDanger={true}
      />
    </div>
  )
}
