import { ResultCard } from './result-card';
import { Paper } from '../data/mock';

interface ResultsListProps {
  papers: Paper[];
}

export function ResultsList({ papers }: ResultsListProps) {
  return (
    <div className="space-y-4">
      {papers.map((paper) => (
        <ResultCard key={paper.id} paper={paper} />
      ))}
    </div>
  );
}

