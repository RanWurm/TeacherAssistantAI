import { useEffect, useRef } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ChatInputProps {
  input: string;
  setInput: (v: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function ChatInput({ input, setInput, isLoading, onSubmit }: ChatInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { t, i18n } = useTranslation();

  // When loading finishes, return focus to input
  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  // Direction for input/layout depends on language (he/en)
  let dir: "rtl" | "ltr" = "ltr";
  if (i18n.language === "he") {
    dir = "rtl";
  } else if (i18n.language === "en") {
    dir = "ltr";
  }

  return (
    <div
      className="sticky bottom-0 left-0 right-0 z-20 px-6 py-4"
      style={{
        background: "rgba(var(--color-white-rgb), 0.85)",
        backdropFilter: "blur(8px)",
        borderTop: "1px solid var(--border-color)",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.06)",
      }}
      dir={dir}
    >
      <div className="max-w-5xl mx-auto">
        <form onSubmit={onSubmit}>
          <div className={`relative flex ${dir === "rtl" ? "flex-row-reverse" : "flex-row"} items-center`}>
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`absolute ${dir === "rtl" ? "left-3" : "right-3"} w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 hover:cursor-pointer`}
              style={{
                background: "linear-gradient(135deg, var(--primary-600), var(--primary-500))",
                color: "var(--on-primary)",
              }}
              aria-label={
                isLoading
                  ? t('chat.input.loadingLabel')
                  : t('chat.input.submitButtonLabel')
              }
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>

            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('chat.input.placeholder')}
              disabled={isLoading}
              className={`w-full px-5 py-4 pl-14 rounded-2xl text-sm shadow-sm outline-none ${dir === "rtl" ? "text-right" : "text-left"}`}
              style={{
                border: "2px solid var(--border-color)",
                background: isLoading ? "var(--gray-100)" : "var(--input-bg)",
                color: "var(--text-primary)",
                direction: dir,
              }}
              dir={dir}
            />
          </div>
        </form>

        <p className="text-xs mt-3 text-center" style={{ color: "var(--text-subtle)" }}>
          {t('chat.input.footer')}
        </p>
      </div>
    </div>
  );
}
