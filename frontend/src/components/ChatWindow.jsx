/** Spec section 10 — AI Advisor chat UI with enter-key send, auto-scroll, source citations. */
import { useState, useRef, useEffect } from 'react'
import { askAdvisor } from '../api/advisor'

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello! I\'m your AI Academic Advisor. Ask me anything about your syllabus, regulations, exams, attendance, or study planning! 🎓',
      sources: [],
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg = { role: 'user', text: input }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await askAdvisor(input)
      setMessages((m) => [
        ...m,
        { role: 'assistant', text: res.data.answer, sources: res.data.sources || [] },
      ])
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: 'assistant', text: '⚠ Sorry, I could not reach the advisor service. Please try again.', sources: [] },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const QUICK = [
    'What is my current semester syllabus?',
    'How many credits do I need to complete?',
    'What are the attendance requirements?',
    'How do I improve my weak topics?',
  ]

  return (
    <div className="flex flex-col h-[75vh] rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center gap-3">
        <span className="text-2xl">🤖</span>
        <div>
          <p className="font-semibold text-sm">AI Academic Advisor</p>
          <p className="text-blue-200 text-xs">Powered by Gemini + RAG</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
            <div className={`max-w-[85%] ${m.role === 'user' ? 'order-2' : 'order-1'}`}>
              {m.role === 'assistant' && (
                <div className="text-xs text-gray-400 dark:text-gray-500 mb-1 ml-1">AI Advisor</div>
              )}
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-sm'
                }`}
              >
                {m.text}
              </div>
              {m.sources && m.sources.length > 0 && (
                <div className="mt-1.5 ml-1">
                  <p className="text-xs text-gray-400 dark:text-gray-500">Sources:</p>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {[...new Set(m.sources)].filter(Boolean).map((src, si) => (
                      <span
                        key={si}
                        className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full"
                      >
                        📄 {src.split('/').pop() || src}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {QUICK.map((q, i) => (
            <button
              key={i}
              onClick={() => { setInput(q); }}
              className="text-xs px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex gap-2">
        <textarea
          id="advisor-input"
          rows={1}
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about syllabus, regulations, exams, attendance... (Enter to send)"
        />
        <button
          id="advisor-send"
          onClick={send}
          disabled={loading || !input.trim()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-xl text-sm font-medium transition-colors flex-shrink-0"
        >
          Send
        </button>
      </div>
    </div>
  )
}
