'use client';

import { useState } from 'react';
import '../../styles/variables.css';
import { MessageList } from './components/message-list';
import { ChatInput } from './components/chat-input';
import { Message, INITIAL_MESSAGES } from './data/mock';

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `מצאתי ${Math.floor(Math.random() * 500 + 100)} מאמרים רלוונטיים בנושא "${input}". על בסיס המטא־דאטה, אני ממליץ לחקור את הקשר בין...`,
        timestamp: new Date(),
        sqlQuery: "SELECT ...",
        resultsCount: Math.floor(Math.random() * 500 + 100),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col min-h-0" style={{ color: "var(--text-primary)" }}>

      {/*Scrollable messages area*/}
      <div className="flex-1 min-h-0">
        <MessageList messages={messages} isLoading={isLoading} />
      </div>

      {/*Input attached to bottom*/}
      <ChatInput
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
