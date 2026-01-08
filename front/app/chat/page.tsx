'use client';

import { useState,useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageList } from './components/message-list';
import { ChatInput } from './components/chat-input';
import { Message, INITIAL_MESSAGES } from './data/mock';
import { askAgent } from '../../lib/api/agent';


export default function ChatScreen() {
  const streamTimerRef = useRef<number | null>(null);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

 const handleSubmit = async (e: React.FormEvent) => {
  if (streamTimerRef.current) {
    window.clearInterval(streamTimerRef.current);
    streamTimerRef.current = null;
  }
  e.preventDefault();
  const userText = input.trim();
  if (!userText || isLoading) return;

  const now = Date.now();

  setMessages(prev => [
    ...prev,
    {
      id: now.toString(),
      role: 'user',
      content: userText,
      timestamp: now,
    },
  ]);

  setInput('');
  setIsLoading(true);

  try {
    const assistantId = (Date.now() + 1).toString();
    setMessages(prev => [
      ...prev,
      {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      },
    ]);

    // 2) קבל תשובה מלאה מהשרת
    const { answer } = await askAgent({ message: userText });
    setIsLoading(false);


    // 3) Fake streaming: מילה/רווח בקצב קבוע
    const parts = answer.split(/(\s+)/); // שומר רווחים כדי שלא "יידבק"
    let i = 0;

    streamTimerRef.current = window.setInterval(() => {
      const next = parts[i] ?? "";

      setMessages(prev =>
        prev.map(m =>
          m.id === assistantId
            ? { ...m, content: m.content + next }
            : m
        )
      );

      i++;
      if (i >= parts.length) {
        if (streamTimerRef.current) {
          window.clearInterval(streamTimerRef.current);
          streamTimerRef.current = null;
        }
        setIsLoading(false);
      }
    }, 20); // 15–35ms בדרך כלל נראה טוב
  } catch (err: any) {
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: err?.message || 'Server error',
        timestamp: Date.now(),
      },
    ]);
    setIsLoading(false);
  }
};

  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="flex-1 min-h-0">
        <MessageList messages={messages} isLoading={isLoading} />
      </div>
      <ChatInput
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        onSubmit={handleSubmit}
      />
    </div>
  );
}