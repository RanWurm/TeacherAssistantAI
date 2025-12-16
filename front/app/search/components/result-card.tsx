import {
  Users,
  Calendar,
  TrendingUp,
  BookOpen,
  ExternalLink,
} from 'lucide-react';
import { Paper } from '../data/mock';
import { useTranslation } from 'react-i18next';

interface ResultCardProps {
  paper: Paper;
}

type PaperWithAbstract = Paper & { abstract?: string };

export function ResultCard({ paper }: ResultCardProps) {
  const localPaper = paper as PaperWithAbstract;
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';

  return (
    <article
      dir={isRTL ? 'rtl' : 'ltr'}
      className="relative bg-(--surface) rounded-2xl border border-(--border-color)
                 shadow-md hover:shadow-xl hover:border-(--primary-300)
                 transition-all p-4 sm:p-6"
    >
      {/* External link */}
      <a
        href={`https://doi.org/${localPaper.doi}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`absolute z-20 p-1.5 sm:p-2 rounded-lg
          bg-linear-to-br from-(--primary-600) to-(--primary-500)
          hover:shadow-xl hover:scale-110 transition-all
          ${isRTL ? 'left-3 sm:left-5' : 'right-3 sm:right-5'} top-3 sm:top-5`}
        style={{ color: 'var(--on-primary)' }}
        title={t('search.resultsHeader.openDoi')}
      >
        <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
      </a>

      <div className={`flex flex-col sm:flex-row gap-4 sm:gap-6${isRTL ? ' sm:flex-row-reverse' : ''}`}>
        {/* Main content */}
        <div className={`flex-1 min-w-0 flex flex-col gap-0.5 sm:gap-1 ${isRTL ? 'order-1' : 'order-2'}`}>
          <h3 className="text-lg sm:text-xl font-bold text-(--primary-900)
                         mb-1.5 sm:mb-2 leading-snug line-clamp-2 text-start">
            {localPaper.title}
          </h3>

          <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-5 gap-y-1 sm:gap-y-2
                          text-(--text-secondary) mb-2 sm:mb-3">
            <div className="flex items-center gap-1 text-xs sm:text-sm">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="truncate max-w-[115px] sm:max-w-[168px]">
                {localPaper.authors.join(', ')}
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs sm:text-sm">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{localPaper.year}</span>
            </div>

            <div className="flex items-center gap-1 text-xs sm:text-sm">
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="font-semibold">
                {localPaper.citations.toLocaleString()} {t('search.sort.citations')}
              </span>
            </div>

            {localPaper.journal && (
              <div className="flex items-center gap-1 text-xs sm:gap-1.5 sm:text-sm
                              px-1.5 sm:px-2 py-0.5 rounded bg-(--primary-50)
                              text-(--primary-700) font-medium
                              border border-(--primary-100)">
                <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-60" />
                <span className="truncate max-w-[60px] sm:max-w-[88px]">
                  {localPaper.journal}
                </span>
              </div>
            )}
          </div>

          {localPaper.abstract && (
            <p className="text-(--text-secondary) text-xs sm:text-sm mb-1.5 sm:mb-2 line-clamp-3 text-start">
              {localPaper.abstract}
            </p>
          )}

          <div className="flex flex-wrap gap-1 sm:gap-2 pt-0.5 sm:pt-1">
            {localPaper.topics.map((topic) => (
              <span
                key={topic}
                className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full
                           bg-linear-to-r from-(--primary-100) to-(--primary-50)
                           text-(--primary-700) text-[11px] sm:text-xs font-semibold
                           border border-(--primary-100)"
              >
                {topic}
              </span>
            ))}

            {localPaper.language && (
              <span className="ms-1 sm:ms-2 px-1.5 sm:px-2 py-0.5 rounded
                               bg-(--gray-200) text-[11px] sm:text-xs
                               border border-(--gray-300)">
                {localPaper.language.toUpperCase()}
              </span>
            )}

            {localPaper.type && (
              <span className="ms-1 sm:ms-2 px-1.5 sm:px-2 py-0.5 rounded
                               bg-(--gray-50) text-[11px] sm:text-xs
                               border border-(--gray-200)">
                {localPaper.type}
              </span>
            )}
          </div>
        </div>

        {/* Side icon */}
        <div
          className={`hidden sm:flex flex-col items-center justify-center
            ${isRTL ? 'order-2 ' : 'order-1 '}
            border-e pe-3 sm:pe-4 border-(--border-color)`}
        >
          <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-(--primary-400) mb-2" />
          {localPaper.impactFactor != null && (
            <span className="text-[11px] sm:text-xs font-semibold bg-(--primary-100)
                             text-(--primary-800) rounded px-1.5 sm:px-2 py-0.5 min-w-0 flex flex-col items-center text-center leading-tight whitespace-normal max-w-[100px] sm:max-w-[135px]">
              {t('search.sort.impact', 'IF')}: {localPaper.impactFactor}
              </span>
          )}
        </div>
      </div>
    </article>
  );
}
