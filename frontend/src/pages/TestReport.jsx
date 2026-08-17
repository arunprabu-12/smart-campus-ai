/**
 * TestReport page — detailed per-question test breakdown.
 * Data is persisted in DB via TestAnswerLog model.
 * Accessible from /tests/report/:attemptId
 */
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/client'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'

// ScoreRing replaced with Recharts below
function QuestionCard({ q, index }) {
  const [expanded, setExpanded] = useState(false)
  const correct = q.is_correct
  const unanswered = !q.student_answer

  return (
    <div style={{
      background: correct ? 'rgba(34,197,94,0.08)' : unanswered ? 'rgba(100,116,139,0.1)' : 'rgba(239,68,68,0.08)',
      border: `1.5px solid ${correct ? '#22c55e44' : unanswered ? '#1e293b' : '#ef444444'}`,
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    }} onClick={() => setExpanded(!expanded)}>
      {/* Question header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        {/* Number badge */}
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          background: correct ? '#22c55e22' : unanswered ? '#1e293b' : '#ef444422',
          border: `2px solid ${correct ? '#22c55e' : unanswered ? '#475569' : '#ef4444'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '13px', fontWeight: 700,
          color: correct ? '#22c55e' : unanswered ? '#64748b' : '#ef4444',
          flexShrink: 0,
        }}>
          {index + 1}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '14px', color: '#e2e8f0', fontWeight: 500, lineHeight: 1.5 }}>
            {q.question_text}
          </div>
          <div style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: 600,
              background: correct ? '#22c55e22' : unanswered ? '#1e293b' : '#ef444422',
              color: correct ? '#22c55e' : unanswered ? '#64748b' : '#ef4444',
            }}>
              {unanswered ? '⚪ Not Answered' : correct ? '✅ Correct' : '❌ Wrong'}
            </span>
            <span style={{
              fontSize: '11px', padding: '3px 10px', borderRadius: '20px',
              background: '#1e293b', color: '#64748b',
            }}>
              {q.question_type}
            </span>
          </div>
        </div>

        <div style={{ fontSize: '18px', color: '#475569' }}>{expanded ? '▲' : '▼'}</div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{
          marginTop: '16px', paddingTop: '16px',
          borderTop: '1px solid #1e293b',
        }}>
          {/* Options */}
          {q.options && q.options.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px', fontWeight: 600 }}>
                OPTIONS
              </div>
              {q.options.map((opt, i) => {
                const isCorrectOpt = opt === q.correct_answer || opt.includes(q.correct_answer)
                const isStudentOpt = opt === q.student_answer || opt.includes(q.student_answer || '')
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '8px 12px', borderRadius: '10px', marginBottom: '6px',
                    background: isCorrectOpt ? '#22c55e15' : isStudentOpt ? '#ef444415' : '#0f172a',
                    border: `1px solid ${isCorrectOpt ? '#22c55e44' : isStudentOpt ? '#ef444444' : '#1e293b'}`,
                  }}>
                    <span style={{
                      fontSize: '12px',
                      color: isCorrectOpt ? '#22c55e' : isStudentOpt ? '#ef4444' : '#64748b',
                    }}>
                      {isCorrectOpt ? '✅' : isStudentOpt ? '❌' : '⚪'}
                    </span>
                    <span style={{ fontSize: '13px', color: '#e2e8f0' }}>{opt}</span>
                    {isCorrectOpt && (
                      <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#22c55e' }}>Correct Answer</span>
                    )}
                    {isStudentOpt && !isCorrectOpt && (
                      <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#ef4444' }}>Your Answer</span>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Short answer */}
          {q.question_type === 'ShortAnswer' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: '#22c55e15', borderRadius: '10px', padding: '12px' }}>
                <div style={{ fontSize: '11px', color: '#22c55e', marginBottom: '4px', fontWeight: 600 }}>CORRECT ANSWER</div>
                <div style={{ fontSize: '13px', color: '#e2e8f0' }}>{q.correct_answer}</div>
              </div>
              <div style={{ background: unanswered ? '#1e293b' : '#ef444415', borderRadius: '10px', padding: '12px' }}>
                <div style={{ fontSize: '11px', color: unanswered ? '#64748b' : '#ef4444', marginBottom: '4px', fontWeight: 600 }}>YOUR ANSWER</div>
                <div style={{ fontSize: '13px', color: '#e2e8f0' }}>{q.student_answer || '(not answered)'}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function TestReport() {
  const { attemptId } = useParams()
  const navigate = useNavigate()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchReport()
  }, [attemptId])

  async function fetchReport() {
    try {
      setLoading(true)
      const res = await api.get(`/tests/report/${attemptId}`)
      setReport(res.data)
    } catch (e) {
      setError('Could not load test report. Please check if the attempt exists.')
    } finally {
      setLoading(false)
    }
  }

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    padding: '32px',
    fontFamily: "'Inter', sans-serif",
    color: '#f1f5f9',
  }

  if (loading) {
    return (
      <div style={{ ...containerStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px', height: '50px', borderRadius: '50%',
            border: '3px solid #818cf8', borderTopColor: 'transparent',
            animation: 'spin 1s linear infinite', margin: '0 auto 16px',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: '#94a3b8' }}>Loading test report...</p>
        </div>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div style={containerStyle}>
        <div style={{
          background: '#ef44441a', border: '1px solid #ef4444',
          borderRadius: '16px', padding: '32px', textAlign: 'center',
        }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>❌</div>
          <p style={{ color: '#fca5a5' }}>{error || 'Report not found'}</p>
          <button
            onClick={() => navigate('/tests')}
            style={{
              marginTop: '16px', padding: '10px 24px', borderRadius: '10px',
              background: '#818cf8', color: '#fff', border: 'none', cursor: 'pointer',
            }}
          >
            Back to Tests
          </button>
        </div>
      </div>
    )
  }

  const result = report.result || {}
  const percentage = result.percentage || 0
  const correct = result.correct_answers || result.score || 0
  const total = result.total_questions || report.questions.length
  const wrong = result.wrong_answers || (total - correct)

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', animation: 'fadeIn 0.5s ease' }}>
        <button
          onClick={() => navigate('/tests')}
          style={{
            background: 'rgba(15,23,42,0.6)', border: '1px solid #1e293b',
            borderRadius: '10px', padding: '8px 16px', color: '#94a3b8',
            cursor: 'pointer', fontSize: '13px',
          }}
        >
          ← Back
        </button>
        <div>
          <h1 style={{
            fontSize: '24px', fontWeight: 800,
            background: 'linear-gradient(135deg, #818cf8, #a78bfa)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: '4px',
          }}>
            📊 Test Report
          </h1>
          <p style={{ color: '#64748b', fontSize: '13px' }}>
            {report.test_title} · {report.test_type}
          </p>
        </div>
      </div>

      {/* Score summary card using Recharts */}
      <div style={{
        background: 'rgba(15,23,42,0.8)',
        border: '1px solid #1e293b',
        borderRadius: '20px',
        padding: '32px',
        marginBottom: '32px',
        backdropFilter: 'blur(12px)',
        animation: 'fadeIn 0.5s ease',
      }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
          
          {/* Pie Chart */}
          <div style={{ background: '#0f172a', padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#e2e8f0', marginBottom: '16px' }}>Accuracy Breakdown</h3>
            <div style={{ width: '100%', height: 220 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Correct', value: correct },
                      { name: 'Wrong', value: wrong },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="#22c55e" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }} 
                    itemStyle={{ color: '#f1f5f9' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', color: '#cbd5e1' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: percentage >= 50 ? '#22c55e' : '#ef4444' }}>
              {percentage.toFixed(0)}%
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Overall Score</div>
          </div>

          {/* Bar Chart */}
          <div style={{ background: '#0f172a', padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#e2e8f0', marginBottom: '16px' }}>Performance Metrics</h3>
            <div style={{ width: '100%', height: 220 }}>
              <ResponsiveContainer>
                <BarChart data={[
                  { name: 'Metrics', Correct: correct, Wrong: wrong, Total: total }
                ]}>
                  <XAxis dataKey="name" tick={{fill: '#94a3b8', fontSize: 12}} axisLine={{stroke: '#334155'}} tickLine={false} />
                  <YAxis tick={{fill: '#94a3b8', fontSize: 12}} axisLine={{stroke: '#334155'}} tickLine={false} />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }} 
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="Correct" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={40} />
                  <Bar dataKey="Wrong" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={40} />
                  <Bar dataKey="Total" fill="#818cf8" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Strong/Weak topics */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {result.strong_topics?.length > 0 && (
            <div style={{ background: '#22c55e15', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '13px', color: '#22c55e', fontWeight: 700, marginBottom: '8px' }}>
                💪 STRONG TOPICS
              </div>
              {result.strong_topics.map(t => (
                <span key={t} style={{
                  display: 'inline-block', fontSize: '12px', background: '#22c55e22',
                  color: '#86efac', padding: '4px 12px', borderRadius: '20px',
                  margin: '4px', border: '1px solid #22c55e44'
                }}>{t}</span>
              ))}
            </div>
          )}
          {result.weak_topics?.length > 0 && (
            <div style={{ background: '#ef444415', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '13px', color: '#ef4444', fontWeight: 700, marginBottom: '8px' }}>
                📚 NEEDS REVISION
              </div>
              {result.weak_topics.map(t => (
                <span key={t} style={{
                  display: 'inline-block', fontSize: '12px', background: '#ef444422',
                  color: '#fca5a5', padding: '4px 12px', borderRadius: '20px',
                  margin: '4px', border: '1px solid #ef444444'
                }}>{t}</span>
              ))}
            </div>
          )}
        </div>

        <div style={{ fontSize: '12px', color: '#475569', textAlign: 'right', marginTop: '16px' }}>
          <div>Started: {report.started_at ? new Date(report.started_at).toLocaleString() : '—'}</div>
          <div>Submitted: {report.submitted_at ? new Date(report.submitted_at).toLocaleString() : '—'}</div>
        </div>
      </div>

      {/* Per-question breakdown */}
      <div style={{ animation: 'fadeIn 0.7s ease' }}>
        <h2 style={{
          fontSize: '18px', fontWeight: 700, color: '#e2e8f0',
          marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          📝 Question Breakdown
          <span style={{
            fontSize: '12px', color: '#64748b', fontWeight: 400,
            background: '#1e293b', padding: '3px 10px', borderRadius: '20px',
          }}>
            {report.questions.length} questions — click to expand
          </span>
        </h2>

        {report.questions.length === 0 ? (
          <div style={{
            background: 'rgba(15,23,42,0.6)', border: '1px solid #1e293b',
            borderRadius: '16px', padding: '40px', textAlign: 'center', color: '#64748b',
          }}>
            No answer logs found. Submit a test to see the detailed report.
          </div>
        ) : (
          report.questions.map((q, i) => (
            <QuestionCard key={q.question_id} q={q} index={i} />
          ))
        )}
      </div>
    </div>
  )
}
