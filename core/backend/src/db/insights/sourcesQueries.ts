function yearFilter(fromYear?: number) {
  return fromYear ? "WHERE a.year >= ?" : "";
}

/**
 * Top sources by citations
 */
export function buildTopSourcesQuery(
  fromYear?: number,
  limit: number = 5
) {
  const where = yearFilter(fromYear);

  const sql = `
    SELECT
      s.source_id  AS source_id,
      s.name       AS name,
      s.type       AS type,
      s.publisher  AS publisher,

      COUNT(DISTINCT a.article_id) AS articleCount,
      COUNT(DISTINCT aa.author_id) AS authorCount,
      COUNT(DISTINCT asj.subject_id)  AS subjectCount,

      SUM(a.citation_count) AS totalCitations,

      ROUND(
        AVG(
          CASE
            WHEN a.year >= YEAR(CURDATE()) - 2
            THEN a.citation_count
          END
        ),
        2
      ) AS impactFactor

    FROM Sources s
    JOIN Articles a
      ON a.source_id = s.source_id
    LEFT JOIN ArticlesAuthors aa
      ON a.article_id = aa.article_id
    LEFT JOIN ArticlesSubjects asj
      ON a.article_id = asj.article_id
    LEFT JOIN Subjects sub
      ON asj.subject_id = sub.subject_id

    ${where}

    GROUP BY s.source_id
    ORDER BY
      impactFactor DESC,
      totalCitations DESC

    LIMIT ${limit}
  `.trim();

  return {
    sql,
    params: fromYear ? [fromYear] : [],
  };
}

/**
 * Calculates the citation concentration metric, defined as the percentage of a source's citations 
 * that come from its top 10% most cited articles. 
 * Also returns each source's impact factor and article count.
 */
export function buildSubjectImpactQuery(fromYear?: number) {
  const where = yearFilter(fromYear);

  const sql = `
    SELECT
      s.source_id,
      s.name AS sourceName,
      s.type AS sourceType,

      COUNT(DISTINCT asj.subject_id) AS subjectCount,
      COUNT(DISTINCT a.article_id) AS articleCount,

      ROUND(
        AVG(a.citation_count),
        2
      ) AS impactFactor

    FROM Sources s
    JOIN Articles a
      ON a.source_id = s.source_id
    LEFT JOIN ArticlesSubjects asj
      ON a.article_id = asj.article_id

    ${where}

    GROUP BY s.source_id

    HAVING
      impactFactor IS NOT NULL
      AND articleCount >= 0

    ORDER BY impactFactor DESC
    LIMIT 500
  `.trim();

  return {
    sql,
    params: fromYear ? [fromYear] : [],
  };
}