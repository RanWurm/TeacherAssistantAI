import { Sparkles, Database } from 'lucide-react';
import { Message } from '../data/mock';
import { useTranslation } from 'react-i18next';
import { MessageTime } from './MessageTime';

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();
  const isUser = message.role === 'user';

  const alignClass =
    isUser
      ? dir === 'ltr'
        ? 'ml-auto'
        : 'mr-auto'
      : dir === 'ltr'
        ? 'mr-auto'
        : 'ml-auto';

  const timeAlignClass = dir === 'rtl' ? 'text-left' : 'text-right';

  return (
    <div className="flex">
      <div
        dir={dir}
        className={`max-w-[80%] ${alignClass}`}
        style={
          isUser
            ? {
                background: 'linear-gradient(90deg, var(--primary-600), var(--primary-500))',
                color: 'var(--on-primary)',
                borderRadius:
                  dir === 'rtl'
                    ? '0.375rem 1rem 1rem 1rem'
                    : '1rem 0.375rem 1rem 1rem',
              }
            : {
                background: 'var(--surface)',
                color: 'var(--text-primary)',
                borderRadius:
                  dir === 'rtl'
                    ? '1rem 0.375rem 1rem 1rem'
                    : '0.375rem 1rem 1rem 1rem',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)',
              }
        }
      >
        <div className="px-5 py-4">
          {message.role === 'assistant' && (
            <div
              className="flex items-center gap-2 mb-3 pb-3"
              style={{ borderBottom: '1px solid var(--border-color-light)' }}
            >
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center"
                style={{
                  background:
                    'linear-gradient(135deg, var(--primary-500), var(--primary-400))',
                }}
              >
                <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--on-primary)' }} />
              </div>
              <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                {t('chat.messageItem.aiResponseLabel')}
              </span>
            </div>
          )}

          <p className="text-sm leading-relaxed text-start">
            {message.content}
          </p>

          {message.sqlQuery && (
            <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-color-light)' }}>
              <div className="rounded-lg p-3" style={{ background: 'var(--surface-elevated)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
                  <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                    {t('chat.messageItem.sqlQueryExecutedLabel')}
                  </span>
                </div>
                <code className="text-xs font-mono text-start">
                  {message.sqlQuery}
                </code>
              </div>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div className={`px-5 py-2 text-xs ${timeAlignClass}`}>
          <MessageTime ts={message.timestamp} />
        </div>
      </div>
    </div>
  );
}
