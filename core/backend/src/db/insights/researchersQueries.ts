function yearFilter(fromYear?: number) {
    return fromYear ? "WHERE a.year >= ?" : "";
}

/**
 * Top researchers by total citations
 */
// export function buildTopResearchersQuery(
//     fromYear?: number,
//     limit: number = 5
// ) {
//     const where = yearFilter(fromYear);

//     const sql = `
//       SELECT
//         au.author_id                              AS author_id,
//         au.name                                   AS name,
//         au.affiliation                            AS affiliation,
//         COUNT(DISTINCT a.article_id)              AS articleCount,
//         SUM(a.citation_count)                     AS totalCitations,
//         ROUND(AVG(a.citation_count), 2)           AS avgCitationsPerArticle,
//         COUNT(DISTINCT a.journal_id)              AS uniqueJournals,
//         COUNT(DISTINCT asub.subject_id)           AS uniqueSubjects,
//         MAX(a.citation_count)                     AS mostCitedArticleCitations,
//         MIN(a.year)                               AS firstPublicationYear,
//         MAX(a.year)                               AS lastPublicationYear
//       FROM Authors au
//       JOIN ArticlesAuthors aa ON au.author_id = aa.author_id
//       JOIN Articles a ON aa.article_id = a.article_id
//       LEFT JOIN ArticlesSubjects asub ON a.article_id = asub.article_id
//       ${where}
//       GROUP BY au.author_id
//       ORDER BY totalCitations DESC
//       LIMIT ${limit}
//     `.trim();

//     return {
//         sql,
//         params: fromYear ? [fromYear] : [],
//     };
// }

export function buildTopResearchersCandidatesQuery(
  fromYear?: number,
  limit: number = 5
) {
  const where = yearFilter(fromYear);

  const sql = `
    SELECT
      aa.author_id,
      SUM(a.citation_count) AS totalCitations
    FROM Articles a
    JOIN ArticlesAuthors aa ON a.article_id = aa.article_id
    ${where}
    GROUP BY aa.author_id
    ORDER BY totalCitations DESC
    LIMIT ${limit}
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
  const where = yearFilter(fromYear);
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
    AND au.author_id IN (${inClause})
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


/**
 * Multidisciplinary researchers
 */
// export function buildMultidisciplinaryResearchersQuery(
//     fromYear?: number,
//     minSubjects: number = 3,
//     limit: number = 5
// ) {
//     const where = yearFilter(fromYear);

//     const sql = `
//       SELECT
//         au.author_id                              AS author_id,
//         au.name                                   AS name,
//         au.affiliation                            AS affiliation,
//         COUNT(DISTINCT a.article_id)              AS articleCount,
//         COUNT(DISTINCT asub.subject_id)           AS subjectCount,
//         SUM(a.citation_count)                     AS totalCitations,
//         ROUND(AVG(a.citation_count), 2)           AS avgCitationsPerArticle,
//         GROUP_CONCAT(
//           DISTINCT s.subject_name
//           ORDER BY s.subject_name
//           SEPARATOR '||'
//         )                                         AS subjects
//       FROM Authors au
//       JOIN ArticlesAuthors aa ON au.author_id = aa.author_id
//       JOIN Articles a ON aa.article_id = a.article_id
//       JOIN ArticlesSubjects asub ON a.article_id = asub.article_id
//       JOIN Subjects s ON asub.subject_id = s.subject_id
//       ${where}
//       GROUP BY au.author_id
//       HAVING subjectCount >= ?
//       ORDER BY subjectCount DESC, totalCitations DESC
//       LIMIT ${limit}
//     `.trim();

//     const params: any[] = [];
//     if (fromYear) params.push(fromYear);
//     params.push(minSubjects);

//     return { sql, params };
// }

export function buildMultidisciplinaryResearchersCandidatesQuery(
  fromYear?: number,
  minSubjects: number = 3,
  limit: number = 5
) {
  const where = yearFilter(fromYear);

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
    HAVING subjectCount >= ?
    ORDER BY subjectCount DESC, totalCitations DESC
    LIMIT ${limit}
  `.trim();

  const params: any[] = [];
  if (fromYear) params.push(fromYear);
  params.push(minSubjects);

  return { sql, params };
}

/**
 * Phase 2: Fetch full multidisciplinary researchers details
 * - runs only on a small IN list
 * - includes subjects list
 */
export function buildMultidisciplinaryResearchersDetailsQuery(
  authorIds: number[],
  fromYear?: number
) {
  if (!authorIds.length) {
    return { sql: "", params: [] as any[] };
  }

  // IMPORTANT: because we join via Articles, the "year filter" must apply to Articles (a)
  // but here we're using yearFilter which injects WHERE a.year >= ?
  // so we need to place it after JOINs, before the IN clause.
  const where = yearFilter(fromYear);
  const inClause = authorIds.map(() => "?").join(",");

  // If yearFilter returned "WHERE a.year >= ?" then we can append "AND ..."
  // If it returned "" (all years), we must start with "WHERE ..."
  const whereOrAnd = where ? "AND" : "WHERE";

  const sql = `
    SELECT
      au.author_id                              AS author_id,
      au.name                                   AS name,
      au.affiliation                            AS affiliation,
      COUNT(DISTINCT a.article_id)              AS articleCount,
      COUNT(DISTINCT asub.subject_id)           AS subjectCount,
      SUM(a.citation_count)                     AS totalCitations,
      ROUND(AVG(a.citation_count), 2)           AS avgCitationsPerArticle,
      GROUP_CONCAT(
        DISTINCT s.subject_name
        ORDER BY s.subject_name
        SEPARATOR '||'
      )                                         AS subjects
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