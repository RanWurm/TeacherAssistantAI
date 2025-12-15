import { useState } from 'react';
import { ResultCard } from './result-card';
import { Paper } from '../data/mock';
import { Pagination } from './pagination';
import { useTranslation } from 'react-i18next';

interface ResultsListProps {
  papers: Paper[];
}

const PAGE_SIZE = 6;

export function ResultsList({ papers }: ResultsListProps) {
  const [page, setPage] = useState(1);
  const { t } = useTranslation();

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
          {t('search.empty.subtitle', 'Try relaxing your filters or searching for another topic.')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pagedPapers.map((paper) => (
        <ResultCard key={paper.id} paper={paper} />
      ))}
      <Pagination
        current={page}
        total={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
