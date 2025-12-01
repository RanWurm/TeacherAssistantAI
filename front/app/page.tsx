'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Brain, Database, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sqlQuery?: string;
  resultsCount?: number;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'שלום! אני עוזר המחקר שלך. תאר לי את תחום העניין שלך ואני אעזור לך למצוא רעיונות מחקר חדשניים על בסיס מאגר CORE.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `מצאתי ${Math.floor(Math.random() * 500 + 100)} מאמרים רלוונטיים בנושא "${input}". על בסיס המטא-דאטה, אני ממליץ לחקור את הקשר בין...`,
        timestamp: new Date(),
        sqlQuery: 'SELECT * FROM papers WHERE topics LIKE ...',
        resultsCount: Math.floor(Math.random() * 500 + 100),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-lg bg-white/70 border-b border-slate-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Research Assistant</h1>
              <p className="text-xs text-slate-500">AI-Powered Research Ideas</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Database className="w-4 h-4" />
            <span>CORE Dataset</span>
          </div>
        </div>
      </header>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl rounded-tr-sm'
                    : 'bg-white rounded-2xl rounded-tl-sm border border-slate-200 shadow-sm'
                }`}
              >
                <div className="px-5 py-4">
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <span className="text-xs font-medium text-slate-600">AI Response</span>
                    </div>
                  )}
                  <p className={`text-sm leading-relaxed ${message.role === 'user' ? 'text-white' : 'text-slate-700'}`}>
                    {message.content}
                  </p>
                  {message.sqlQuery && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <div className="bg-slate-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Database className="w-3.5 h-3.5 text-slate-500" />
                          <span className="text-xs font-medium text-slate-600">SQL Query Executed</span>
                        </div>
                        <code className="text-xs text-slate-700 font-mono">{message.sqlQuery}</code>
                      </div>
                      {message.resultsCount && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                          <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-50 text-green-700 font-medium">
                            {message.resultsCount.toLocaleString()} results
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div
                  className={`px-5 py-2 text-xs ${
                    message.role === 'user'
                      ? 'text-blue-100 border-t border-blue-500/20'
                      : 'text-slate-400 border-t border-slate-100'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl rounded-tl-sm border border-slate-200 shadow-sm px-5 py-4">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  <span className="text-sm text-slate-600">מחפש מאמרים ומייצר רעיון מחקר...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 backdrop-blur-lg bg-white/70 border-t border-slate-200 px-6 py-4">
        <div className="max-w-5xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="תאר את תחום המחקר שלך או שאל שאלה..."
                className="w-full px-5 py-4 pr-14 rounded-2xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm bg-white shadow-sm"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute left-3 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </form>
          <p className="text-xs text-slate-500 mt-3 text-center">
            Research Assistant AI uses CORE dataset metadata to generate research ideas
          </p>
        </div>
      </div>
    </div>
  );
}