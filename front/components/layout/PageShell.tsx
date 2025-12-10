import React from "react";
import '../../styles/variables.css';

interface PageShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

/**
 * Uses CSS variables from variables.css
 * for colors and spacing rather than Tailwind color utilities.
 */
export function PageShell({ title, subtitle, children }: PageShellProps) {
  return (
    <div
      className="mx-auto max-w-6xl px-4 py-8 space-y-6"
      style={{
        color: "var(--text-primary)",
      }}
    >
      <div className="space-y-2">
        <h1
          className="text-2xl sm:text-3xl font-semibold"
          style={{
            color: "var(--text-primary)",
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="text-sm sm:text-base max-w-2xl"
            style={{
              color: "var(--text-secondary)",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

