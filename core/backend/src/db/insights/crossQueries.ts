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
    WITH
    top_journals AS (
      SELECT
        j.journal_id,
        j.name AS journal
      FROM Articles a
      JOIN Journals j ON a.journal_id = j.journal_id
      JOIN ArticlesSubjects asub ON a.article_id = asub.article_id
      ${where}
      GROUP BY j.journal_id
      ORDER BY COUNT(DISTINCT asub.subject_id) DESC
      LIMIT 4
    ),
    top_subjects AS (
      SELECT
        s.subject_id,
        s.subject_name AS subject
      FROM Articles a
      JOIN ArticlesSubjects asub ON a.article_id = asub.article_id
      JOIN Subjects s ON asub.subject_id = s.subject_id
      ${where}
      GROUP BY s.subject_id
      ORDER BY COUNT(DISTINCT a.journal_id) DESC
      LIMIT 5
    )
    SELECT
      ts.subject,
      tj.journal,
      COUNT(DISTINCT a.article_id) AS articleCount
    FROM Articles a
    JOIN ArticlesSubjects asub ON a.article_id = asub.article_id
    JOIN top_subjects ts ON asub.subject_id = ts.subject_id
    JOIN top_journals tj ON a.journal_id = tj.journal_id
    GROUP BY ts.subject, tj.journal
    ORDER BY ts.subject, tj.journal
  `.trim();
  
    return {
      sql,
      params: fromYear ? [fromYear, fromYear] : [],
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
export function buildMultidisciplinaryVsSingleQuery(
  fromYear?: number
) {
  const where = yearFilter(fromYear);

  const sql = `
    WITH subject_counts AS (
      SELECT
        asub.article_id,
        COUNT(*) AS subject_cnt
      FROM ArticlesSubjects asub
      GROUP BY asub.article_id
    ),
    article_types AS (
      SELECT
        a.article_id,
        a.citation_count,
        a.journal_id,
        CASE
          WHEN sc.subject_cnt > 1 THEN 'multi'
          ELSE 'single'
        END AS type
      FROM Articles a
      JOIN subject_counts sc
        ON a.article_id = sc.article_id
      ${where}
    )
    SELECT
      at.type,
      COUNT(DISTINCT at.article_id)        AS articles,
      AVG(at.citation_count)               AS avgCitations,
      SUM(at.citation_count)               AS totalCitations,
      COUNT(DISTINCT aa.author_id)         AS authors,
      COUNT(DISTINCT at.journal_id)        AS journals
    FROM article_types at
    LEFT JOIN ArticlesAuthors aa
      ON at.article_id = aa.article_id
    GROUP BY at.type
    ORDER BY at.type
  `.trim();

  return {
    sql,
    params: fromYear ? [fromYear] : [],
  };
}
