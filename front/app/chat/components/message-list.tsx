import { useRef, useEffect, useState } from 'react';
import { MessageItem } from './message-item';
import { Message } from '../data/mock';
import { Loader } from '../../../components/ui/Loader';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const { t, i18n } = useTranslation();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showScrollDown, setShowScrollDown] = useState(false);

  // Scroll to bottom on new message or language direction change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, i18n.language]);

  // Detect if user scrolled up & show down arrow
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Allow 32px margin from the bottom to ignore tiny differences
      const isAtBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight < 32;
      setShowScrollDown(!isAtBottom);
    };

    container.addEventListener('scroll', handleScroll);

    // Initial check in case list is very short
    handleScroll();

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [messages]);

  // Handler for clicking the down arrow
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const dir = i18n.dir();
  // Align the scroll down button based on direction
  const scrollButtonClass =  "fixed z-40 right-1/2 transform translate-x-1/2 bottom-1/6 bg-white/90 border border-gray-200 shadow-lg rounded-full p-2 transition-opacity hover:bg-gray-50";
  
  return (
    <div
      ref={messagesContainerRef}
      className="h-full flex-1 overflow-y-auto px-6 py-8 min-h-0 relative"
      dir={dir}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div
              className="rounded-2xl rounded-tl-sm px-5 py-4"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border-color)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div className="flex items-center gap-3">
                <Loader size="md" />
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  {t('chat.messageList.loadingMessage')}
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {showScrollDown && (
        <button
          aria-label={t('chat.messageList.scrollToBottomLabel')}
          onClick={scrollToBottom}
          className={scrollButtonClass}
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}
        >
          <ChevronDown className="w-6 h-6 text-gray-600" />
        </button>
      )}
    </div>
  );
}
