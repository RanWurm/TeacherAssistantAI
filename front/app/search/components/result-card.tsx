import { Users, Calendar, TrendingUp, BookOpen, ExternalLink } from 'lucide-react';
import { Paper } from '../data/mock';

interface ResultCardProps {
  paper: Paper;
}

export function ResultCard({ paper }: ResultCardProps) {
  return (
    <article className="bg-[color:var(--surface)] rounded-2xl border border-[color:var(--border-color)] shadow-sm hover:shadow-md hover:border-[color:var(--primary-200)] transition-all p-6 group">
      <div className="flex gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[color:var(--text-primary)] mb-2 group-hover:text-[color:var(--primary-600)] transition-colors line-clamp-2">
            {paper.title}
          </h3>

          <div className="flex flex-wrap items-center gap-4 text-sm text-[color:var(--text-secondary)] mb-3">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span className="line-clamp-1">{paper.authors.join(', ')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{paper.year}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              <span className="font-medium">{paper.citations} citations</span>
            </div>
            {paper.journal && (
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span className="line-clamp-1">{paper.journal}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {paper.topics.map((topic) => (
              <span
                key={topic}
                className="px-2.5 py-1 rounded-lg bg-[color:var(--gray-100)] text-[color:var(--text-primary)] text-xs font-medium"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <a
            href={`https://doi.org/${paper.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-gradient-to-br from-[var(--primary-600)] to-[var(--primary-500)] hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center"
            style={{ color: "var(--on-primary)" }}
          >
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </div>
    </article>
  );
}

