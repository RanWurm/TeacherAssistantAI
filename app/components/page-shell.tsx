// components/page-shell.tsx
import React from "react";

export function PageShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-50">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}
