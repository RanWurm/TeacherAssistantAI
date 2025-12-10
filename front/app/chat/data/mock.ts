export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sqlQuery?: string;
  resultsCount?: number;
}

export const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: 'שלום! אני עוזר המחקר שלך. תאר לי את תחום העניין שלך ואני אעזור לך למצוא רעיונות מחקר חדשניים על בסיס מאגר CORE.',
    timestamp: new Date(),
  },
];

