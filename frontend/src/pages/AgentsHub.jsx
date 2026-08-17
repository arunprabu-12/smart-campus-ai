import { useState } from 'react'
import { getPeerMatches, generateQuiz, searchSmart } from '../api/agents'

export default function AgentsHub() {
  const [activeTab, setActiveTab] = useState('peers') // 'peers', 'quiz', 'search'

  return (
    <div className="flex justify-center w-full">
      <div className="space-y-6 w-full max-w-4xl px-4 md:px-0">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI Agents Hub</h2>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 border-b border-gray-200 dark:border-gray-700">
          {[
            { id: 'peers', label: '👥 Peer-Matching Agent' },
            { id: 'quiz', label: '📝 Dynamic Quiz Agent' },
            { id: 'search', label: '🔍 Smart Search Agent' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="pt-4">
          {activeTab === 'peers' && <PeerMatchingTab />}
          {activeTab === 'quiz' && <DynamicQuizTab />}
          {activeTab === 'search' && <SmartSearchTab />}
        </div>
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
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Find Study Partners</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          This agent analyzes your weak topics and finds classmates who are strong in those areas to form optimal study groups.
        </p>
        <button
          onClick={handleFindPeers}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {loading ? 'Analyzing Database...' : '✨ Autogenerate Peer Matches'}
        </button>
      </div>

      {matches.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.map(m => (
            <div key={m.id} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xl flex-shrink-0">
                {m.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{m.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{m.career_interest || 'Student'}</p>
                <div className="mt-2 text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md inline-block">
                  {m.match_score} Match: {m.reason}
                </div>
              </div>
            </div>
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
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Generate Practice Quiz</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          This agent reads the course material and autonomously writes a multiple-choice quiz tailored to test your understanding.
        </p>
        <div className="flex items-center gap-4">
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Course ID:</label>
            <input type="number" min="1" value={courseId} onChange={(e) => setCourseId(e.target.value)} className="w-20 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm dark:bg-gray-700 dark:text-white" />
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {loading ? 'Generating from HuggingFace...' : '⚡ Generate New Quiz'}
          </button>
        </div>
      </div>

      {quiz && (
        <div className="p-6 rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10">
          <h4 className="font-bold text-xl text-blue-900 dark:text-blue-100 mb-4">{quiz.title}</h4>
          <div className="space-y-6">
            {quiz.questions.map((q, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                <p className="font-medium text-gray-900 dark:text-white mb-3">{idx + 1}. {q.question}</p>
                <div className="space-y-2">
                  {q.options.map((opt, i) => (
                    <label key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-colors">
                      <input type="radio" name={`q-${idx}`} className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button className="mt-6 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold transition-colors w-full">
            Submit Answers
          </button>
        </div>
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
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Semantic Document Search</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Type a concept or question. The agent uses Sentence-Transformers to find paragraphs with matching meaning, not just exact keywords.
        </p>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. how does gravity work..."
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {loading ? 'Searching Vectors...' : '🔍 Search'}
          </button>
        </form>
      </div>

      {results.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Found {results.length} relevant matches:</p>
          {results.map((r, i) => (
            <div key={i} className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">{r.title}</span>
                <span className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 px-2 py-0.5 rounded-full font-medium">
                  {r.similarity}% Match
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                "{r.content}"
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
