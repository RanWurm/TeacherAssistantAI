import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: ReactNode;
}

export function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const baseStyles = "px-4 py-2 rounded-lg font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantStyles = {
    primary: "bg-gradient-to-r from-[var(--primary-600)] to-[var(--primary-500)] text-[color:var(--on-primary)] hover:shadow-lg",
    secondary: "bg-[color:var(--surface)] border border-[color:var(--border-color)] text-[color:var(--text-primary)] hover:bg-[color:var(--surface-hover)]",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={variant === 'primary' ? { color: "var(--on-primary)" } : {}}
      {...props}
    >
      {children}
    </button>
  );
}

