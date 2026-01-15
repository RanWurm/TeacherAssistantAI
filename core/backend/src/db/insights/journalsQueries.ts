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
      COUNT(DISTINCT asj.subject_id) AS subjectCount,

      SUM(a.citation_count) AS totalCitations,

      ROUND(
        (
          SUM(a.citation_count) / COUNT(DISTINCT a.article_id)
        )
        * LOG(1 + COUNT(DISTINCT a.article_id)),
        2
      ) AS impactScore

    FROM Journals j
    JOIN Articles a
      ON a.journal_id = j.journal_id
    LEFT JOIN ArticlesAuthors aa
      ON a.article_id = aa.article_id
    LEFT JOIN ArticlesSubjects asj
      ON a.article_id = asj.article_id

    ${where}

    GROUP BY j.journal_id

    HAVING
      articleCount >= 10

    ORDER BY
      impactScore DESC,
      totalCitations DESC

    LIMIT ${limit}
  `.trim();

  return {
    sql,
    params: fromYear ? [fromYear] : [],
  };
}


/**
 * Calculates the citation concentration metric, defined as the percentage of a journal's citations 
 * that come from its top 10% most cited articles. 
 * Also returns each journal's impact score and article count.
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
        (
          SUM( a.citation_count )
          /
          COUNT( DISTINCT a.article_id )
        ) * LN(1 + COUNT(DISTINCT a.article_id)),
        2
      ) AS impactScore

    FROM Journals j
    JOIN Articles a
      ON a.journal_id = j.journal_id
    LEFT JOIN ArticlesSubjects asj
      ON a.article_id = asj.article_id

    ${where}

    GROUP BY j.journal_id
    HAVING articleCount >= 1

    ORDER BY journalName ASC
    LIMIT 1000
  `.trim();

  return {
    sql,
    params: fromYear ? [fromYear] : [],
  };
}
