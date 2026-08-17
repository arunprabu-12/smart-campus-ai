/** Spec section 7 — test-taking UI with MCQ options, True/False, ShortAnswer, timer. */
import { useState, useEffect, useRef } from 'react'
import { startTest, submitTest } from '../api/tests'

export default function TestRunner({ test, onComplete }) {
  const [answers, setAnswers] = useState({})
  const [attemptId, setAttemptId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [starting, setStarting] = useState(true)
  const [timeSeconds, setTimeSeconds] = useState(0)
  const timerRef = useRef(null)

  // Start the test on mount
  useEffect(() => {
    if (!test) return
    startTest(test.id)
      .then((r) => {
        setAttemptId(r.data.attempt_id)
        setStarting(false)
        // Start timer
        timerRef.current = setInterval(() => setTimeSeconds((s) => s + 1), 1000)
      })
      .catch(() => setStarting(false))

    return () => clearInterval(timerRef.current)
  }, [test?.id])

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }

  const handleAnswer = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [String(questionId)]: value }))
  }

  const handleSubmit = async () => {
    if (!attemptId) return
    clearInterval(timerRef.current)
    setLoading(true)
    try {
      const res = await submitTest(attemptId, answers, timeSeconds)
      
      // Mock AI Evaluation Notification
      const notifs = JSON.parse(localStorage.getItem('student_notifications') || '[]');
      notifs.unshift({ text: `AI evaluated your test "${test.title}". Your dashboard has been updated!`, date: new Date().toISOString() });
      localStorage.setItem('student_notifications', JSON.stringify(notifs));
      window.dispatchEvent(new Event('new_notification'));

      // Mock Calendar Update
      const evts = JSON.parse(localStorage.getItem('student_events') || '[]');
      evts.push({ date: new Date().toISOString(), title: `Completed & Evaluated: ${test.title}` });
      localStorage.setItem('student_events', JSON.stringify(evts));
      window.dispatchEvent(new Event('new_event'));

      onComplete(res.data, attemptId)  // pass attemptId so parent can open report
    } catch (e) {
      alert('Submission failed: ' + (e.response?.data?.detail || 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  if (!test) return null
  if (starting) return (
    <div className="flex items-center justify-center h-48">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      <span className="ml-3 text-sm text-gray-500">Starting test...</span>
    </div>
  )

  const answeredCount = Object.keys(answers).length
  const totalQ = test.questions?.length || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center justify-between">
        <div>
          <h2 className="font-bold text-lg">{test.title}</h2>
          <p className="text-purple-200 text-sm">{test.test_type} · {totalQ} questions</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-mono font-bold">{formatTime(timeSeconds)}</p>
          <p className="text-xs text-purple-200">{answeredCount}/{totalQ} answered</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all"
          style={{ width: `${totalQ ? (answeredCount / totalQ) * 100 : 0}%` }}
        />
      </div>

      {/* Questions */}
      {test.questions?.map((q, idx) => {
        let options = []
        try { options = JSON.parse(q.options || '[]') } catch {}

        return (
          <div
            key={q.id}
            id={`question-${q.id}`}
            className={`p-5 rounded-xl border ${answers[String(q.id)] ? 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/10' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'}`}
          >
            <p className="font-medium text-gray-900 dark:text-white mb-3 text-sm leading-relaxed">
              <span className="text-blue-600 font-bold mr-2">Q{idx + 1}.</span>
              {q.question_text}
            </p>

            {/* MCQ */}
            {q.question_type === 'MCQ' && options.length > 0 && (
              <div className="space-y-2">
                {options.map((opt, i) => (
                  <label
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-colors ${answers[String(q.id)] === opt ? 'border-blue-500 bg-blue-100 dark:bg-blue-900/30' : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                  >
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      value={opt}
                      checked={answers[String(q.id)] === opt}
                      onChange={() => handleAnswer(q.id, opt)}
                      className="text-blue-600"
                    />
                    <span className="text-sm text-gray-800 dark:text-gray-200">{opt}</span>
                  </label>
                ))}
              </div>
            )}

            {/* True/False */}
            {q.question_type === 'TrueFalse' && (
              <div className="flex gap-3">
                {['True', 'False'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(q.id, opt)}
                    className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${answers[String(q.id)] === opt ? 'border-blue-500 bg-blue-600 text-white' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* ShortAnswer */}
            {q.question_type === 'ShortAnswer' && (
              <textarea
                rows={3}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Write your answer here..."
                value={answers[String(q.id)] || ''}
                onChange={(e) => handleAnswer(q.id, e.target.value)}
              />
            )}
          </div>
        )
      })}

      {/* Submit */}
      <button
        id="submit-test-btn"
        onClick={handleSubmit}
        disabled={loading || answeredCount === 0}
        className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-xl font-medium text-sm transition-colors"
      >
        {loading ? 'Submitting...' : `Submit Test (${answeredCount}/${totalQ} answered)`}
      </button>
    </div>
  )
}
