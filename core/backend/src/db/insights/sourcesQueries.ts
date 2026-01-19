function yearFilter(fromYear?: number) {
  return fromYear ? "WHERE a.year >= ?" : "";
}

/**
 * Top sources by impact score (OPTIMIZED)
 */
export function buildTopSourcesQuery(
  fromYear?: number,
  limit: number = 5
) {
  const safeLimit = Math.max(1, Math.min(50, Math.floor(limit)));
  const where = yearFilter(fromYear);

  const sql = `
    WITH top_sources AS (
      SELECT
        a.source_id,
        COUNT(*) AS articleCount,
        SUM(a.citation_count) AS totalCitations
      FROM Articles a
      ${where}
      GROUP BY a.source_id
      HAVING articleCount >= 10
      ORDER BY
        (SUM(a.citation_count) / COUNT(*)) * LN(1 + COUNT(*)) DESC
      LIMIT ${safeLimit}
    )
    SELECT
      s.source_id,
      s.name,
      s.type,
      s.publisher,

      ts.articleCount,
      ts.totalCitations,

      COUNT(DISTINCT aa.author_id)  AS authorCount,
      COUNT(DISTINCT asj.subject_id) AS subjectCount,

      ROUND(
        (ts.totalCitations / ts.articleCount)
        * LN(1 + ts.articleCount),
        2
      ) AS impactScore

    FROM top_sources ts
    JOIN Sources s ON s.source_id = ts.source_id
    LEFT JOIN Articles a ON a.source_id = ts.source_id
    LEFT JOIN ArticlesAuthors aa ON aa.article_id = a.article_id
    LEFT JOIN ArticlesSubjects asj ON asj.article_id = a.article_id

    GROUP BY s.source_id
    ORDER BY impactScore DESC, ts.totalCitations DESC
  `.trim();

  const params = fromYear ? [fromYear] : [];
  return { sql, params };
}

/**
 * Subject impact per source (LIST — OPTIMIZED)
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
    )
    SELECT
      s.source_id,
      s.name AS sourceName,
      s.type AS sourceType,

      sa.articleCount,
      COUNT(DISTINCT asj.subject_id) AS subjectCount,

      ROUND(
        (sa.totalCitations / sa.articleCount)
        * LN(1 + sa.articleCount),
        2
      ) AS impactScore

    FROM source_articles sa
    JOIN Sources s ON s.source_id = sa.source_id
    LEFT JOIN Articles a ON a.source_id = sa.source_id
    LEFT JOIN ArticlesSubjects asj ON asj.article_id = a.article_id

    GROUP BY s.source_id
    ORDER BY sourceName ASC
    LIMIT 1000
  `.trim();

  const params = fromYear ? [fromYear] : [];
  return { sql, params };
}
