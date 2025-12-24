'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageList } from './components/message-list';
import { ChatInput } from './components/chat-input';
import { Message, INITIAL_MESSAGES } from './data/mock';
import { askAgent } from '../../lib/api/agent';



export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

 const handleSubmit = async (e: React.FormEvent) => {
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
    const { answer } = await askAgent({ message: userText });

    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: answer,
        timestamp: Date.now(),
      },
    ]);
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
  } finally {
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
