import { Sparkles, Database } from 'lucide-react';
import { Message } from '../data/mock';
import { useTranslation } from 'react-i18next';

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const { t } = useTranslation();

  return (
    <div
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[80%]`}
        style={
          message.role === 'user'
            ? {
                background: "linear-gradient(90deg, var(--primary-600), var(--primary-500))",
                color: "var(--on-primary)",
                borderRadius: "1rem 0.375rem 1rem 1rem",
              }
            : {
                background: "var(--surface)",
                color: "var(--text-primary)",
                borderRadius: "0.375rem 1rem 1rem 1rem",
                border: "1px solid var(--border-color)",
                boxShadow: "var(--shadow-sm)",
              }
        }
      >
        <div className="px-5 py-4">
          {message.role === 'assistant' && (
            <div
              className="flex items-center gap-2 mb-3 pb-3"
              style={{ borderBottom: "1px solid var(--border-color-light)" }}
            >
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, var(--primary-500), var(--primary-400))"
                }}
              >
                <Sparkles className="w-3.5 h-3.5" style={{ color: "var(--on-primary)" }} />
              </div>
              <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                {t('chat.messageItem.aiResponseLabel')}
              </span>
            </div>
          )}
          <p
            className="text-sm leading-relaxed"
            style={{
              color:
                message.role === 'user'
                  ? "var(--on-primary)"
                  : "var(--text-primary)",
            }}
          >
            {message.content}
          </p>
          {message.sqlQuery && (
            <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--border-color-light)" }}>
              <div
                className="rounded-lg p-3"
                style={{
                  background: "var(--surface-elevated)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-3.5 h-3.5" style={{ color: "var(--text-secondary)" }} />
                  <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                    {t('chat.messageItem.sqlQueryExecutedLabel')}
                  </span>
                </div>
                <code className="text-xs font-mono" style={{ color: "var(--text-primary)" }}>
                  {message.sqlQuery}
                </code>
              </div>
              {typeof message.resultsCount === 'number' && (
                <div className="mt-2 flex items-center gap-2 text-xs" style={{ color: "var(--text-subtle)" }}>
                  <span
                    className="inline-flex items-center px-2 py-1 rounded-full font-medium"
                    style={{
                      background: "var(--grow-up-bg)",
                      color: "var(--grow-up)"
                    }}
                  >
                    {t('chat.messageItem.resultsCountLabel', { count: message.resultsCount })}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
        <div
          className="px-5 py-2 text-xs"
          style={
            message.role === 'user'
              ? {
                  color: "var(--primary-100)",
                  borderTop: "1px solid rgba(var(--primary-500-rgb), 0.18)"
                }
              : {
                  color: "var(--text-subtle)",
                  borderTop: "1px solid var(--border-color-light)"
                }
          }
        >
          {message.timestamp.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}
