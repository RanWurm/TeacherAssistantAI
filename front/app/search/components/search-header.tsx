'use client';

import { useTranslation } from 'react-i18next';

export function SearchHeader() {
  const { t, i18n } = useTranslation();

  return (
    <header className="border-b border-(--border-color) bg-linear-to-b from-(--surface) to-transparent shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-5">
        {/* Title and subtitle */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-(--primary-700) to-(--primary-400) flex items-center justify-center shadow-xl border-2 border-(--primary-200) animate-pulse-slow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6"
                style={{ color: 'var(--on-primary)' }}
              >
                <path d="m21 21-4.34-4.34" />
                <circle cx="11" cy="11" r="8" />
              </svg>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-linear-to-r from-(--primary-600) to-(--primary-400) bg-clip-text text-transparent">
                {t('search.searchHeader.title')}
              </h1>
              <p className="text-xs sm:text-sm text-(--text-secondary) text-center mt-0.5">
                {t(
                  'search.searchHeader.subtitle',
                  'Start typing to add filters by subject, author or keyword'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
