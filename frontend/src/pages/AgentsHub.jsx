import { useState } from 'react'
import { getPeerMatches, generateQuiz, searchSmart } from '../api/agents'
import Simulator from './Simulator'
import { PageHeader } from '../components/ui/PageHeader'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

export default function AgentsHub() {
  const [activeTab, setActiveTab] = useState('peers') // 'peers', 'quiz', 'search', 'simulator'

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Hub & Simulator"
        description="Interact with intelligent agents for peer matching, practice quiz generation, and semantic search."
      />

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
        {[
          { id: 'peers', label: '👥 Peer-Matching Agent' },
          { id: 'quiz', label: '📝 Dynamic Quiz Agent' },
          { id: 'search', label: '🔍 Smart Search Agent' },
          { id: 'simulator', label: '⚙️ Academic Simulator' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all shrink-0 ${
              activeTab === tab.id
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border-t-2 border-blue-600 dark:border-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {activeTab === 'peers' && <PeerMatchingTab />}
        {activeTab === 'quiz' && <DynamicQuizTab />}
        {activeTab === 'search' && <SmartSearchTab />}
        {activeTab === 'simulator' && <Simulator />}
      </div>
    </div>
  )
}

function PeerMatchingTab() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(false)

  const handleFindPeers = async () => {
    setLoading(true)
    try {
      const res = await getPeerMatches()
      setMatches(res.data.matches || [])
    } catch (e) {
      alert("Failed to find peers.")
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <Card p="p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Find AI-Recommended Study Partners</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Analyzes your learning metrics and pairs you with peers who excel in topics you are trying to master.
        </p>
        <Button
          variant="primary"
          onClick={handleFindPeers}
          disabled={loading}
        >
          {loading ? 'Analyzing Peer Profiles...' : '✨ Find Matching Study Peers'}
        </Button>
      </Card>

      {matches.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.map(m => (
            <Card key={m.id} p="p-5" className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xl shrink-0">
                {m.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-900 dark:text-white text-base">{m.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{m.career_interest || 'Student'}</p>
                <div className="mt-2">
                  <Badge variant="success">{m.match_score} Match: {m.reason}</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function DynamicQuizTab() {
  const [courseId, setCourseId] = useState(5)
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const res = await generateQuiz(courseId)
      setQuiz(res.data)
    } catch (e) {
      alert("Failed to generate quiz.")
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <Card p="p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Autonomous Practice Quiz Generator</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Generates instant multiple-choice practice questions from selected course modules.
        </p>
        <div className="flex items-center gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Course ID:</label>
            <Input
              type="number"
              min="1"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-24"
            />
          </div>
          <div className="mt-5">
            <Button
              variant="primary"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? 'Generating Questions...' : '⚡ Generate Practice Quiz'}
            </Button>
          </div>
        </div>
      </Card>

      {quiz && (
        <Card p="p-6" className="bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <h4 className="font-bold text-xl text-blue-900 dark:text-blue-200 mb-4">{quiz.title}</h4>
          <div className="space-y-4">
            {quiz.questions.map((q, idx) => (
              <Card key={idx} p="p-4">
                <p className="font-semibold text-slate-900 dark:text-white mb-3 text-sm">{idx + 1}. {q.question}</p>
                <div className="space-y-2">
                  {q.options.map((opt, i) => (
                    <label key={i} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer border border-slate-100 dark:border-slate-700/60 transition-colors text-xs text-slate-700 dark:text-slate-300">
                      <input type="radio" name={`q-${idx}`} className="text-blue-600 focus:ring-blue-500" />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-6">
            <Button variant="primary" className="w-full">
              Submit Answers
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}

function SmartSearchTab() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    try {
      const res = await searchSmart(query)
      setResults(res.data.results || [])
    } catch (e) {
      alert("Search failed.")
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <Card p="p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Semantic Curriculum Search</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Searches course materials by contextual meaning using vector embeddings.
        </p>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1">
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search concepts, e.g. neural network activation functions..."
            />
          </div>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Searching...' : '🔍 Search'}
          </Button>
        </form>
      </Card>

      {results.length > 0 && (
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {results.length} Matches Found
          </p>
          {results.map((r, i) => (
            <Card key={i} p="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">{r.title}</span>
                <Badge variant="info">{r.similarity}% Match</Badge>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                "{r.content}"
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
