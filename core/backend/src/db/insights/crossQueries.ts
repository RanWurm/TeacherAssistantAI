function yearFilter(fromYear?: number) {
  return fromYear ? "WHERE a.year >= ?" : "";
}

/**
 * Subject × Source heatmap (efficient)
 */
/**
 * Subject × Source heatmap (MySQL-compatible: avoids LIMIT in IN subqueries)
 * 
 * Approach: 
 *   1. Preselect top N subjects and sources in CTEs/top-subqueries using JOINs instead of IN (...LIMIT...).
 *   2. Join only on those top N for the heatmap, thus avoiding MySQL "LIMIT & IN" subquery limitation.
 */
export function buildSubjectSourceHeatmapQuery(fromYear?: number) {
  const SUBJECT_LIMIT = 5;
  const SOURCE_LIMIT = 4;

  const topSubjectWhere = fromYear ? "WHERE a2.year >= ?" : "";
  const topSourceWhere = fromYear ? "WHERE a3.year >= ?" : "";

  const sql = `
    SELECT
      sub.subject_name AS subject,
      s.name           AS source,
      COUNT(DISTINCT a.article_id) AS articleCount
    FROM Articles a
    JOIN ArticlesSubjects asub ON asub.article_id = a.article_id
    JOIN Subjects sub          ON sub.subject_id = asub.subject_id
    JOIN Sources s             ON s.source_id = a.source_id

    -- Join to limited subjects
    INNER JOIN (
      SELECT asub2.subject_id
      FROM ArticlesSubjects asub2
      JOIN Articles a2 ON a2.article_id = asub2.article_id
      ${topSubjectWhere}
      GROUP BY asub2.subject_id
      ORDER BY COUNT(*) DESC
      LIMIT ${SUBJECT_LIMIT}
    ) topSubjects ON topSubjects.subject_id = sub.subject_id

    -- Join to limited sources
    INNER JOIN (
      SELECT a3.source_id
      FROM Articles a3
      ${topSourceWhere}
      GROUP BY a3.source_id
      ORDER BY COUNT(*) DESC
      LIMIT ${SOURCE_LIMIT}
    ) topSources ON topSources.source_id = s.source_id

    ${fromYear ? "WHERE a.year >= ?" : ""}
    GROUP BY sub.subject_id, s.source_id
    ORDER BY subject, source
  `.trim();

  const params: number[] = [];
  if (fromYear) {
    params.push(fromYear); // for topSubjectWhere
    params.push(fromYear); // for topSourceWhere
    params.push(fromYear); // for outer WHERE
  }

  return {
    sql,
    params,
  };
}

/**
 * Language impact
 */
export function buildLanguageImpactQuery(fromYear?: number) {
  const where = yearFilter(fromYear);

  const sql = `
    SELECT
      a.language            AS language,
      COUNT(*)              AS articleCount,
      AVG(a.citation_count) AS avgCitations
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
 * Multidisciplinary vs Single-subject comparison (efficient)
 */
export function buildMultidisciplinaryVsSingleQuery(fromYear?: number) {
  const where = yearFilter(fromYear);

  const sql = `
    SELECT
      t.type,
      COUNT(DISTINCT t.article_id)      AS articles,
      AVG(t.citation_count)             AS avgCitations,
      SUM(t.citation_count)             AS totalCitations,
      COUNT(DISTINCT aa.author_id)      AS authors,
      COUNT(DISTINCT t.source_id)       AS sources
    FROM (
      SELECT
        a.article_id,
        a.citation_count,
        a.source_id,
        CASE
          WHEN MIN(asub.subject_id) <> MAX(asub.subject_id) THEN 'multi'
          ELSE 'single'
        END AS type
      FROM Articles a
      JOIN ArticlesSubjects asub
        ON asub.article_id = a.article_id
      ${where}
      GROUP BY
        a.article_id,
        a.citation_count,
        a.source_id
    ) t
    LEFT JOIN ArticlesAuthors aa
      ON aa.article_id = t.article_id
    GROUP BY t.type
    ORDER BY t.type
  `.trim();

  return {
    sql,
    params: fromYear ? [fromYear] : [],
  };
}

