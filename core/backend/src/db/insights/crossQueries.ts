function yearFilter(fromYear?: number) {
    return fromYear ? "WHERE a.year >= ?" : "";
}

/**
 * Subject × Journal heatmap
 */
export function buildSubjectJournalHeatmapQuery(
    fromYear?: number
) {
    const where = yearFilter(fromYear);

    const sql = `
    WITH base_articles AS (
      SELECT
        a.article_id,
        a.journal_id
      FROM Articles a
      ${where}
    ),
    top_journals AS (
      SELECT
        j.journal_id,
        j.name AS journal
      FROM base_articles ba
      JOIN Journals j ON j.journal_id = ba.journal_id
      JOIN ArticlesSubjects asub ON asub.article_id = ba.article_id
      GROUP BY j.journal_id
      ORDER BY COUNT(DISTINCT asub.subject_id) DESC
      LIMIT 4
    ),
    top_subjects AS (
      SELECT
        s.subject_id,
        s.subject_name AS subject
      FROM base_articles ba
      JOIN ArticlesSubjects asub ON asub.article_id = ba.article_id
      JOIN Subjects s ON s.subject_id = asub.subject_id
      GROUP BY s.subject_id
      ORDER BY COUNT(DISTINCT ba.journal_id) DESC
      LIMIT 5
    )
    SELECT
      ts.subject,
      tj.journal,
      COUNT(DISTINCT ba.article_id) AS articleCount
    FROM base_articles ba
    JOIN ArticlesSubjects asub ON asub.article_id = ba.article_id
    JOIN top_subjects ts ON ts.subject_id = asub.subject_id
    JOIN top_journals tj ON tj.journal_id = ba.journal_id
    GROUP BY ts.subject, tj.journal
    ORDER BY ts.subject, tj.journal
  `.trim();
  
    return {
      sql,
      params: fromYear ? [fromYear] : [],
    };
}

/**
 * Language impact
 */
export function buildLanguageImpactQuery(
    fromYear?: number
) {
    const where = yearFilter(fromYear);

    const sql = `
    SELECT
      a.language                  AS language,
      COUNT(*)                    AS articleCount,
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
export function buildMultidisciplinaryVsSingleQuery(
  fromYear?: number
) {
  const where = fromYear ? "WHERE year >= ?" : "";

  const sql = `
    WITH base_articles AS (
      SELECT
        a.article_id,
        a.citation_count,
        a.journal_id
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
        ba.journal_id,
        CASE
          WHEN sc.subject_cnt > 1 THEN 'multi'
          ELSE 'single'
        END AS type
      FROM base_articles ba
      JOIN subject_counts sc ON sc.article_id = ba.article_id
    )
    SELECT
      at.type,
      COUNT(*)                        AS articles,
      AVG(at.citation_count)          AS avgCitations,
      SUM(at.citation_count)          AS totalCitations,
      COUNT(DISTINCT aa.author_id)    AS authors,
      COUNT(DISTINCT at.journal_id)   AS journals
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
