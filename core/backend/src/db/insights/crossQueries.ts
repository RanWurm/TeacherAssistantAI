function yearFilter(fromYear?: number) {
  return fromYear ? "WHERE a.year >= ?" : "";
}

/**
 * Subject × Source heatmap
 */
export function buildSubjectSourceHeatmapQuery(fromYear?: number) {
  const where = yearFilter(fromYear);

  const sql = `
    WITH
    top_sources AS (
      SELECT
        s.source_id,
        s.name AS source
      FROM Articles a
      JOIN Sources s ON a.source_id = s.source_id
      JOIN ArticlesSubjects asub ON a.article_id = asub.article_id
      ${where}
      GROUP BY s.source_id
      ORDER BY COUNT(DISTINCT asub.subject_id) DESC
      LIMIT 4
    ),
    top_subjects AS (
      SELECT
        sub.subject_id,
        sub.subject_name AS subject
      FROM Articles a
      JOIN ArticlesSubjects asub ON a.article_id = asub.article_id
      JOIN Subjects sub ON asub.subject_id = sub.subject_id
      ${where}
      GROUP BY sub.subject_id
      ORDER BY COUNT(DISTINCT a.source_id) DESC
      LIMIT 5
    )
    SELECT
      ts.subject,
      tso.source,
      COUNT(DISTINCT a.article_id) AS articleCount
    FROM Articles a
    JOIN ArticlesSubjects asub ON a.article_id = asub.article_id
    JOIN top_subjects ts ON asub.subject_id = ts.subject_id
    JOIN top_sources tso ON a.source_id = tso.source_id
    GROUP BY ts.subject, tso.source
    ORDER BY ts.subject, tso.source
  `.trim();

  return {
    sql,
    params: fromYear ? [fromYear, fromYear] : [],
  };
}

/**
 * Language impact
 */
export function buildLanguageImpactQuery(fromYear?: number) {
  const where = yearFilter(fromYear);

  const sql = `
    SELECT
      a.language                  AS language,
      COUNT(DISTINCT a.article_id) AS articleCount,
      AVG(a.citation_count)       AS avgCitations
    FROM Articles a
    ${where}
    GROUP BY a.language
    ORDER BY articleCount DESC
  `.trim();

  return {
    sql,
    params: fromYear ? [fromYear] : [],
  };
}

/**
 * Multidisciplinary vs Single-subject comparison
 */
export function buildMultidisciplinaryVsSingleQuery(fromYear?: number) {
  const where = yearFilter(fromYear);

  const sql = `
    WITH base_articles AS (
      SELECT
        a.article_id,
        a.citation_count,
        a.source_id
      FROM Articles a
      ${where}
    ),
    subject_counts AS (
      SELECT
        asub.article_id,
        COUNT(*) AS subject_cnt
      FROM ArticlesSubjects asub
      JOIN base_articles ba ON ba.article_id = asub.article_id
      GROUP BY asub.article_id
    ),
    article_types AS (
      SELECT
        ba.article_id,
        ba.citation_count,
        ba.source_id,
        CASE
          WHEN sc.subject_cnt > 1 THEN 'multi'
          ELSE 'single'
        END AS type
      FROM base_articles ba
      JOIN subject_counts sc ON sc.article_id = ba.article_id
    )
    SELECT
      at.type,
      COUNT(DISTINCT at.article_id)        AS articles,
      AVG(at.citation_count)               AS avgCitations,
      SUM(at.citation_count)               AS totalCitations,
      COUNT(DISTINCT aa.author_id)         AS authors,
      COUNT(DISTINCT at.source_id)         AS sources
    FROM article_types at
    LEFT JOIN ArticlesAuthors aa ON aa.article_id = at.article_id
    GROUP BY at.type
    ORDER BY at.type
  `.trim();

  return {
    sql,
    params: fromYear ? [fromYear] : [],
  };
}