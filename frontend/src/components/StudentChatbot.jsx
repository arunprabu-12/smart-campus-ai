import React, { useState, useRef } from "react";
import { Send, Loader2, X } from "lucide-react";

/**
 * StudentChatbot - simple chat interface for students.
 * Uses Anthropic Claude API (callClaude) to get responses.
 */

 async function callClaude(messages) {
   const payload = {
     model: "claude-3-5-sonnet-20240620",
     max_tokens: 1024,
     temperature: 0.7,
     messages,
   };
   const res = await fetch("https://api.anthropic.com/v1/messages", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
       "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY || "", // Use environment variable
       "anthropic-version": "2023-06-01",
     },
     body: JSON.stringify(payload),
   });
   if (!res.ok) throw new Error(`Claude API error ${res.status}`);
   const data = await res.json();
   return data.content?.[0]?.text?.trim() ?? "";
 }

export default function StudentChatbot() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your study assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const reply = await callClaude([...messages, userMsg]);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again later." },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full max-w-xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "assistant" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`p-3 rounded-lg max-w-xs ${msg.role === "assistant" ? "bg-gray-100 text-gray-900" : "bg-blue-600 text-white"}`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t p-3 flex items-center space-x-2">
        <textarea
          ref={inputRef}
          rows={1}
          className="flex-1 border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ask your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Send />}
        </button>
        <button
          onClick={() => {
            setMessages([]);
            setInput("");
          }}
          className="p-2 text-gray-500 hover:text-gray-700"
        >
          <X />
        </button>
      </div>
    </div>
  );
}
