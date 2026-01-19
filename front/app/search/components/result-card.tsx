import {
  Users,
  Calendar,
  TrendingUp,
  BookOpen,
  ExternalLink,
} from 'lucide-react';
import type { Paper } from '../page';
import { useTranslation } from 'react-i18next';
import { splitCSV } from '../../../hooks/useArticlesSearch';
import { useState } from 'react';
import { incrementArticleView } from '../../../hooks/useArticleView';

interface ResultCardProps {
  paper: Paper & { abstract?: string };
}

export function ResultCard({ paper }: ResultCardProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';

  const authors = splitCSV(paper.authors ?? '');
  const subjects = splitCSV(paper.subjects ?? '');
  const keywords = splitCSV(paper.keywords ?? '');

  const [showFullTitle, setShowFullTitle] = useState(false);
  const [showAllSubjects, setShowAllSubjects] = useState(false);
  const [showAllAuthors, setShowAllAuthors] = useState(false);
  const [showAllKeywords, setShowAllKeywords] = useState(false);
  const [showFullPublisher, setShowFullPublisher] = useState(false);
  const [showFullJournal, setShowFullJournal] = useState(false);

  const externalLinkUrl =
    typeof paper.article_url === 'string' && paper.article_url?.trim()
      ? paper.article_url
      : undefined;

  const visibleSubjects = showAllSubjects ? subjects : subjects.slice(0, 5);
  const visibleAuthors = showAllAuthors ? authors : authors.slice(0, 3);
  const visibleKeywords = showAllKeywords ? keywords : keywords.slice(0, 5);

  return (
    <article
      dir={isRTL ? 'rtl' : 'ltr'}
      className="relative bg-(--surface) rounded-2xl border border-(--border-color)
                 shadow-md hover:shadow-xl hover:border-(--primary-300)
                 transition-all p-4 sm:p-6"
    >
      {/* External link */}
      {externalLinkUrl && (
        <a
          href={externalLinkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`absolute z-20 p-1.5 sm:p-2 rounded-lg
            bg-linear-to-br from-(--primary-600) to-(--primary-500)
            hover:shadow-xl hover:scale-110 transition-all
            ${isRTL ? 'left-3 sm:left-5' : 'right-3 sm:right-5'} top-3 sm:top-5`}
          style={{ color: 'var(--on-primary)' }}
          title={t('search.result.openDoi')}
          onClick={async () => {
            // "paper" always has article_id (from backend type).
            if (paper.article_id) {
              incrementArticleView(paper.article_id as number);
            }
          }}
        >
          <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
        </a>
      )}

      <div className={`flex flex-col sm:flex-row gap-4 sm:gap-6${isRTL ? ' sm:flex-row-reverse' : ''}`}>
        {/* Main content */}
        <div className={`flex-1 min-w-0 flex flex-col gap-0.5 sm:gap-1 ${isRTL ? 'order-1' : 'order-2'}`}>
          {/* Title */}
          <h3
            className="text-lg sm:text-xl font-bold text-(--primary-900)
                      mb-1.5 sm:mb-2 leading-snug text-start w-[90%]"
            title={paper.title}
          >
            {showFullTitle
              ? paper.title
              : paper.title.slice(0, 55) + (paper.title.length > 60 ? '…' : '')}

            {paper.title && paper.title.length > 60 && (
              <button
                onClick={() => setShowFullTitle(v => !v)}
                className="ml-2 text-xs font-medium text-(--primary-600)
                          hover:underline align-baseline"
                title={
                  showFullTitle
                    ? t('search.result.showLess')
                    : t('search.result.showMore')
                }
                type="button"
              >
                {showFullTitle
                  ? t('search.result.showLess')
                  : t('search.result.showMore')}
              </button>
            )}
          </h3>

          <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-5 gap-y-1 sm:gap-y-2
                          text-(--text-secondary) mb-2 sm:mb-3">
            {/* Authors */}
            <div
              className="flex items-center gap-1 text-xs sm:text-sm"
              title={t('search.result.author')}
            >
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />

              <span
                className={
                  showAllAuthors
                    ? 'whitespace-normal'
                    : 'truncate max-w-[168px]'
                }
              >
                {visibleAuthors.length > 0
                  ? visibleAuthors.join(', ')
                  : t('search.result.noAuthors')}
              </span>

              {authors.length > visibleAuthors.length && !showAllAuthors && (
                <button
                  onClick={() => setShowAllAuthors(true)}
                  className="text-xs text-(--primary-600) hover:underline ms-1"
                  title={t('search.result.showAllAuthors')}
                  type="button"
                >
                  {t('search.result.showMore')}
                </button>
              )}
              {showAllAuthors && authors.length > 3 && (
                <button
                  onClick={() => setShowAllAuthors(false)}
                  className="text-xs text-(--primary-600) hover:underline ms-1"
                  title={t('search.result.showFewerAuthors')}
                  type="button"
                >
                  {t('search.result.showLess')}
                </button>
              )}
            </div>

            {/* Year */}
            <div className="flex items-center gap-1 text-xs sm:text-sm" title={t('search.result.yearFrom')}>
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{paper.year ?? ''}</span>
            </div>

            {/* Citations */}
            <div className="flex items-center gap-1 text-xs sm:text-sm" title={t('search.result.citations')}>
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="font-semibold">
                {typeof paper.citation_count === 'number' ? paper.citation_count : 0}{' '}
                {t('search.result.citations')}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-0.5">
            <div className="flex gap-2 items-center">
              {/* Journal badge */}
              {paper.journal && typeof paper.journal === "string" && paper.journal.trim().length > 0 && (
                <div className="flex flex-col">
                  <div className="text-[11px] sm:text-xs font-medium text-(--gray-600) leading-none mb-0.5">
                    {t('search.result.journal', 'Journal')}
                  </div>
                  <div
                    className="flex items-center gap-1 text-xs sm:gap-1.5 sm:text-sm
                              px-1.5 sm:px-2 py-0.5 rounded bg-(--primary-50)
                              text-(--primary-700) font-medium
                              border border-(--primary-100)"
                    title={t('search.result.journal', 'Journal')}
                  >
                    <span>
                      {showFullJournal || (paper.journal?.length ?? 0) <= 30
                        ? paper.journal
                        : `${paper.journal?.slice(0, 20)}...`}
                    </span>
                    {(paper.journal?.length ?? 0) > 30 && (
                      <button
                        onClick={() => setShowFullJournal(v => !v)}
                        className="text-xs text-(--primary-600) hover:underline ms-1"
                        type="button"
                      >
                        {showFullJournal
                          ? t('search.result.showLess')
                          : t('search.result.showMore')}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Publisher badge with show more/less */}
              {paper.publisher && typeof paper.publisher === "string" && paper.publisher.trim().length > 0 && (
                <div className="flex flex-col">
                  <div className="text-[11px] sm:text-xs font-medium text-(--gray-600) leading-none mb-0.5">
                    {t('search.result.publisher', 'Publisher')}
                  </div>
                  <div
                    className="flex items-center gap-1 text-xs sm:gap-1.5 sm:text-sm
                              px-1.5 sm:px-2 py-0.5 rounded bg-(--gray-100)
                              text-(--text-secondary) font-medium
                              border border-(--gray-200)"
                    title={t('search.result.publisher', 'Publisher')}
                  >
                    <span>
                      {showFullPublisher || (paper.publisher?.length ?? 0) <= 30
                        ? paper.publisher
                        : `${paper.publisher?.slice(0, 20)}...`}
                    </span>
                    {(paper.publisher?.length ?? 0) > 30 && (
                      <button
                        onClick={() => setShowFullPublisher(v => !v)}
                        className="text-xs text-(--primary-600) hover:underline ms-1"
                        type="button"
                      >
                        {showFullPublisher
                          ? t('search.result.showLess')
                          : t('search.result.showMore')}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Subjects */}
          {(subjects.length > 0) && (
            <div className="flex flex-col gap-0.5">
              <div className="text-[11px] sm:text-xs font-medium text-(--gray-600)">
                {t('search.result.subjects')}
              </div>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {visibleSubjects.map(subject => (
                  <span
                    key={subject}
                    title={t('search.result.subject')}
                    className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full
                               bg-linear-to-r from-(--primary-100) to-(--primary-50)
                               text-(--primary-700) text-[11px] sm:text-xs font-semibold
                               border border-(--primary-100)"
                  >
                    {subject}
                  </span>
                ))}

                {subjects.length > 5 && (
                  <button
                    onClick={() => setShowAllSubjects(v => !v)}
                    className="text-xs text-(--primary-600) hover:underline"
                    title={
                      showAllSubjects
                        ? t('search.result.showLess')
                        : t('search.result.showMore')
                    }
                    type="button"
                  >
                    {showAllSubjects
                      ? t('search.result.showLess')
                      : t('search.result.showMore')}
                  </button>
                )}
              </div>
            </div>
          )}
          
          {/* Keywords */}
          {keywords.length > 0 && (
            <div className="flex flex-col gap-0.5 mt-1">
              <div className="text-[11px] sm:text-xs font-medium text-(--gray-600)">
                {t('search.result.keyword')}
              </div>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {visibleKeywords.map(keyword => (
                  <span
                    key={keyword}
                    title={t('search.result.keyword')}
                    className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full
                               bg-linear-to-r from-(--primary-100) to-(--primary-50)
                               text-(--primary-700) text-[11px] sm:text-xs font-semibold
                               border border-(--primary-100)"
                  >
                    {keyword}
                  </span>
                ))}
                {keywords.length > 5 && (
                  <button
                    onClick={() => setShowAllKeywords(v => !v)}
                    className="text-xs text-(--primary-600) hover:underline"
                    title={
                      showAllKeywords
                        ? t('search.result.showLess')
                        : t('search.result.showMore')
                    }
                    type="button"
                  >
                    {showAllKeywords
                      ? t('search.result.showLess')
                      : t('search.result.showMore')}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Views */}
          {typeof paper.views === 'number' && (
            <div className="flex flex-col gap-0.5 mt-1">
              <div className="text-[11px] sm:text-xs font-medium text-(--gray-600)">
                {t('search.result.views')}: {paper.views}
              </div>
            </div>
          )}


          {/* Language + Type aligned bottom */}
          <div
            className={`mt-3 flex gap-2 text-xs ${
              isRTL ? 'justify-start' : 'justify-end'
            }`}
          >
            {paper.language && (
              <span
                title={t('search.result.language')}
                className="px-2 py-0.5 rounded bg-(--gray-200) border border-(--gray-300)"
              >
                {(paper.language || '').toUpperCase()}
              </span>
            )}
            {paper.type && (
              <span
                title={t('search.result.type')}
                className="px-2 py-0.5 rounded bg-(--gray-50) border border-(--gray-200)"
              >
                {paper.type}
              </span>
            )}
          </div>
        </div>

        {/* Side icon */}
        <div
          className={`hidden sm:flex flex-col items-center justify-center
            ${isRTL ? 'order-2 ' : 'order-1 '}
            border-e pe-3 sm:pe-4 border-(--border-color)`}
          title={t('search.result.type')}
        >
          <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-(--primary-400) mb-2" />
        </div>
      </div>
    </article>
  );
}
