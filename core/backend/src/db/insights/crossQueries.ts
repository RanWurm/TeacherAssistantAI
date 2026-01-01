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
      SELECT
        s.subject_name              AS subject,
        j.name                      AS journal,
        COUNT(DISTINCT a.article_id) AS articleCount
      FROM Articles a
      JOIN Journals j ON a.journal_id = j.journal_id
      JOIN ArticlesSubjects asub ON a.article_id = asub.article_id
      JOIN Subjects s ON asub.subject_id = s.subject_id
      ${where}
      GROUP BY s.subject_id, j.journal_id
      ORDER BY articleCount DESC
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
    const where = fromYear ? "WHERE a.year >= ?" : "";

    const sql = `
      SELECT
        SUM(subjectCount = 1) AS single,
        SUM(subjectCount > 1) AS multi
      FROM (
        SELECT
          a.article_id,
          COUNT(asub.subject_id) AS subjectCount
        FROM Articles a
        LEFT JOIN ArticlesSubjects asub
          ON a.article_id = asub.article_id
        ${where}
        GROUP BY a.article_id
      ) t
    `.trim();

    return {
        sql,
        params: fromYear ? [fromYear] : [],
    };
}
