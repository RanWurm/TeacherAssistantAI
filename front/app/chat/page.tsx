'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageList } from './components/message-list';
import { ChatInput } from './components/chat-input';
import { askAgent } from '../../lib/api/agent';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  sqlQuery?: string;
  resultsCount?: number;
}

export default function ChatScreen() {
  const streamTimerRef = useRef<number | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t, i18n } = useTranslation();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'assistant',
      content: t('chat.initialGreeting'),
      timestamp: Date.now(),
    },
  ]);

  // Update the initial greeting message text when language changes
  useEffect(() => {
    setMessages(prev =>
      prev.map(m =>
        m.id === 'init'
          ? { ...m, content: t('chat.initialGreeting') }
          : m
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userText = input.trim();
    if (!userText || isLoading) return;

    // Clear any old interval (in case)
    if (streamTimerRef.current) {
      window.clearInterval(streamTimerRef.current);
      streamTimerRef.current = null;
    }

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
      // Ask the agent
      const response = await askAgent({ message: userText });

      // Add an empty assistant message for streaming reply
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

      // Simulate streaming word by word
      const parts = response.message.split(/(\s+)/);
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
      }, 20);
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