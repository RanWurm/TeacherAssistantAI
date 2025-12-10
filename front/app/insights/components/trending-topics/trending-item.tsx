import { Zap } from 'lucide-react';
import { TrendingTopic } from '../../data/mock';

interface TrendingItemProps {
  topic: TrendingTopic;
  index: number;
  maxPapers: number;
}

export function TrendingItem({ topic, index, maxPapers }: TrendingItemProps) {
  const percentage = Math.min((topic.papers / maxPapers) * 100, 100);

  return (
    <div className={`group hover:bg-[color:var(--list-hover-bg)] rounded-xl p-4 transition-colors border border-transparent hover:border-[color:var(--border-color)]`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-[color:var(--list-rank-muted)]">#{index + 1}</span>
          <div>
            <h3 className="font-semibold text-[color:var(--text-main)] group-hover:text-[color:var(--accent-main)] transition-colors">
              {topic.topic}
            </h3>
            <p className="text-sm text-[color:var(--card-sub-text)]">{topic.papers.toLocaleString()} papers</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[color:var(--badge-orange-text)]" />
          <span className="text-sm font-semibold bg-[color:var(--badge-orange-bg)] text-[color:var(--badge-orange-text)] px-3 py-1 rounded-lg">
            +{topic.growth}% growth
          </span>
        </div>
      </div>
      <div className="h-2 bg-[color:var(--timeline-track)] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[var(--trending-fill-start)] to-[var(--trending-fill-end)] rounded-full transition-all duration-1000"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

