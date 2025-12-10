import { MOCK_TOPICS } from '../../data/mock';
import { TrendingItem } from './trending-item';

export function TopicsList() {
  const maxPapers = Math.max(...MOCK_TOPICS.map(t => t.papers));

  return (
    <div className="space-y-4">
      {MOCK_TOPICS.map((topic, idx) => (
        <TrendingItem key={idx} topic={topic} index={idx + 1} maxPapers={maxPapers} />
      ))}
    </div>
  );
}

