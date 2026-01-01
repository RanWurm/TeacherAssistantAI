function yearFilter(fromYear?: number) {
    return fromYear ? "WHERE a.year >= ?" : "";
}


export function buildOverviewMetricsQuery(fromYear?: number) {
    const where = yearFilter(fromYear);

    const sql = `
      SELECT
        COUNT(DISTINCT a.article_id)                AS articles,
        COUNT(DISTINCT aa.author_id)               AS authors,
        COUNT(DISTINCT a.journal_id)               AS journals,
        COUNT(DISTINCT asub.subject_id)            AS subjects,
        COUNT(DISTINCT ak.keyword_id)              AS keywords,
        AVG(a.citation_count)                      AS avgCitations
      FROM Articles a
      LEFT JOIN ArticlesAuthors aa   ON a.article_id = aa.article_id
      LEFT JOIN ArticlesSubjects asub ON a.article_id = asub.article_id
      LEFT JOIN ArticlesKeywords ak   ON a.article_id = ak.article_id
      ${where}
    `.trim();

    return {
        sql,
        params: fromYear ? [fromYear] : [],
    };
}


export function buildPublicationsTimelineQuery(fromYear?: number) {
    const where = yearFilter(fromYear);

    const sql = `
      SELECT
        a.year                                 AS year,
        COUNT(DISTINCT a.article_id)           AS articleCount,
        COUNT(DISTINCT aa.author_id)           AS authorCount,
        COUNT(DISTINCT a.journal_id)           AS journalCount
      FROM Articles a
      LEFT JOIN ArticlesAuthors aa ON a.article_id = aa.article_id
      ${where}
      GROUP BY a.year
      ORDER BY a.year ASC
    `.trim();

    return {
        sql,
        params: fromYear ? [fromYear] : [],
    };
}


export function buildMultidisciplinarySummaryQuery(fromYear?: number) {
    const where = fromYear ? "WHERE a.year >= ?" : "";

    const sql = `
      SELECT
        SUM(subjectCount = 1)        AS singleSubjectArticles,
        SUM(subjectCount > 1)        AS multiSubjectArticles,
        AVG(subjectCount)            AS avgSubjectsPerArticle
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

export function buildMostCommonSubjectCombinationQuery(fromYear?: number) {
  const where = fromYear ? "WHERE a.year >= ?" : "";

  const sql = `
    SELECT
      GROUP_CONCAT(s.subject_name ORDER BY s.subject_name) AS subjects,
      COUNT(*) AS articleCount
    FROM Articles a
    JOIN ArticlesSubjects asub ON a.article_id = asub.article_id
    JOIN Subjects s ON asub.subject_id = s.subject_id
    ${where}
    GROUP BY a.article_id
    HAVING COUNT(DISTINCT asub.subject_id) > 1
    ORDER BY articleCount DESC
    LIMIT 1
  `.trim();

  return {
    sql,
    params: fromYear ? [fromYear] : [],
  };
}
