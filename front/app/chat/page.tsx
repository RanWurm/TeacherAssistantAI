'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageList } from './components/message-list';
import { ChatInput } from './components/chat-input';
import { Message, INITIAL_MESSAGES } from './data/mock';

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const now = Date.now();

    setMessages(prev => [
      ...prev,
      {
        id: now.toString(),
        role: 'user',
        content: input,
        timestamp: now,
      },
    ]);

    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now()).toString(),
          role: 'assistant',
          content: `${t('chat.messageItem.aiResponseLabel')}: "${input}"`,
          timestamp: Date.now(),
          sqlQuery: 'SELECT ...',
          resultsCount: 123,
        },
      ]);
      setIsLoading(false);
    }, 2000);
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
