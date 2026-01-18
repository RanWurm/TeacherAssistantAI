function yearFilter(fromYear?: number) {
  return fromYear ? "WHERE a.year >= ?" : "";
}

/**
 * Top sources by impact score
 */
export function buildTopSourcesQuery(
  fromYear?: number,
  limit: number = 5
) {
  const where = yearFilter(fromYear);
  const safeLimit = Math.max(1, Math.min(50, Math.floor(limit)));

  const sql = `
    WITH source_articles AS (
      SELECT
        a.source_id,
        COUNT(*) AS articleCount,
        SUM(a.citation_count) AS totalCitations
      FROM Articles a
      ${where}
      GROUP BY a.source_id
      HAVING articleCount >= 10
    ),
    source_authors AS (
      SELECT
        a.source_id,
        COUNT(DISTINCT aa.author_id) AS authorCount
      FROM Articles a
      JOIN ArticlesAuthors aa ON aa.article_id = a.article_id
      ${where}
      GROUP BY a.source_id
    ),
    source_subjects AS (
      SELECT
        a.source_id,
        COUNT(DISTINCT asj.subject_id) AS subjectCount
      FROM Articles a
      JOIN ArticlesSubjects asj ON asj.article_id = a.article_id
      ${where}
      GROUP BY a.source_id
    )
    SELECT
      s.source_id  AS source_id,
      s.name       AS name,
      s.type       AS type,
      s.publisher  AS publisher,

      sa.articleCount,
      COALESCE(au.authorCount, 0)  AS authorCount,
      COALESCE(su.subjectCount, 0) AS subjectCount,
      sa.totalCitations,
      s.impact_factor AS impactFactor,

      ROUND(
        (sa.totalCitations / sa.articleCount)
        * LN(1 + sa.articleCount),
        2
      ) AS impactScore

    FROM source_articles sa
    JOIN Sources s ON s.source_id = sa.source_id
    LEFT JOIN source_authors au  ON au.source_id = sa.source_id
    LEFT JOIN source_subjects su ON su.source_id = sa.source_id

    ORDER BY impactScore DESC, sa.totalCitations DESC
    LIMIT ${safeLimit}
  `.trim();

  const params = fromYear ? [fromYear, fromYear, fromYear] : [];

  return { sql, params };
}

/**
 * Calculates the citation concentration metric, defined as the percentage of a source's citations 
 * that come from its top 10% most cited articles. 
 * Also returns each source's impact score and article count.
 */
export function buildSubjectImpactQuery(fromYear?: number) {
  const where = yearFilter(fromYear);

  const sql = `
    WITH source_articles AS (
      SELECT
        a.source_id,
        COUNT(*) AS articleCount,
        SUM(a.citation_count) AS totalCitations
      FROM Articles a
      ${where}
      GROUP BY a.source_id
      HAVING articleCount >= 1
    ),
    source_subjects AS (
      SELECT
        a.source_id,
        COUNT(DISTINCT asj.subject_id) AS subjectCount
      FROM Articles a
      JOIN ArticlesSubjects asj ON asj.article_id = a.article_id
      ${where}
      GROUP BY a.source_id
    )
    SELECT
      s.source_id,
      s.name AS sourceName,
      s.type AS sourceType,

      COALESCE(ss.subjectCount, 0) AS subjectCount,
      s.impact_factor AS impactFactor,
      sa.articleCount,

      ROUND(
        (sa.totalCitations / sa.articleCount)
        * LN(1 + sa.articleCount),
        2
      ) AS impactScore

    FROM source_articles sa
    JOIN Sources s ON s.source_id = sa.source_id
    LEFT JOIN source_subjects ss ON ss.source_id = sa.source_id

    ORDER BY sourceName ASC
    LIMIT 1000
  `.trim();

  const params = fromYear ? [fromYear, fromYear] : [];

  return { sql, params };
}