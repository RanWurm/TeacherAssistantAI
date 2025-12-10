import { TopicsList } from './topics-list';

export function TrendingTopicsView() {
  return (
    <div className="bg-[color:var(--card-bg)] rounded-2xl border border-[color:var(--border-color)] shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[color:var(--card-text)] mb-1">Trending Research Topics</h2>
        <p className="text-sm text-[color:var(--card-sub-text)]">Topics with highest growth in publications</p>
      </div>
      <TopicsList />
    </div>
  );
}

