/** Spec section 4 — course/unit/topic view with study/video/notes/practice buttons. */
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getCourse, getCourseProgress, markTopicComplete, getCourseVideos } from '../api/courses'
import ProgressBar from '../components/ProgressBar'
import VideoCard from '../components/VideoCard'
import apiClient from '../api/client'

function TopicRow({ topic, unitTitle, courseId, onComplete }) {
  const [done, setDone] = useState(false)
  const [videos, setVideos] = useState([])
  const [showVideos, setShowVideos] = useState(false)
  const [showNotes, setShowNotes] = useState(false)

  const handleComplete = async () => {
    try {
      await markTopicComplete(topic.id)
      setDone(true)
      onComplete()
    } catch {}
  }

  const handleFetchVideos = async () => {
    if (showVideos) { setShowVideos(false); return }
    try {
      const res = await getCourseVideos(courseId, topic.title)
      setVideos(res.data.videos || [])
      setShowVideos(true)
    } catch {}
  }

  return (
    <div className={`p-4 rounded-xl border ${done ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className={`text-lg ${done ? '✅' : '📖'}`}>{done ? '✅' : '📖'}</span>
          <div>
            <p className={`font-medium text-sm ${done ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}`}>
              {topic.title}
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          {!done && (
            <button
              onClick={handleComplete}
              id={`topic-complete-${topic.id}`}
              className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              ✓ Done
            </button>
          )}
        </div>
      </div>

    </div>
  )
}

export default function CoursePage() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [progress, setProgress] = useState({ progress_pct: 0, completed: 0, total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [docBank, setDocBank] = useState([])

  const loadProgress = async () => {
    try {
      const pRes = await getCourseProgress(courseId)
      setProgress(pRes.data)
    } catch {}
  }

  useEffect(() => {
    const load = async () => {
      try {
        const [cRes] = await Promise.all([getCourse(courseId), loadProgress()])
        setCourse(cRes.data)
        
        // Fetch document bank as fallback
        try {
          const docRes = await apiClient.get('/question-bank/assignments')
          setDocBank(docRes.data || [])
        } catch(e) {}
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load course.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [courseId])

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"/></div>
  if (error) return <div className="p-4 text-red-600 dark:text-red-400 text-sm">{error}</div>
  if (!course) return null

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Course header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-purple-200 text-sm font-mono">{course.course_code}</p>
            <h2 className="text-2xl font-bold mt-1">{course.course_name}</h2>
            <p className="text-purple-200 text-sm mt-1">{course.credits} Credits</p>
          </div>
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
            {progress.progress_pct}% Complete
          </span>
        </div>
        {course.description && (
          <p className="mt-3 text-purple-100 text-sm">{course.description}</p>
        )}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-purple-200 mb-1">
            <span>Topics: {progress.completed} / {progress.total}</span>
            <span>{progress.progress_pct}%</span>
          </div>
          <div className="w-full bg-purple-500/40 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all"
              style={{ width: `${progress.progress_pct}%` }}
            />
          </div>
        </div>

        {/* Action Buttons for Assignments, Tests, Reports */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => navigate(`/assignments?courseId=${courseId}`)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors border border-white/20"
          >
            📋 Assignments
          </button>
          <button
            onClick={() => navigate(`/tests?courseId=${courseId}`)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors border border-white/20"
          >
            📝 Tests
          </button>
          <button
            onClick={() => navigate(`/results?courseId=${courseId}`)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors border border-white/20"
          >
            📊 Reports
          </button>
        </div>
      </div>

      {/* Units and topics */}
      {course.units?.length === 0 && docBank.length > 0 && (
        <div className="space-y-4">
          <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl border border-yellow-200">
            <strong>Note:</strong> Database units are empty. Populating course content directly from Document Bank.
          </div>
          {docBank.map((cDoc, idx) => (
             <div key={idx} className="space-y-4">
               {cDoc.units.map((unit, uIdx) => (
                 <div key={uIdx} className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
                   <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                     <h3 className="font-semibold text-gray-900 dark:text-white">{cDoc.course_name}: {unit.unit_name}</h3>
                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{unit.questions.length} topics</p>
                   </div>
                   <div className="p-4 space-y-3">
                     {unit.questions.map((q, qIdx) => (
                       <TopicRow
                         key={qIdx}
                         topic={{ id: `doc-${qIdx}`, title: q.text, notes: q.answer }}
                         unitTitle={unit.unit_name}
                         courseId={courseId}
                         onComplete={() => {}}
                       />
                     ))}
                   </div>
                 </div>
               ))}
             </div>
          ))}
        </div>
      )}

      {course.units?.length === 0 && docBank.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400">No units added yet.</p>
      )}

      {course.units?.length > 0 && course.units.map((unit) => (
        <div key={unit.id} className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <h3 className="font-semibold text-gray-900 dark:text-white">{unit.title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{unit.topics?.length || 0} topics</p>
          </div>
          <div className="p-4 space-y-3">
            {unit.topics?.length === 0 && (
              <p className="text-xs text-gray-400">No topics in this unit.</p>
            )}
            {unit.topics?.map((topic) => (
              <TopicRow
                key={topic.id}
                topic={topic}
                unitTitle={unit.title}
                courseId={courseId}
                onComplete={loadProgress}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
