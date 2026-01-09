export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number; // תמיד number
  sqlQuery?: string;
  resultsCount?: number;
}

export const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content:
      'Hey Im You Personal AI Research Assistant, How May I Asist you today?',
    timestamp: Date.now(),
  },
];
