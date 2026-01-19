function yearFilter(fromYear?: number) {
  return fromYear ? "WHERE a.year >= ?" : "";
}

/**
 * Top researchers by total citations
 */
export function buildTopResearchersQuery(
  fromYear?: number,
  limit: number = 5
) {
  const where = yearFilter(fromYear);

  const sql = `
    SELECT
      au.author_id                              AS author_id,
      au.name                                   AS name,
      COUNT(DISTINCT a.article_id)              AS articleCount,
      SUM(a.citation_count)                     AS totalCitations,
      ROUND(AVG(a.citation_count), 2)           AS avgCitationsPerArticle,
      COUNT(DISTINCT a.source_id)               AS uniqueSources,
      COUNT(DISTINCT asub.subject_id)           AS uniqueSubjects,
      MAX(a.citation_count)                     AS mostCitedArticleCitations,
      MIN(a.year)                               AS firstPublicationYear,
      MAX(a.year)                               AS lastPublicationYear,
      GROUP_CONCAT(DISTINCT i.name SEPARATOR '||') AS institutions
    FROM Authors au
    JOIN ArticlesAuthors aa ON au.author_id = aa.author_id
    JOIN Articles a ON aa.article_id = a.article_id
    LEFT JOIN ArticlesSubjects asub ON a.article_id = asub.article_id
    LEFT JOIN ArticleAuthorInstitutions aai ON a.article_id = aai.article_id AND au.author_id = aai.author_id
    LEFT JOIN Institutions i ON aai.institution_id = i.institution_id
    ${where}
    GROUP BY au.author_id
    ORDER BY totalCitations DESC
    LIMIT ${limit}
  `.trim();

  return {
    sql,
    params: fromYear ? [fromYear] : [],
  };
}

/**
 * Multidisciplinary researchers
 */
export function buildMultidisciplinaryResearchersQuery(
  fromYear?: number,
  minSubjects: number = 3,
  limit: number = 5
) {
  const where = yearFilter(fromYear);

  const sql = `
    SELECT
      au.author_id                              AS author_id,
      au.name                                   AS name,
      COUNT(DISTINCT a.article_id)              AS articleCount,
      COUNT(DISTINCT asub.subject_id)           AS subjectCount,
      SUM(a.citation_count)                     AS totalCitations,
      ROUND(AVG(a.citation_count), 2)           AS avgCitationsPerArticle,
      GROUP_CONCAT(
        DISTINCT s.subject_name
        ORDER BY s.subject_name
        SEPARATOR '||'
      )                                         AS subjects,
      GROUP_CONCAT(DISTINCT i.name SEPARATOR '||') AS institutions
    FROM Authors au
    JOIN ArticlesAuthors aa ON au.author_id = aa.author_id
    JOIN Articles a ON aa.article_id = a.article_id
    JOIN ArticlesSubjects asub ON a.article_id = asub.article_id
    JOIN Subjects s ON asub.subject_id = s.subject_id
    LEFT JOIN ArticleAuthorInstitutions aai ON a.article_id = aai.article_id AND au.author_id = aai.author_id
    LEFT JOIN Institutions i ON aai.institution_id = i.institution_id
    ${where}
    GROUP BY au.author_id
    HAVING subjectCount >= ?
    ORDER BY subjectCount DESC, totalCitations DESC
    LIMIT ${limit}
  `.trim();

  const params: any[] = [];
  if (fromYear) params.push(fromYear);
  params.push(minSubjects);

  return { sql, params };
}