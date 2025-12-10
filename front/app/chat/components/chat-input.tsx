import { useEffect, useRef } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  input: string;
  setInput: (v: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function ChatInput({ input, setInput, isLoading, onSubmit }: ChatInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // כשהטעינה מסתיימת, תחזיר focus
  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  return (
    <div
      className="sticky bottom-0 left-0 right-0 z-20 px-6 py-4"
      style={{
        background: "rgba(var(--color-white-rgb), 0.85)",
        backdropFilter: "blur(8px)",
        borderTop: "1px solid var(--border-color)",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.06)",
      }}
    >
      <div className="max-w-5xl mx-auto">
        <form onSubmit={onSubmit}>
          <div className="relative flex flex-row-reverse items-center">
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute left-3 w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 hover:cursor-pointer"
              style={{
                background: "linear-gradient(135deg, var(--primary-600), var(--primary-500))",
                color: "var(--on-primary)",
              }}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>

            <input
              ref={inputRef}              // ← החלק החשוב
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="תאר את תחום המחקר שלך או שאל שאלה..."
              disabled={isLoading}
              className="w-full px-5 py-4 pl-14 rounded-2xl text-sm shadow-sm outline-none text-right"
              style={{
                border: "2px solid var(--border-color)",
                background: isLoading ? "var(--gray-100)" : "var(--input-bg)",
                color: "var(--text-primary)",
                direction: "rtl",
              }}
            />
          </div>
        </form>

        <p className="text-xs mt-3 text-center" style={{ color: "var(--text-subtle)" }}>
          Research Assistant AI uses OpenAlex dataset metadata to generate research ideas
        </p>
      </div>
    </div>
  );
}
