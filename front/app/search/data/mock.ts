export interface Paper {
  article_id: number;
  openalex_id: string;
  title: string;
  year: number;
  language: string;
  type: string;
  citation_count: number;
  article_url?: string | null;
  journal?: string | null;
  publisher?: string | null;
  impact_factor?: number | null;
  authors?: string | null;
  subjects?: string | null;
  keywords?: string | null;
}

export const LANGUAGES = ['all', 'English', 'Hebrew', 'Spanish', 'French'];
export const TYPES = ['Journal Article', 'Conference Paper', 'Survey'];

export const MOCK_PAPERS: Paper[] = [
  {
    article_id: 1,
    openalex_id: 'openalex:1',
    title: 'Deep Learning Approaches for NLP',
    year: 2023,
    language: 'English',
    type: 'Survey',
    citation_count: 342,
    article_url: 'https://doi.org/10.1234/example.2023.001',
    authors: 'Smith, J., Johnson, M.',
    subjects: 'Machine Learning, Natural Language Processing',
    keywords: 'deep learning, transformers',
  },
  {
    article_id: 2,
    openalex_id: 'openalex:2',
    title: 'Quantum Computing in Cryptography',
    year: 2024,
    language: 'English',
    type: 'Journal Article',
    citation_count: 128,
    article_url: 'https://doi.org/10.1234/example.2024.002',
    authors: 'Brown, A.',
    subjects: 'Quantum Computing',
    keywords: 'quantum, encryption',
  },
  {
    article_id: 3,
    openalex_id: 'openalex:3',
    title: 'Automatic Text Summarization in Hebrew',
    year: 2020,
    language: 'Hebrew',
    type: 'Journal Article',
    citation_count: 64,
    article_url: 'https://doi.org/10.1234/example.2020.003',
    authors: 'Levi, D., Cohen, R.',
    subjects: 'Natural Language Processing, Linguistics',
    keywords: 'summarization, hebrew, machine learning',
  },
  {
    article_id: 4,
    openalex_id: 'openalex:4',
    title: 'Semantic Search using Transformer Models',
    year: 2022,
    language: 'English',
    type: 'Conference Paper',
    citation_count: 210,
    article_url: 'https://doi.org/10.1234/example.2022.004',
    authors: 'Xu, L., Petrov, S.',
    subjects: 'Machine Learning, Information Retrieval',
    keywords: 'semantic search, transformers, bert',
  },
  {
    article_id: 5,
    openalex_id: 'openalex:5',
    title: 'A Survey on Academic Paper Recommendation Systems',
    year: 2021,
    language: 'Spanish',
    type: 'Survey',
    citation_count: 98,
    article_url: 'https://doi.org/10.1234/example.2021.005',
    authors: 'Kumar, A., Garcia, M.',
    subjects: 'Recommendation Systems, Information Retrieval',
    keywords: 'survey, recommendation, papers',
  },
  {
    article_id: 6,
    openalex_id: 'openalex:6',
    title: 'Open Access Publishing Trends in France',
    year: 2019,
    language: 'French',
    type: 'Journal Article',
    citation_count: 33,
    article_url: 'https://doi.org/10.1234/example.2019.006',
    authors: 'Dubois, S.',
    subjects: 'Publishing, Open Access',
    keywords: 'open access, publishing, france',
  },
  {
    article_id: 7,
    openalex_id: 'openalex:7',
    title: 'Multilingual Information Extraction from Scientific Papers',
    year: 2023,
    language: 'Spanish',
    type: 'Conference Paper',
    citation_count: 54,
    article_url: 'https://doi.org/10.1234/example.2023.007',
    authors: 'Garcia, M., Smith, J.',
    subjects: 'Machine Learning, Natural Language Processing',
    keywords: 'multilingual, information extraction, scientific papers',
  },
  {
    article_id: 8,
    openalex_id: 'openalex:8',
    title: 'A New Dataset for Citation Prediction',
    year: 2022,
    language: 'English',
    type: 'Journal Article',
    citation_count: 85,
    article_url: 'https://doi.org/10.1234/example.2022.008',
    authors: 'Johnson, M., Wang, Y.',
    subjects: 'Datasets, Machine Learning',
    keywords: 'dataset, citation prediction',
  },
  {
    article_id: 9,
    openalex_id: 'openalex:9',
    title: 'Transformer Architectures for Low-Resource Languages',
    year: 2024,
    language: 'Hebrew',
    type: 'Journal Article',
    citation_count: 12,
    article_url: 'https://doi.org/10.1234/example.2024.009',
    authors: 'Levi, D., Dubois, S.',
    subjects: 'Natural Language Processing, Deep Learning',
    keywords: 'transformer, low-resource, multilingual',
  },
  {
    article_id: 10,
    openalex_id: 'openalex:10',
    title: 'Ethics in Artificial Intelligence Research',
    year: 2018,
    language: 'English',
    type: 'Survey',
    citation_count: 160,
    article_url: 'https://doi.org/10.1234/example.2018.010',
    authors: 'Brown, A., Cohen, R.',
    subjects: 'Artificial Intelligence, Ethics',
    keywords: 'ethics, ai, policies',
  },
  {
    article_id: 11,
    openalex_id: 'openalex:11',
    title: 'Ethics in Artificial Intelligence Research',
    year: 2018,
    language: 'English',
    type: 'Survey',
    citation_count: 160,
    article_url: 'https://doi.org/10.1234/example.2018.010',
    authors: 'Brown, A., Cohen, R.',
    subjects: 'Artificial Intelligence, Ethics',
    keywords: 'ethics, ai, policies',
  },
];
