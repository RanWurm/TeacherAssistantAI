export interface Paper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  citations: number;
  doi: string;
  topics: string[];
  journal?: string;
  language: string;
}

export const MOCK_PAPERS: Paper[] = [
  {
    id: '1',
    title: 'Deep Learning Approaches for Natural Language Processing: A Comprehensive Survey',
    authors: ['Smith, J.', 'Johnson, M.', 'Williams, R.'],
    year: 2023,
    citations: 342,
    doi: '10.1234/example.2023.001',
    topics: ['Machine Learning', 'Natural Language Processing'],
    journal: 'Journal of AI Research',
    language: 'English',
  },
  {
    id: '2',
    title: 'Quantum Computing Applications in Cryptography',
    authors: ['Brown, A.', 'Davis, K.'],
    year: 2024,
    citations: 128,
    doi: '10.1234/example.2024.002',
    topics: ['Quantum Computing', 'Cryptography'],
    journal: 'Quantum Science Journal',
    language: 'English',
  },
  {
    id: '3',
    title: 'Climate Change Impact on Marine Ecosystems',
    authors: ['Garcia, L.', 'Martinez, C.', 'Rodriguez, P.', 'Lopez, M.'],
    year: 2023,
    citations: 567,
    doi: '10.1234/example.2023.003',
    topics: ['Climate Science', 'Marine Biology'],
    journal: 'Environmental Research Letters',
    language: 'English',
  },
];

export const LANGUAGES = ['all', 'English', 'Hebrew', 'Spanish', 'French'];

