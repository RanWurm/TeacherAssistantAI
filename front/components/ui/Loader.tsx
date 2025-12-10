import { Loader2 } from 'lucide-react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Loader({ size = 'md', className = '' }: LoaderProps) {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <Loader2
      className={`${sizeStyles[size]} animate-spin ${className}`}
      style={{ color: "var(--primary-600)" }}
    />
  );
}

