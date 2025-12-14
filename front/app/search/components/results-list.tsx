import { useState } from 'react';
import { ResultCard } from './result-card';
import { Paper } from '../data/mock';
import { Pagination } from './pagination';

interface ResultsListProps {
  papers: Paper[];
}

const PAGE_SIZE = 6;

export function ResultsList({ papers }: ResultsListProps) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(papers.length / PAGE_SIZE);
  const pagedPapers = papers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
