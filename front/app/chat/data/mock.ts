export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  sqlQuery?: string;
  resultsCount?: number;
}