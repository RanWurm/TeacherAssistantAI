export interface TopResearcher {
  name: string;
  papers: number;
  citations: number;
  hIndex: number;
}

export interface TopJournal {
  name: string;
  papers: number;
  avgCitations: number;
  impactFactor: number;
}

export interface TrendingTopic {
  topic: string;
  papers: number;
  growth: number;
}

export interface YearlyData {
  year: number;
  papers: number;
}

export const MOCK_RESEARCHERS: TopResearcher[] = [
  { name: 'Prof. Sarah Johnson', papers: 342, citations: 12450, hIndex: 45 },
  { name: 'Dr. Michael Chen', papers: 289, citations: 9876, hIndex: 38 },
  { name: 'Prof. Emma Williams', papers: 267, citations: 8934, hIndex: 36 },
  { name: 'Dr. James Brown', papers: 234, citations: 7543, hIndex: 32 },
  { name: 'Prof. Lisa Garcia', papers: 221, citations: 6789, hIndex: 30 },
];

export const MOCK_JOURNALS: TopJournal[] = [
  { name: 'Nature', papers: 15234, avgCitations: 42.3, impactFactor: 49.96 },
  { name: 'Science', papers: 12456, avgCitations: 38.7, impactFactor: 47.73 },
  { name: 'Cell', papers: 9876, avgCitations: 35.2, impactFactor: 41.58 },
  { name: 'The Lancet', papers: 8765, avgCitations: 32.1, impactFactor: 39.21 },
  { name: 'PNAS', papers: 7654, avgCitations: 28.9, impactFactor: 11.21 },
];

export const MOCK_TOPICS: TrendingTopic[] = [
  { topic: 'Artificial Intelligence', papers: 45678, growth: 234 },
  { topic: 'Climate Change', papers: 38921, growth: 156 },
  { topic: 'Quantum Computing', papers: 12345, growth: 389 },
  { topic: 'CRISPR', papers: 9876, growth: 178 },
  { topic: 'Renewable Energy', papers: 23456, growth: 145 },
];

export const YEARLY_DATA: YearlyData[] = [
  { year: 2019, papers: 28500 },
  { year: 2020, papers: 32100 },
  { year: 2021, papers: 38900 },
  { year: 2022, papers: 45600 },
  { year: 2023, papers: 52300 },
  { year: 2024, papers: 48200 },
];

