import { X } from 'lucide-react';

interface ResultsHeaderProps {
  count: number;
  selectedTopics: string[];
  toggleTopic: (topic: string) => void;
}

export function ResultsHeader({ count, selectedTopics, toggleTopic }: ResultsHeaderProps) {
  return (
    <div className="bg-[color:var(--surface)] rounded-2xl border border-[color:var(--border-color)] shadow-sm p-5 mb-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[color:var(--text-secondary)]">
            Found <span className="font-semibold text-[color:var(--text-primary)]">{count.toLocaleString()}</span> papers
          </p>
          {selectedTopics.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedTopics.map((topic) => (
                <span
                  key={topic}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[color:var(--primary-50)] text-[color:var(--primary-700)] text-xs font-medium"
                >
                  {topic}
                  <button onClick={() => toggleTopic(topic)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        <select className="px-3 py-2 rounded-lg border border-[color:var(--border-color)] text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-500)] bg-[color:var(--input-bg)] text-[color:var(--text-primary)]">
          <option>Most Cited</option>
          <option>Most Recent</option>
          <option>Relevance</option>
        </select>
      </div>
    </div>
  );
}

