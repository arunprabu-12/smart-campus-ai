import React, { useState, useEffect, useRef } from 'react'
import { getDashboard } from '../api/students'
import { getCoursesForSemester } from '../api/courses'
import { Send, Loader2, Bot, User, PlayCircle, X } from 'lucide-react'

// Uses Anthropic Claude API (similar to StudentChatbot) for the Mock Interview
async function callClaude(messages, courseName) {
  // Claude expects strict alternating user/assistant messages.
  const formattedMessages = [
    { role: "user", content: `You are an AI Examiner conducting a mock technical interview for a university student on the subject: ${courseName}. Ask one question at a time. Wait for the student's response. Evaluate their answer briefly, then ask the next question. Start by asking the first question now.` },
    { role: "assistant", content: `Hello! I am your AI Examiner. We will now begin your mock interview for ${courseName}. Are you ready for your first question?` },
    ...messages.slice(1) // skip the initial local assistant message to match the flow
  ];

  const payload = {
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 1024,
    temperature: 0.7,
    messages: formattedMessages,
  };

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY || "", 
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`Claude API error ${res.status}`);
  const data = await res.json();
  return data.content?.[0]?.text?.trim() ?? "Error generating response.";
}

export default function Simulator() {
  const [courses, setCourses] = useState([])
  const [activeSim, setActiveSim] = useState(null)
  const [loading, setLoading] = useState(true)

  // Interview States
  const [interviewStarted, setInterviewStarted] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [chatLoading, setChatLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getDashboard()
        const semesterStatus = res.data.semester_statuses?.find(s => s.status === 'in_progress')
        if (semesterStatus?.semester_id) {
          const courseRes = await getCoursesForSemester(semesterStatus.semester_id)
          setCourses(courseRes.data || [])
        }
      } catch (err) {
        console.error('Failed to load courses', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (interviewStarted) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, interviewStarted])

  const startInterview = () => {
    setInterviewStarted(true)
    setMessages([
      { role: "assistant", content: `Hello! I am your AI Examiner. We will now begin your mock interview for ${activeSim.name}. Are you ready for your first question?` }
    ])
  }

  const exitSimulator = () => {
    setActiveSim(null)
    setInterviewStarted(false)
    setMessages([])
    setInput("")
  }

  const handleSend = async () => {
    if (!input.trim() || chatLoading) return;
    const userMsg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    
    setMessages(newMessages);
    setInput("");
    setChatLoading(true);
    
    try {
      const reply = await callClaude(newMessages, activeSim.name);
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (e) {
      // Fallback if API key is missing or invalid
      console.warn("API Error, falling back to mock response.");
      setTimeout(() => {
        setMessages([...newMessages, { role: "assistant", content: "That's an interesting answer! To dive deeper, how does this concept apply in a real-world industrial scenario?" }]);
        setChatLoading(false);
      }, 1500);
      return;
    }
    setChatLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
      </div>
    )
  }

  return (
    <div className="p-6 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <span>⚙️</span> Interactive Simulator & Mock Interviews
      </h2>
      
      {!activeSim ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.length > 0 ? courses.map(course => (
            <div key={course.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-blue-500 transition-colors shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{course.name}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Code: {course.code || 'N/A'}</p>
              <button 
                onClick={() => setActiveSim(course)}
                className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all flex justify-center items-center gap-2 hover:scale-[1.02] shadow-md hover:shadow-lg"
              >
                <PlayCircle className="w-5 h-5" /> Launch Mock Interview
              </button>
            </div>
          )) : (
            <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-10 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              No courses available to practice right now.
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl flex flex-col flex-1 min-h-[600px] shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-gray-900 dark:text-white font-bold flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              AI Mock Interview: {activeSim.name}
            </h3>
            <button 
              onClick={exitSimulator}
              className="text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1 text-sm font-medium"
            >
              <X className="w-4 h-4" /> End Session
            </button>
          </div>
          
          {/* Interview Area */}
          {!interviewStarted ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
                <Bot className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Ready to test your knowledge?</h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
                You are about to start a mock interview for <strong>{activeSim.name}</strong>. An AI agent will ask you questions and evaluate your answers in real-time.
              </p>
              <button
                onClick={startInterview}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Start Interview Now
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                    <div className="flex items-end gap-2 max-w-[80%]">
                      {msg.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mb-1">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                      )}
                      
                      <div className={`p-4 rounded-2xl ${
                        msg.role === 'assistant' 
                          ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-bl-none shadow-sm' 
                          : 'bg-blue-600 text-white rounded-br-none shadow-md'
                      }`}>
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      </div>

                      {msg.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 mb-1">
                          <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-end gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mb-1">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-2xl rounded-bl-none shadow-sm flex gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 max-w-4xl mx-auto">
                  <textarea
                    rows={1}
                    className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden"
                    placeholder="Type your answer here..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={chatLoading}
                  />
                  <button
                    onClick={handleSend}
                    disabled={chatLoading || !input.trim()}
                    className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
