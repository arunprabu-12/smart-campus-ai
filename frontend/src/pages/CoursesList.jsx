import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { semestersData } from '../data/coursesData'
import { useAuth } from '../context/AuthContext'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { PageHeader } from '../components/ui/PageHeader'

// Mapping of category abbreviations to human-readable names and colors
const CATEGORY_MAP = {
  HS: { label: 'Humanities & Social Sciences', variant: 'success' },
  BS: { label: 'Basic Sciences', variant: 'info' },
  ES: { label: 'Engineering Sciences', variant: 'neutral' },
  PC: { label: 'Professional Core', variant: 'info' },
  PE: { label: 'Professional Elective', variant: 'warning' },
  MC: { label: 'Mandatory Course', variant: 'danger' }
};

// Faculty mapping for a rich appearance
const FACULTY_MAP = {
  HS23111: 'Dr. Jayasree M',
  MA23114: 'Prof. Kapil Dev',
  PH23132: 'Dr. Ramesh Kumar',
  GE23131: 'Mrs. Madhubala K',
  EE23133: 'Dr. Divya S',
  GE23122: 'Mr. Saravanan P',
  MC23111: 'Mrs. Priya Dharshini',
  MA23214: 'Prof. Kapil Dev',
  GE23217: 'Dr. Selvarani R',
  GE23111: 'Mr. Rajesh K',
  IT23231: 'Mrs. Madhubala K',
  AI23231: 'Dr. Jayasree M',
  CS23231: 'Prof. Kapil Dev',
  HS23221: 'Dr. Ramesh Kumar',
  GE23121: 'Mr. Saravanan P',
  CS23221: 'Mrs. Divya S',
  MA23313: 'Prof. Kapil Dev',
  AI23331: 'Dr. Jayasree M',
  CS23331: 'Mrs. Madhubala K',
  AI23332: 'Dr. Selvarani R',
  CS23332: 'Dr. Divya S',
  AI23311: 'Mr. Rajesh K',
  AI23312: 'Mrs. Priya Dharshini',
  GE23321: 'Mr. Saravanan P',
  MA23415: 'Prof. Kapil Dev',
  AD23401: 'Dr. Jayasree M',
  AI23401: 'Mrs. Madhubala K',
  AI23402: 'Dr. Selvarani R',
  AI23403: 'Dr. Divya S',
  AI23411: 'Mr. Rajesh K',
  AI23412: 'Mrs. Priya Dharshini',
  GE23421: 'Mr. Saravanan P',
  PE23501: 'Dr. Selvarani R',
  PE23502: 'Dr. Divya S',
  AD23531: 'Prof. Kapil Dev',
  AI23531: 'Dr. Jayasree M',
  AI23532: 'Mrs. Madhubala K',
  AI23511: 'Mr. Rajesh K',
  AI23512: 'Mrs. Priya Dharshini',
  PE23601: 'Dr. Selvarani R',
  PE23602: 'Dr. Divya S',
  AD23631: 'Prof. Kapil Dev',
  AD23632: 'Dr. Jayasree M',
  GE23627: 'Mrs. Madhubala K',
  AI23611: 'Mr. Rajesh K',
  AI23612: 'Mrs. Priya Dharshini',
  PE23701: 'Dr. Selvarani R',
  PE23702: 'Dr. Divya S',
  AI23731: 'Prof. Kapil Dev',
  AI23732: 'Dr. Jayasree M',
  AI23733: 'Mrs. Madhubala K',
  AI23711: 'Mr. Rajesh K',
  AI23712: 'Mrs. Priya Dharshini'
};

