function yearFilter(fromYear?: number) {
    return fromYear ? "WHERE a.year >= ?" : "";
}

export function buildTopResearchersCandidatesQuery(
  fromYear?: number,
  limit: number = 5
) {
  const where = yearFilter(fromYear);
  const safeLimit = Math.max(1, Math.min(50, Math.floor(limit)));

  const sql = `
    SELECT
      aa.author_id,
      SUM(a.citation_count) AS totalCitations
    FROM Articles a
    JOIN ArticlesAuthors aa
      ON a.article_id = aa.article_id
    ${where}
    GROUP BY aa.author_id
    ORDER BY totalCitations DESC
    LIMIT ${safeLimit}
  `.trim();


  return {
    sql,
    params: fromYear ? [fromYear] : [],
  };
}

export function buildTopResearchersDetailsQuery(
  authorIds: number[],
  fromYear?: number
) {
  if (!authorIds.length) {
    return { sql: "", params: [] as any[] };
  }
  const where = yearFilter(fromYear);
  const whereOrAnd = where ? "AND" : "WHERE";
  const inClause = authorIds.map(() => '?').join(',');

  const sql = `
    SELECT
      au.author_id,
      au.name,
      au.affiliation,
      COUNT(DISTINCT a.article_id) AS articleCount,
      SUM(a.citation_count) AS totalCitations,
      ROUND(AVG(a.citation_count), 2) AS avgCitationsPerArticle,
      COUNT(DISTINCT a.journal_id) AS uniqueJournals,
      COUNT(DISTINCT asub.subject_id) AS uniqueSubjects,
      MAX(a.citation_count) AS mostCitedArticleCitations,
      MIN(a.year) AS firstPublicationYear,
      MAX(a.year) AS lastPublicationYear
    FROM Authors au
    JOIN ArticlesAuthors aa ON au.author_id = aa.author_id
    JOIN Articles a ON aa.article_id = a.article_id
    LEFT JOIN ArticlesSubjects asub ON a.article_id = asub.article_id
    ${where}
    ${whereOrAnd} au.author_id IN (${inClause})
    GROUP BY au.author_id
    ORDER BY totalCitations DESC
  `.trim();

  return {
    sql,
    params: fromYear
      ? [fromYear, ...authorIds]
      : authorIds,
  };
}


export function buildMultidisciplinaryResearchersCandidatesQuery(
  fromYear?: number,
  minSubjects: number = 3,
  limit: number = 5
) {
  const where = yearFilter(fromYear);
  const safeLimit = Math.max(1, Math.min(50, Math.floor(limit)));

  const sql = `
    SELECT
      aa.author_id,
      COUNT(DISTINCT asub.subject_id) AS subjectCount,
      SUM(a.citation_count)           AS totalCitations
    FROM Articles a
    JOIN ArticlesAuthors aa
      ON a.article_id = aa.article_id
    JOIN ArticlesSubjects asub
      ON a.article_id = asub.article_id
    ${where}
    GROUP BY aa.author_id
    HAVING COUNT(DISTINCT asub.subject_id) >= ?
    ORDER BY subjectCount DESC, totalCitations DESC
    LIMIT ${safeLimit}
  `.trim();

  const params: any[] = [];
  if (fromYear) params.push(fromYear);
  params.push(minSubjects);

  return { sql, params };
}

export function buildMultidisciplinaryResearchersDetailsQuery(
  authorIds: number[],
  fromYear?: number
) {
  if (!authorIds.length) {
    return { sql: "", params: [] as any[] };
  }

  const where = yearFilter(fromYear);
  const inClause = authorIds.map(() => "?").join(",");
  const whereOrAnd = where ? "AND" : "WHERE";

  const sql = `
    SELECT
      au.author_id,
      au.name,
      au.affiliation,
      COUNT(DISTINCT a.article_id)              AS articleCount,
      COUNT(DISTINCT asub.subject_id)           AS subjectCount,
      SUM(a.citation_count)                     AS totalCitations,
      ROUND(AVG(a.citation_count), 2)           AS avgCitationsPerArticle,
      GROUP_CONCAT(
        DISTINCT s.subject_name
        ORDER BY s.subject_name
        SEPARATOR '||'
      ) AS subjects
    FROM Authors au
    JOIN ArticlesAuthors aa
      ON au.author_id = aa.author_id
    JOIN Articles a
      ON aa.article_id = a.article_id
    JOIN ArticlesSubjects asub
      ON a.article_id = asub.article_id
    JOIN Subjects s
      ON asub.subject_id = s.subject_id
    ${where}
    ${whereOrAnd} au.author_id IN (${inClause})
    GROUP BY au.author_id
    ORDER BY subjectCount DESC, totalCitations DESC
  `.trim();

  const params: any[] = [];
  if (fromYear) params.push(fromYear);
  params.push(...authorIds);

  return { sql, params };
}