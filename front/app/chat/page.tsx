'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/variables.css';
import { MessageList } from './components/message-list';
import { ChatInput } from './components/chat-input';
import { Message, INITIAL_MESSAGES } from './data/mock';

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

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
      const resultsCount = Math.floor(Math.random() * 500 + 100);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        // Use the proper i18n key from en.json for an AI response dummy, using provided keys ("chat.messageItem.aiResponseLabel" or similar)
        // We'll use a template to show a result count, topic, and a static response for illustration
        content: `${t('chat.messageItem.aiResponseLabel')}: "${input}"\n${t('chat.messageItem.resultsCountLabel', { count: resultsCount })}`,
        timestamp: new Date(),
        sqlQuery: 'SELECT ...',
        resultsCount: resultsCount,
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
