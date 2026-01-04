import { useState } from 'react';
import { ResultCard } from './result-card';
import { Paper } from '../page';
import { Pagination } from './pagination';
import { useTranslation } from 'react-i18next';

interface ResultsListProps {
  papers: Paper[];
  loading: boolean;
}

const PAGE_SIZE = 6;

export function ResultsList({ papers, loading }: ResultsListProps) {
  const [page, setPage] = useState(1);
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[240px] text-center">
        <svg className="animate-spin h-9 w-9 text-(--primary-500) mb-4" viewBox="0 0 24 24">
          <circle className="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-80" fill="currentColor"
            d="M4 12a8 8 0 017.96-8V1.5a10.5 10.5 0 100 21V20a8 8 0 01-7.96-8z" />
        </svg>
        <h2 className="text-xl font-semibold">
          {t('search.loading.title', 'Loading data...')}
        </h2>
        <p className="text-base text-(--text-secondary)">
          {t('search.loading.subtitle', 'Please wait while we fetch your search results.')}
        </p>
      </div>
    );
  }


  const totalPages = Math.ceil(papers.length / PAGE_SIZE);
  const pagedPapers = papers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Show "no results found" if there are zero papers
  if (papers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[240px] text-center">
        <h2 className="text-xl font-semibold text-(--text-primary)">
          {t('search.empty.title', 'No papers found')}
        </h2>
        <p className="text-(--text-secondary) mt-2">
          {t('search.empty.subtitle', 'Try adjusting your search or removing filters to see more results.')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pagedPapers.map((paper) => (
        <ResultCard key={paper.article_id} paper={paper} />
      ))}
      <Pagination
        current={page}
        total={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
