import type {
  OverviewMetrics,
  PublicationTimelinePoint,
  MultidisciplinarySummary,
  TrendingTopic,
  KeywordGrowth,
  KeywordCrossDomain,
  TopResearcher,
  MultidisciplinaryResearcher,
  TopJournal,
  CitationVolatility,
  SubjectJournalHeatmap,
  LanguageImpact,
  MultidisciplinaryComparison,
} from '../types/insights.types';

// Overview Metrics
export const MOCK_OVERVIEW_METRICS: OverviewMetrics = {
  totalArticles: 125430,
  totalAuthors: 45678,
  totalJournals: 3421,
  totalSubjects: 156,
  totalKeywords: 89234,
  avgCitationsPerArticle: 12.5,
  articlesWithMultipleSubjects: 45678,
  articlesWithMultipleAuthors: 98765,
};

// Publications Timeline
export const MOCK_PUBLICATIONS_TIMELINE: PublicationTimelinePoint[] = [
  { year: 2019, articleCount: 18500, authorCount: 12340, journalCount: 890 },
  { year: 2020, articleCount: 22100, authorCount: 14560, journalCount: 1020 },
  { year: 2021, articleCount: 28900, authorCount: 18780, journalCount: 1230 },
  { year: 2022, articleCount: 35600, authorCount: 22340, journalCount: 1450 },
  { year: 2023, articleCount: 42300, authorCount: 26780, journalCount: 1670 },
  { year: 2024, articleCount: 38200, authorCount: 24560, journalCount: 1520 },
];

// Multidisciplinary Summary
export const MOCK_MULTIDISCIPLINARY_SUMMARY: MultidisciplinarySummary = {
  singleSubjectArticles: 45678,
  multiSubjectArticles: 79752,
  avgSubjectsPerArticle: 2.3,
  mostCommonSubjectCombination: {
    subjects: ['Computer Science', 'Mathematics'],
    articleCount: 1234,
  },
};

// Trending Topics
export const MOCK_TRENDING_TOPICS: TrendingTopic[] = [
  { keyword: 'machine learning', articleCount: 12345, growthRate: 45.2, firstAppearanceYear: 2015, latestYear: 2024 },
  { keyword: 'climate change', articleCount: 9876, growthRate: 32.1, firstAppearanceYear: 2010, latestYear: 2024 },
  { keyword: 'quantum computing', articleCount: 5432, growthRate: 67.8, firstAppearanceYear: 2018, latestYear: 2024 },
  { keyword: 'crispr', articleCount: 4321, growthRate: 28.5, firstAppearanceYear: 2016, latestYear: 2024 },
  { keyword: 'renewable energy', articleCount: 6789, growthRate: 23.4, firstAppearanceYear: 2012, latestYear: 2024 },
];

// Keyword Growth
export const MOCK_KEYWORD_GROWTH: KeywordGrowth[] = [
  { keyword: 'machine learning', year: 2022, articleCount: 2345, previousYearCount: 1890, growth: 455 },
  { keyword: 'machine learning', year: 2023, articleCount: 3120, previousYearCount: 2345, growth: 775 },
  { keyword: 'machine learning', year: 2024, articleCount: 3456, previousYearCount: 3120, growth: 336 },
  { keyword: 'climate change', year: 2022, articleCount: 1890, previousYearCount: 1650, growth: 240 },
  { keyword: 'climate change', year: 2023, articleCount: 2100, previousYearCount: 1890, growth: 210 },
  { keyword: 'climate change', year: 2024, articleCount: 1980, previousYearCount: 2100, growth: -120 },
];

// Keyword Cross-Domain
export const MOCK_KEYWORD_CROSS_DOMAIN: KeywordCrossDomain[] = [
  { keyword: 'machine learning', subjectCount: 8, subjects: ['Computer Science', 'Mathematics', 'Statistics', 'Engineering', 'Physics', 'Biology', 'Medicine', 'Economics'], articleCount: 12345 },
  { keyword: 'climate change', subjectCount: 6, subjects: ['Environmental Science', 'Earth Sciences', 'Biology', 'Chemistry', 'Economics', 'Political Science'], articleCount: 9876 },
  { keyword: 'quantum computing', subjectCount: 4, subjects: ['Physics', 'Computer Science', 'Mathematics', 'Engineering'], articleCount: 5432 },
];

// Top Researchers
export const MOCK_TOP_RESEARCHERS: TopResearcher[] = [
  { authorId: 1, name: 'Prof. Sarah Johnson', affiliation: 'University of Cambridge', articleCount: 342, totalCitations: 12450, avgCitationsPerArticle: 36.4, uniqueJournals: 45, uniqueSubjects: 8 },
  { authorId: 2, name: 'Dr. Michael Chen', affiliation: 'MIT', articleCount: 289, totalCitations: 9876, avgCitationsPerArticle: 34.2, uniqueJournals: 38, uniqueSubjects: 6 },
  { authorId: 3, name: 'Prof. Emma Williams', affiliation: 'Stanford University', articleCount: 267, totalCitations: 8934, avgCitationsPerArticle: 33.5, uniqueJournals: 36, uniqueSubjects: 7 },
  { authorId: 4, name: 'Dr. James Brown', affiliation: 'Harvard University', articleCount: 234, totalCitations: 7543, avgCitationsPerArticle: 32.2, uniqueJournals: 32, uniqueSubjects: 5 },
  { authorId: 5, name: 'Prof. Lisa Garcia', affiliation: 'Oxford University', articleCount: 221, totalCitations: 6789, avgCitationsPerArticle: 30.7, uniqueJournals: 30, uniqueSubjects: 6 },
];

