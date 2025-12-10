import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ error = false, className = '', ...props }: InputProps) {
  return (
    <input
      className={`w-full px-4 py-2 rounded-lg border text-sm outline-none transition-all bg-[color:var(--input-bg)] text-[color:var(--text-primary)] focus:ring-2 focus:ring-[color:var(--primary-500)]/20 ${className}`}
      style={{
        border: `2px solid ${error ? 'var(--error-500)' : 'var(--border-color)'}`,
        ...(props.disabled ? {
          background: "var(--gray-100)",
          color: "var(--gray-400)"
        } : {}),
      }}
      {...props}
    />
  );
}

