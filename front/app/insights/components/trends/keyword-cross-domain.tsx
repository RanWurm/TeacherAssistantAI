import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Network } from 'lucide-react';
import { MOCK_KEYWORD_CROSS_DOMAIN } from '../../data/mock';
import type { TimeRange } from '../../types/insights.types';

interface KeywordCrossDomainProps {
  timeRange: TimeRange;
}

// Clamp a string if it's too long, show ellipsis (kept for keyword line)
function clampText(txt: string, max: number): string {
  if (txt.length <= max) return txt;
  const truncated = txt.slice(0, max).replace(/\s+\S*$/, ''); // don't cut in word
  return truncated + '…';
}

function SubjectChip({
  subject,
  subjectMaxLen,
}: {
  subject: string;
  subjectMaxLen: number;
}) {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);

  // Close on outside click + Esc
  useEffect(() => {
    if (!open) return;

    const onDown = (e: MouseEvent) => {
      if (!btnRef.current) return;
      if (btnRef.current.contains(e.target as Node)) return;
      setOpen(false);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const chipText = useMemo(
    () => clampText(subject, subjectMaxLen),
    [subject, subjectMaxLen]
  );

  return (
    <span className="relative inline-flex">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen(v => !v)}
        className="
          px-2 py-0.5 text-xs font-medium
          bg-white border border-gray-300 text-gray-700
          rounded-full shadow-sm
          whitespace-nowrap truncate
          max-w-25 sm:max-w-34
          cursor-pointer hover:bg-gray-50
          focus:outline-none focus:ring-2 focus:ring-sky-200
        "
        aria-expanded={open}
      >
        {chipText}
      </button>

      {open && (
        <div
          className="
            absolute z-50 top-full mt-1 left-0
            max-w-[min(280px,90vw)]
            rounded-lg border border-gray-200 bg-white shadow-xl
            px-3 py-2
            text-xs text-gray-800
            whitespace-normal wrap-break-word
          "
          role="dialog"
        >
          {subject}
        </div>
      )}
    </span>
  );
}

function TitleChip({
  subject,
  subjectMaxLen,
}: {
  subject: string;
  subjectMaxLen: number;
}) {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onDown = (e: MouseEvent) => {
      if (!btnRef.current) return;
      if (btnRef.current.contains(e.target as Node)) return;
      setOpen(false);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const chipText = useMemo(
    () => clampText(subject, subjectMaxLen),
    [subject, subjectMaxLen]
  );

  return (
    <span className="relative inline-flex max-w-34 sm:max-w-52">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen(v => !v)}
        className="
          text-base font-medium text-gray-900
          truncate text-left
          cursor-pointer
          hover:text-gray-700
          focus:outline-none focus:ring-2 focus:ring-sky-200
          w-full
        "
        aria-expanded={open}
      >
        {chipText}
      </button>

      {open && (
        <div
          className="
            absolute z-50 top-full left-0 mt-1
            max-w-[min(220px,90vw)] sm:max-w-[min(320px,90vw)]
            rounded-lg border border-gray-200
            bg-white shadow-xl
            px-3 py-2
            text-xs sm:text-sm text-gray-900 font-normal
            whitespace-normal wrap-break-word
          "
          role="dialog"
        >
          {subject}
        </div>
      )}
    </span>
  );
}



export function KeywordCrossDomain({ }: KeywordCrossDomainProps) {
  const { t } = useTranslation();
  const crossDomain = MOCK_KEYWORD_CROSS_DOMAIN;
  const [expanded, setExpanded] = useState<{ [keyword: string]: boolean }>({});

  // Keep your current behavior. (If you want, we can later replace with pure Tailwind logic.)
  const isSmallScreen =
    typeof window !== 'undefined' ? window.innerWidth < 640 : false;

  const maxSubjectsDefault = isSmallScreen ? 2 : 5;
  const keywordMaxLen = isSmallScreen ? 18 : 32;
  const subjectMaxLen = isSmallScreen ? 13 : 20;

  const handleExpand = (keyword: string) => {
    setExpanded(prev => ({ ...prev, [keyword]: true }));
  };

  return (
    <div className="bg-linear-to-br from-blue-50 via-white to-violet-50 border border-blue-100 rounded-2xl shadow-lg p-3 sm:p-6">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <Network className="w-4 h-4 text-gray-500" />
        <h3 className="text-sm font-semibold text-gray-900 truncate">
          {t('insights.trends.keywordCrossDomain.title')}
        </h3>
      </div>

      <div className="space-y-2.5 sm:space-y-4">
        {crossDomain.map((item, idx) => {
          const isExpanded = expanded[item.keyword];
          const maxSubjects =
            item.subjects.length <= maxSubjectsDefault
              ? item.subjects.length
              : maxSubjectsDefault;

          const displaySubjects = isExpanded
            ? item.subjects
            : item.subjects.slice(0, maxSubjects);

          const hasMore = item.subjects.length > maxSubjects && !isExpanded;
          const remainingCount = item.subjects.length - maxSubjects;

          return (
            <div
              key={idx}
              className="p-2.5 sm:p-3 border border-gray-100 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              {/* Keyword and meta */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <TitleChip
                    subject={item.keyword}
                    subjectMaxLen={keywordMaxLen}
                  />

                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 border border-purple-100 text-xs font-semibold text-purple-700 whitespace-nowrap">
                    {t('insights.trends.keywordCrossDomain.domains', {
                      count: item.subjectCount,
                    })}
                  </span>
                </div>

                <span
                  className="text-xs text-gray-500 font-normal truncate max-w-22 sm:max-w-34"
                  title={String(item.articleCount)}
                >
                  {t('insights.trends.keywordCrossDomain.articles', {
                    count: item.articleCount,
                  })}
                </span>
              </div>

              {/* Clustered subject chips */}
              <div className="flex flex-wrap gap-2 mb-1">
                {displaySubjects.map((subject, sIdx) => (
                  <SubjectChip key={sIdx} subject={subject} subjectMaxLen={subjectMaxLen} />
                ))}

                {hasMore && (
                  <button
                    type="button"
                    className="px-2 py-0.5 text-xs text-gray-500 border border-dashed border-gray-300 bg-white rounded-full hover:bg-gray-100 focus:outline-none transition whitespace-nowrap"
                    aria-label={t('insights.trends.keywordCrossDomain.showMore', {
                      count: remainingCount,
                    })}
                    onClick={() => handleExpand(item.keyword)}
                  >
                    {t('insights.trends.keywordCrossDomain.showMore', {
                      count: remainingCount,
                    })}
                  </button>
                )}
              </div>

              {hasMore && (
                <div className="mt-0.5 text-xs text-gray-400 italic truncate">
                  {t('insights.trends.keywordCrossDomain.revealHint')}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
