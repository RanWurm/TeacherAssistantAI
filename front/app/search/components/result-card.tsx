import { Users, Calendar, TrendingUp, BookOpen, ExternalLink } from 'lucide-react';
import { Paper } from '../data/mock';

interface ResultCardProps {
  paper: Paper;
}

// Add 'abstract' as optional property to Paper type for local use to fix type error.
type PaperWithAbstract = Paper & { abstract?: string };

export function ResultCard({ paper }: ResultCardProps) {
  // Type assertion for extended properties if needed
  const localPaper = paper as PaperWithAbstract;

  return (
    <article className="relative bg-[color:var(--surface)] rounded-2xl border border-[color:var(--border-color)] shadow-md hover:shadow-xl hover:border-[color:var(--primary-300)] transition-all p-6 group">
      {/* Floating External Link */}
      <a
        href={`https://doi.org/${localPaper.doi}`}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-5 right-5 z-20 p-2 rounded-lg bg-gradient-to-br from-[var(--primary-600)] to-[var(--primary-500)] hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center group/external"
        style={{ color: "var(--on-primary)" }}
        title="Open DOI"
      >
        <ExternalLink className="w-5 h-5" />
        <span className="sr-only">Open publication DOI</span>
      </a>
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Icon for visual interest */}
        <div className="hidden sm:flex flex-col items-center justify-center mr-4 pr-2 border-r border-[color:var(--border-color)]">
          <BookOpen className="w-10 h-10 text-[color:var(--primary-400)] mb-2 drop-shadow" />
          {localPaper.impactFactor != null && (
            <span className="text-xs text-[color:var(--primary-800)] font-semibold bg-[var(--primary-100)] rounded-lg px-2 py-0.5 mt-1">
              IF: {localPaper.impactFactor}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <h3 className="text-xl font-bold text-[color:var(--primary-900)] mb-2 group-hover:text-[color:var(--primary-600)] transition-colors leading-snug line-clamp-2">
            {localPaper.title}
          </h3>
          {/* Metadata row */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[color:var(--text-secondary)] mb-3">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm">
              <Users className="w-4 h-4" />
              <span className="truncate max-w-[168px]">{localPaper.authors.join(', ')}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm">
              <Calendar className="w-4 h-4" />
              <span>{localPaper.year}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm">
              <TrendingUp className="w-4 h-4" />
              <span className="font-semibold">{localPaper.citations.toLocaleString()} citations</span>
            </div>
            {localPaper.journal && (
              <div className="flex items-center gap-1.5 text-xs sm:text-sm px-2 py-0.5 rounded bg-[color:var(--primary-50)] text-[color:var(--primary-700)] font-medium border border-[color:var(--primary-100)]">
                <BookOpen className="w-4 h-4 opacity-60" />
                <span className="truncate max-w-[88px]">{localPaper.journal}</span>
              </div>
            )}
          </div>
          {/* Abstract preview (if present) */}
          {localPaper.abstract && (
            <p className="text-[color:var(--text-secondary)] text-sm mb-2 line-clamp-3">
              {localPaper.abstract}
            </p>
          )}

          {/* Topics as chips */}
          <div className="flex flex-wrap gap-2 pt-1">
            {localPaper.topics.map((topic) => (
              <span
                key={topic}
                className="px-3 py-1 rounded-full bg-gradient-to-r from-[var(--primary-100)] to-[var(--primary-50)] text-[color:var(--primary-700)] text-xs font-semibold shadow-sm border border-[color:var(--primary-100)] hover:bg-[var(--primary-200)] transition-colors cursor-pointer"
                title={topic}
              >
                {topic}
              </span>
            ))}
            {localPaper.language && (
              <span
                className="ml-2 px-2 py-0.5 rounded bg-[color:var(--gray-200)] text-[color:var(--text-secondary)] text-xs font-medium border border-[color:var(--gray-300)]"
                title="Language"
              >
                {localPaper.language.toUpperCase()}
              </span>
            )}
            {localPaper.type && (
              <span
                className="ml-2 px-2 py-0.5 rounded bg-[color:var(--gray-50)] text-[color:var(--gray-700)] text-xs font-medium border border-[color:var(--gray-200)]"
                title="Type"
              >
                {localPaper.type}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