// Multidisciplinary Researchers
export const MOCK_MULTIDISCIPLINARY_RESEARCHERS: MultidisciplinaryResearcher[] = [
  { authorId: 1, name: 'Prof. Sarah Johnson', affiliation: 'University of Cambridge', articleCount: 342, subjectCount: 8, subjects: ['Computer Science', 'Mathematics', 'Physics', 'Biology', 'Medicine', 'Engineering', 'Statistics', 'Economics'], avgCitationsPerArticle: 36.4 },
  { authorId: 6, name: 'Dr. Robert Smith', affiliation: 'ETH Zurich', articleCount: 198, subjectCount: 7, subjects: ['Physics', 'Chemistry', 'Materials Science', 'Engineering', 'Mathematics', 'Computer Science', 'Nanotechnology'], avgCitationsPerArticle: 28.9 },
  { authorId: 7, name: 'Prof. Maria Rodriguez', affiliation: 'Max Planck Institute', articleCount: 176, subjectCount: 6, subjects: ['Biology', 'Medicine', 'Chemistry', 'Biochemistry', 'Genetics', 'Pharmacology'], avgCitationsPerArticle: 31.2 },
];

// Top Journals
export const MOCK_TOP_JOURNALS: TopJournal[] = [
  { journalId: 1, name: 'Nature', publisher: 'Nature Publishing Group', articleCount: 15234, totalCitations: 645678, avgCitationsPerArticle: 42.3, uniqueAuthors: 12340, uniqueSubjects: 45, impactFactor: 49.96 },
  { journalId: 2, name: 'Science', publisher: 'AAAS', articleCount: 12456, totalCitations: 482345, avgCitationsPerArticle: 38.7, uniqueAuthors: 9876, uniqueSubjects: 42, impactFactor: 47.73 },
  { journalId: 3, name: 'Cell', publisher: 'Cell Press', articleCount: 9876, totalCitations: 347890, avgCitationsPerArticle: 35.2, uniqueAuthors: 7654, uniqueSubjects: 38, impactFactor: 41.58 },
  { journalId: 4, name: 'The Lancet', publisher: 'Elsevier', articleCount: 8765, totalCitations: 281234, avgCitationsPerArticle: 32.1, uniqueAuthors: 6789, uniqueSubjects: 35, impactFactor: 39.21 },
  { journalId: 5, name: 'PNAS', publisher: 'National Academy of Sciences', articleCount: 7654, totalCitations: 221456, avgCitationsPerArticle: 28.9, uniqueAuthors: 5432, uniqueSubjects: 40, impactFactor: 11.21 },
];

// Citation Volatility
export const MOCK_CITATION_VOLATILITY: CitationVolatility[] = [
  { journalId: 1, journalName: 'Nature', articleCount: 15234, avgCitations: 42.3, minCitations: 0, maxCitations: 1234, citationStdDev: 89.2 },
  { journalId: 2, journalName: 'Science', articleCount: 12456, avgCitations: 38.7, minCitations: 0, maxCitations: 987, citationStdDev: 76.5 },
  { journalId: 3, journalName: 'Cell', articleCount: 9876, avgCitations: 35.2, minCitations: 0, maxCitations: 654, citationStdDev: 65.3 },
  { journalId: 4, journalName: 'The Lancet', articleCount: 8765, avgCitations: 32.1, minCitations: 0, maxCitations: 543, citationStdDev: 58.7 },
  { journalId: 5, journalName: 'PNAS', articleCount: 7654, avgCitations: 28.9, minCitations: 0, maxCitations: 432, citationStdDev: 52.1 },
];

// Subject-Journal Heatmap
export const MOCK_SUBJECT_JOURNAL_HEATMAP: SubjectJournalHeatmap[] = [
  { subjectName: 'Computer Science', journalName: 'Nature', articleCount: 1234 },
  { subjectName: 'Computer Science', journalName: 'Science', articleCount: 987 },
  { subjectName: 'Biology', journalName: 'Nature', articleCount: 2345 },
  { subjectName: 'Biology', journalName: 'Cell', articleCount: 3456 },
  { subjectName: 'Physics', journalName: 'Nature', articleCount: 1876 },
  { subjectName: 'Physics', journalName: 'Science', articleCount: 1456 },
  { subjectName: 'Medicine', journalName: 'The Lancet', articleCount: 4567 },
  { subjectName: 'Medicine', journalName: 'Nature', articleCount: 1234 },
];

// Language Impact
export const MOCK_LANGUAGE_IMPACT: LanguageImpact[] = [
  { language: 'English', articleCount: 112345, avgCitations: 13.2, totalCitations: 1482954, uniqueJournals: 3200 },
  { language: 'Spanish', articleCount: 6789, avgCitations: 8.5, totalCitations: 57682, uniqueJournals: 156 },
  { language: 'Chinese', articleCount: 4321, avgCitations: 6.2, totalCitations: 26810, uniqueJournals: 89 },
  { language: 'French', articleCount: 2345, avgCitations: 7.8, totalCitations: 18291, uniqueJournals: 67 },
  { language: 'German', articleCount: 1890, avgCitations: 9.1, totalCitations: 17199, uniqueJournals: 54 },
];

// Multidisciplinary Comparison
export const MOCK_MULTIDISCIPLINARY_COMPARISON: MultidisciplinaryComparison[] = [
  {
    category: 'single-subject',
    articleCount: 45678,
    avgCitations: 10.2,
    totalCitations: 465916,
    uniqueAuthors: 23456,
    uniqueJournals: 1234,
  },
  {
    category: 'multi-subject',
    articleCount: 79752,
    avgCitations: 14.8,
    totalCitations: 1178329,
    uniqueAuthors: 34567,
    uniqueJournals: 2345,
  },
];
