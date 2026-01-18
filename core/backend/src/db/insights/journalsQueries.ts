function yearFilter(fromYear?: number) {
  return fromYear ? "WHERE a.year >= ?" : "";
}

/**
 * Top journals by impact score
 */
export function buildTopJournalsQuery(
  fromYear?: number,
  limit: number = 5
) {
  const where = yearFilter(fromYear);
  const safeLimit = Math.max(1, Math.min(50, Math.floor(limit)));

  const sql = `
    WITH journal_articles AS (
      SELECT
        a.journal_id,
        COUNT(*) AS articleCount,
        SUM(a.citation_count) AS totalCitations
      FROM Articles a
      ${where}
      GROUP BY a.journal_id
      HAVING articleCount >= 10
    ),
    journal_authors AS (
      SELECT
        a.journal_id,
        COUNT(DISTINCT aa.author_id) AS authorCount
      FROM Articles a
      JOIN ArticlesAuthors aa ON aa.article_id = a.article_id
      ${where}
      GROUP BY a.journal_id
    ),
    journal_subjects AS (
      SELECT
        a.journal_id,
        COUNT(DISTINCT asj.subject_id) AS subjectCount
      FROM Articles a
      JOIN ArticlesSubjects asj ON asj.article_id = a.article_id
      ${where}
      GROUP BY a.journal_id
    )
    SELECT
      j.journal_id,
      j.name,
      j.publisher,

      ja.articleCount,
      COALESCE(au.authorCount, 0)  AS authorCount,
      COALESCE(su.subjectCount, 0) AS subjectCount,
      ja.totalCitations,

      ROUND(
        (ja.totalCitations / ja.articleCount)
        * LN(1 + ja.articleCount),
        2
      ) AS impactScore

    FROM journal_articles ja
    JOIN Journals j ON j.journal_id = ja.journal_id
    LEFT JOIN journal_authors au  ON au.journal_id = ja.journal_id
    LEFT JOIN journal_subjects su ON su.journal_id = ja.journal_id

    ORDER BY impactScore DESC, ja.totalCitations DESC
    LIMIT ${safeLimit}
  `.trim();

  const params = fromYear ? [fromYear, fromYear, fromYear] : [];

  return { sql, params };
}



/**
 * Calculates the citation concentration metric, defined as the percentage of a journal's citations 
 * that come from its top 10% most cited articles. 
 * Also returns each journal's impact score and article count.
 */
export function buildSubjectImpactQuery(fromYear?: number) {
  const where = yearFilter(fromYear);

  const sql = `
    WITH journal_articles AS (
      SELECT
        a.journal_id,
        COUNT(*) AS articleCount,
        SUM(a.citation_count) AS totalCitations
      FROM Articles a
      ${where}
      GROUP BY a.journal_id
      HAVING articleCount >= 1
    ),
    journal_subjects AS (
      SELECT
        a.journal_id,
        COUNT(DISTINCT asj.subject_id) AS subjectCount
      FROM Articles a
      JOIN ArticlesSubjects asj ON asj.article_id = a.article_id
      ${where}
      GROUP BY a.journal_id
    )
    SELECT
      j.journal_id,
      j.name AS journalName,

      COALESCE(js.subjectCount, 0) AS subjectCount,
      ja.articleCount,

      ROUND(
        (ja.totalCitations / ja.articleCount)
        * LN(1 + ja.articleCount),
        2
      ) AS impactScore

    FROM journal_articles ja
    JOIN Journals j ON j.journal_id = ja.journal_id
    LEFT JOIN journal_subjects js ON js.journal_id = ja.journal_id

    ORDER BY journalName ASC
    LIMIT 1000
  `.trim();

  const params = fromYear ? [fromYear, fromYear] : [];

  return { sql, params };
}
