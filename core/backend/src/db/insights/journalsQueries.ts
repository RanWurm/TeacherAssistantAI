function yearFilter(fromYear?: number) {
  return fromYear ? "WHERE a.year >= ?" : "";
}

/**
 * Top journals by citations
 */
export function buildTopJournalsQuery(
  fromYear?: number,
  limit: number = 5
) {
  const where = yearFilter(fromYear);

  const sql = `
    SELECT
      j.journal_id AS journal_id,
      j.name       AS name,
      j.publisher  AS publisher,

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

    FROM Journals j
    JOIN Articles a
      ON a.journal_id = j.journal_id
    LEFT JOIN ArticlesAuthors aa
      ON a.article_id = aa.article_id
    LEFT JOIN ArticlesSubjects asj
      ON a.article_id = asj.article_id
    LEFT JOIN Subjects s
      ON asj.subject_id = s.subject_id

    ${where}

    GROUP BY j.journal_id
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
/**
 * Calculates the citation concentration metric, defined as the percentage of a journal's citations 
 * that come from its top 10% most cited articles. 
 * Also returns each journal's impact factor and article count.
 */
export function buildSubjectImpactQuery(fromYear?: number) {
  const where = yearFilter(fromYear);

  const sql = `
    SELECT
      j.journal_id,
      j.name AS journalName,

      COUNT(DISTINCT asj.subject_id) AS subjectCount,
      COUNT(DISTINCT a.article_id) AS articleCount,

      ROUND(
        AVG(a.citation_count),
        2
      ) AS impactFactor

    FROM Journals j
    JOIN Articles a
      ON a.journal_id = j.journal_id
    LEFT JOIN ArticlesSubjects asj
      ON a.article_id = asj.article_id

    ${where}

    GROUP BY j.journal_id

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