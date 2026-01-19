import { useEffect, useRef } from 'react';
import { ResultCard } from './result-card';
import { Paper } from '../page';
import { Pagination } from './pagination';
import { useTranslation } from 'react-i18next';

interface ResultsListProps {
  papers: Paper[];
  loading: boolean;
  page: number;
  total: number;
  onPageChange: (page: number) => void;
}

const PAGE_SIZE = 6;

export function ResultsList({
  papers,
  loading,
  page,
  total,
  onPageChange,
}: ResultsListProps) {
  const { t } = useTranslation();
  const loadStartTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (loading) {
      loadStartTimeRef.current = performance.now();
    } else if (loadStartTimeRef.current !== null) {
      loadStartTimeRef.current = null;
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[240px] text-center">
        <h2 className="text-xl font-semibold">
          {t('search.loading.title', 'Loading data...')}
        </h2>
      </div>
    );
  }

  if (papers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[240px] text-center">
        <h2 className="text-xl font-semibold">
          {t('search.empty.title', 'No papers found')}
        </h2>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {papers.map(paper => (
        <ResultCard key={paper.article_id} paper={paper} />
      ))}

      <Pagination
        current={page}
        total={Math.ceil(total / PAGE_SIZE)}
        onPageChange={onPageChange}
      />
    </div>
  );
}
