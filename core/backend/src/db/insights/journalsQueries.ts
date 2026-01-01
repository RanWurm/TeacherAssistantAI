function yearFilter(fromYear?: number) {
    return fromYear ? "WHERE a.year >= ?" : "";
}

/**
 * Top journals by citations
 */
export function buildTopJournalsQuery(
    fromYear?: number,
    limit: number = 20
) {
    const where = yearFilter(fromYear);

    const sql = `
      SELECT
        j.journal_id                    AS journal_id,
        j.name                          AS name,
        COUNT(DISTINCT a.article_id)    AS articleCount,
        SUM(a.citation_count)           AS totalCitations,
        AVG(a.citation_count)           AS avgCitations
      FROM Journals j
      JOIN Articles a ON j.journal_id = a.journal_id
      ${where}
      GROUP BY j.journal_id
      ORDER BY totalCitations DESC
      LIMIT ${limit}
    `.trim();

    return {
        sql,
        params: fromYear ? [fromYear] : [],
    };
}

/**
 * Citation volatility over time (avg citations per year per journal)
 */
export function buildCitationVolatilityQuery(
    fromYear?: number
) {
    const where = yearFilter(fromYear);

    const sql = `
      SELECT
        j.journal_id          AS journal_id,
        a.year                AS year,
        AVG(a.citation_count) AS avgCitations
      FROM Journals j
      JOIN Articles a ON j.journal_id = a.journal_id
      ${where}
      GROUP BY j.journal_id, a.year
      ORDER BY j.journal_id, a.year
    `.trim();

    return {
        sql,
        params: fromYear ? [fromYear] : [],
    };
}
