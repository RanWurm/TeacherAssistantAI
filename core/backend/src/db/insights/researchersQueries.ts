function yearFilter(fromYear?: number) {
    return fromYear ? "WHERE a.year >= ?" : "";
}

/**
 * Top researchers by total citations
 */
export function buildTopResearchersQuery(
    fromYear?: number,
    limit: number = 20
) {
    const where = yearFilter(fromYear);

    const sql = `
      SELECT
        au.author_id                          AS author_id,
        au.name                               AS name,
        COUNT(DISTINCT a.article_id)          AS articleCount,
        SUM(a.citation_count)                 AS totalCitations,
        AVG(a.citation_count)                 AS avgCitations,
        COUNT(DISTINCT a.journal_id)          AS journalCount,
        COUNT(DISTINCT asub.subject_id)       AS subjectCount
      FROM Authors au
      JOIN ArticlesAuthors aa ON au.author_id = aa.author_id
      JOIN Articles a ON aa.article_id = a.article_id
      LEFT JOIN ArticlesSubjects asub ON a.article_id = asub.article_id
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
    limit: number = 20
) {
    const where = yearFilter(fromYear);

    const sql = `
      SELECT
        au.author_id                    AS author_id,
        au.name                         AS name,
        COUNT(DISTINCT a.article_id)    AS articleCount,
        COUNT(DISTINCT asub.subject_id) AS subjectCount
      FROM Authors au
      JOIN ArticlesAuthors aa ON au.author_id = aa.author_id
      JOIN Articles a ON aa.article_id = a.article_id
      JOIN ArticlesSubjects asub ON a.article_id = asub.article_id
      ${where}
      GROUP BY au.author_id
      HAVING subjectCount >= ?
      ORDER BY subjectCount DESC, articleCount DESC
      LIMIT ${limit}
    `.trim();

    const params: any[] = [];
    if (fromYear) params.push(fromYear);
    params.push(minSubjects);

    return { sql, params };
}