export default function CoursesList() {
  const { student } = useAuth()
  const navigate = useNavigate()
  const [activeSemester, setActiveSemester] = useState(5)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [courseProgresses, setCourseProgresses] = useState({})

  const currentSemester = student?.current_semester || 5

  // Default to student's current semester on load
  useEffect(() => {
    if (student?.current_semester) {
      setActiveSemester(student.current_semester)
    }
  }, [student])

  // Fetch progresses from localStorage
  const loadProgresses = () => {
    const progresses = {};
    Object.keys(semestersData).forEach(semNum => {
      semestersData[semNum].forEach(course => {
        let totalTopics = 0;
        let completedTopics = 0;
        
        course.units.forEach((unit, uIdx) => {
          if (unit.topics) {
            unit.topics.forEach((topic, tIdx) => {
              totalTopics++;
              const status = localStorage.getItem(`topic_status_${course.course_code}_${uIdx}_${tIdx}`);
              if (status === 'completed') {
                completedTopics++;
              }
            });
          }
        });
        
        progresses[course.course_code] = totalTopics > 0 
          ? Math.round((completedTopics / totalTopics) * 100) 
          : 0;
      });
    });
    setCourseProgresses(progresses);
  };

  useEffect(() => {
    loadProgresses();
    // Listen for progress updates
    window.addEventListener('storage', loadProgresses);
    return () => window.removeEventListener('storage', loadProgresses);
  }, []);

  const coursesInActiveSem = semestersData[activeSemester] || []

  // Filter courses by search query and category
  const filteredCourses = coursesInActiveSem.filter(course => {
    const matchesSearch = course.course_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.course_code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === '' || course.category === categoryFilter;
    return matchesSearch && matchesCategory;
  })

  // Get status metadata of a semester
  const getSemesterStatus = (semNum) => {
    if (semNum < currentSemester) {
      return { label: 'Completed', icon: '✅', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200' };
    } else if (semNum === currentSemester) {
      return { label: 'In Progress', icon: '🔵', color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/20 border-blue-200' };
    } else {
      return { label: 'Locked', icon: '🔒', color: 'text-slate-400 bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60' };
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Curriculum & Syllabus"
        description="Explore the complete B.Tech Artificial Intelligence and Data Science syllabus (R2023) mapped to Semesters 1-7."
      />

      {/* Semester Tab Selector - Desktop (Horizontal) */}
      <div className="hidden md:flex border-b border-slate-200 dark:border-slate-700 space-x-1 overflow-x-auto pb-px">
        {[1, 2, 3, 4, 5, 6, 7].map(semNum => {
          const status = getSemesterStatus(semNum);
          const isActive = activeSemester === semNum;
          return (
            <button
              key={semNum}
              onClick={() => setActiveSemester(semNum)}
              className={`px-5 py-3 text-xs font-semibold rounded-t-xl transition-all flex items-center gap-2 border-t border-x shrink-0 ${
                isActive
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border-slate-200 dark:border-slate-700 border-b-white dark:border-b-slate-800 shadow-[0_-2px_10px_-3px_rgba(0,0,0,0.05)]'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <span>{status.icon}</span>
              <span>Semester {semNum}</span>
              {semNum === currentSemester && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
              )}
            </button>
          )
        })}
      </div>

      {/* Semester Tab Selector - Mobile (Dropdown select) */}
      <div className="block md:hidden">
        <label className="text-xs font-semibold text-slate-500 block mb-1">Select Academic Semester:</label>
        <select
          value={activeSemester}
          onChange={(e) => setActiveSemester(Number(e.target.value))}
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
        >
          {[1, 2, 3, 4, 5, 6, 7].map(semNum => {
            const status = getSemesterStatus(semNum);
            return (
              <option key={semNum} value={semNum}>
                {status.icon} Semester {semNum} ({status.label})
              </option>
            )
          })}
        </select>
      </div>

      {/* Search and Category Filter Row */}
      <Card p="p-4" className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:w-72">
          <Input
            type="text"
            placeholder="🔍 Search course name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-200"
          >
            <option value="">All Categories</option>
            <option value="PC">Professional Core (PC)</option>
            <option value="BS">Basic Sciences (BS)</option>
            <option value="ES">Engineering Sciences (ES)</option>
            <option value="HS">Humanities & Social Sciences (HS)</option>
            <option value="PE">Professional Elective (PE)</option>
            <option value="MC">Mandatory Course (MC)</option>
          </select>
        </div>
      </Card>

      {/* Semester Header Card */}
      <div className="flex items-center justify-between bg-blue-50/50 dark:bg-slate-800/40 p-4 rounded-2xl border border-blue-100/50 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800 w-12 h-12 rounded-xl flex items-center justify-center shadow-sm">
            S{activeSemester}
          </span>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">Semester {activeSemester} Curriculum</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Total of {coursesInActiveSem.length} courses planned for this semester.
            </p>
          </div>
        </div>

        <Badge variant={activeSemester < currentSemester ? 'success' : activeSemester === currentSemester ? 'info' : 'neutral'}>
          {activeSemester < currentSemester ? 'Completed Semester' : activeSemester === currentSemester ? 'In Progress' : 'Locked Semester'}
        </Badge>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12 text-slate-500 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          No courses match your search or filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => {
            const pct = courseProgresses[course.course_code] || 0;
            const categoryMeta = CATEGORY_MAP[course.category] || { label: 'Course', variant: 'neutral' };
            const faculty = FACULTY_MAP[course.course_code] || 'Dept Faculty';

            return (
              <Card
                key={course.course_code}
                p="p-5"
                className="flex flex-col hover:shadow-md transition-shadow relative overflow-hidden group border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                {/* Visual Category Stripe */}
                <div className={`absolute top-0 left-0 w-full h-1.5 ${
                  course.category === 'PC' ? 'bg-blue-600' :
                  course.category === 'BS' ? 'bg-indigo-600' :
                  course.category === 'HS' ? 'bg-emerald-600' :
                  course.category === 'PE' ? 'bg-amber-600' : 'bg-slate-400'
                }`} />

                {/* Code and Category Row */}
                <div className="flex items-center justify-between mb-3 mt-1">
                  <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">
                    {course.course_code}
                  </span>
                  <Badge variant={categoryMeta.variant} className="text-[10px]">
                    {course.category}
                  </Badge>
                </div>

                {/* Title */}
                <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[3rem]">
                  {course.course_name}
                </h4>

                {/* Details */}
                <div className="space-y-2 mb-4 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center justify-between">
                    <span>Credits:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{course.credits} Credits</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Units:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{course.units.length} Units</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Faculty:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{faculty}</span>
                  </div>
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-1 text-slate-500">
                    <span>Syllabus Progress</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* View Details Button */}
                <Button
                  variant="primary"
                  className="w-full justify-center text-xs py-2"
                  onClick={() => navigate(`/courses/${course.course_code}`)}
                >
                  View Details & AI Study Assistant
                </Button>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
