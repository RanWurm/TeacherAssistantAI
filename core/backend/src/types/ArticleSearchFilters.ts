export interface ArticleSearchFilters {
    subject?: string;     // matches Subjects.subject_name
    author?: string;      // matches Authors.name
    keyword?: string;     // matches Keywords.keyword
    language?: string;    // Articles.language
    type?: string;        // Articles.type
    fromYear?: number;    // range
    toYear?: number;      // range
    limit?: number;       // pagination
    offset?: number;      // pagination
  }
  