function yearFilter(fromYear?: number) {
  return fromYear ? "WHERE a.year >= ?" : "";
}

/**
 * Overview metrics (efficient, decomposed aggregates)
 */
export function buildOverviewMetricsQuery(fromYear?: number) {
  const whereArticles = fromYear ? "WHERE year >= ?" : "";
  const whereJoin = fromYear ? "WHERE a.year >= ?" : "";

  const params: number[] = [];
  if (fromYear) {
    // Articles / Sources / Citations
    params.push(fromYear, fromYear, fromYear);
    // Authors / Subjects / Keywords
    params.push(fromYear, fromYear, fromYear);
  }

  const sql = `
    SELECT
      art.articles,
      au.authors,
      s.sources,
      sub.subjects,
      k.keywords,
      c.avgCitations
    FROM
      (SELECT COUNT(DISTINCT article_id) AS articles
       FROM Articles
       ${whereArticles}) art,

      (SELECT COUNT(DISTINCT aa.author_id) AS authors
       FROM ArticlesAuthors aa
       JOIN Articles a ON a.article_id = aa.article_id
       ${whereJoin}) au,

      (SELECT COUNT(DISTINCT source_id) AS sources
       FROM Articles
       ${whereArticles}) s,

      (SELECT COUNT(DISTINCT asub.subject_id) AS subjects
       FROM ArticlesSubjects asub
       JOIN Articles a ON a.article_id = asub.article_id
       ${whereJoin}) sub,

      (SELECT COUNT(DISTINCT ak.keyword_id) AS keywords
       FROM ArticlesKeywords ak
       JOIN Articles a ON a.article_id = ak.article_id
       ${whereJoin}) k,

      (SELECT AVG(citation_count) AS avgCitations
       FROM Articles
       ${whereArticles}) c
  `.trim();

  return { sql, params };
}

/**
 * Publications timeline
 */
export function buildPublicationsTimelineQuery(fromYear?: number) {
  const where = yearFilter(fromYear);

  const sql = `
    SELECT
      a.year                                 AS year,
      COUNT(DISTINCT a.article_id)           AS articleCount,
      COUNT(DISTINCT aa.author_id)           AS authorCount,
      COUNT(DISTINCT a.source_id)            AS sourceCount
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

/**
 * Multidisciplinary vs single-subject summary
 */
export function buildMultidisciplinarySummaryQuery(fromYear?: number) {
  const where = yearFilter(fromYear);

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
