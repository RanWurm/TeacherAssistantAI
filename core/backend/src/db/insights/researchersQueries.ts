function yearFilter(fromYear?: number) {
  return fromYear ? "WHERE a.year >= ?" : "";
}

/* ============================
   TOP RESEARCHERS – STEP 1
   ============================ */
export function buildTopResearchersCandidatesQuery(
  fromYear?: number,
  limit: number = 5
) {
  const where = yearFilter(fromYear);

  const sql = `
    SELECT
      aa.author_id,
      SUM(a.citation_count) AS totalCitations
    FROM Articles a
    JOIN ArticlesAuthors aa
      ON a.article_id = aa.article_id
    ${where}
    GROUP BY aa.author_id
    ORDER BY totalCitations DESC
    LIMIT ${limit}
  `.trim();

  return {
    sql,
    params: fromYear ? [fromYear] : [],
  };
}

/* ============================
   TOP RESEARCHERS – STEP 2
   ============================ */
   export function buildTopResearchersDetailsQuery(
    authorIds: number[],
    fromYear?: number
  ) {
    if (!authorIds.length) {
      return { sql: "", params: [] as any[] };
    }
  
    const inClause = authorIds.map(() => "?").join(",");
  
    const sql = `
      SELECT
        au.author_id                             AS author_id,
        au.name                                  AS name,
        
        COUNT(DISTINCT a.article_id)              AS articleCount,
        SUM(a.citation_count)                     AS totalCitations,
        ROUND(AVG(a.citation_count), 2)           AS avgCitationsPerArticle,

        COUNT(DISTINCT asub.subject_id)           AS uniqueSubjects,
        COUNT(DISTINCT a.source_id)               AS uniqueSources,

        GROUP_CONCAT(DISTINCT inst.name ORDER BY inst.name SEPARATOR '||') AS institutions

      FROM Authors au
      JOIN ArticlesAuthors aa
        ON aa.author_id = au.author_id
      JOIN Articles a
        ON a.article_id = aa.article_id
      LEFT JOIN ArticlesSubjects asub
        ON asub.article_id = a.article_id
      LEFT JOIN Sources s
        ON a.source_id = s.source_id
      LEFT JOIN ArticleAuthorInstitutions aai
        ON aai.author_id = au.author_id AND aai.article_id = a.article_id
      LEFT JOIN Institutions inst
        ON aai.institution_id = inst.institution_id

      WHERE au.author_id IN (${inClause})
      ${fromYear ? `AND a.year >= ?` : ""}

      GROUP BY au.author_id, au.name
      ORDER BY totalCitations DESC
    `.trim();
  
    return {
      sql,
      params: fromYear ? [...authorIds, fromYear] : authorIds,
    };
  }
  
  

/* ============================
   MULTIDISCIPLINARY – STEP 1
   ============================ */
export function buildMultidisciplinaryResearchersCandidatesQuery(
  fromYear?: number,
  minSubjects: number = 3,
  limit: number = 5
) {
  const where = yearFilter(fromYear);

  const sql = `
    SELECT
      t.author_id,
      t.subjectCount,
      t.totalCitations
    FROM (
      SELECT
        aa.author_id,
        COUNT(DISTINCT asub.subject_id) AS subjectCount,
        SUM(a.citation_count)           AS totalCitations
      FROM ArticlesAuthors aa
      JOIN Articles a ON a.article_id = aa.article_id
      JOIN ArticlesSubjects asub ON asub.article_id = a.article_id
      ${where}
      GROUP BY aa.author_id
      ORDER BY totalCitations DESC
      LIMIT 2000
    ) t
    WHERE t.subjectCount >= ?
    ORDER BY t.subjectCount DESC, t.totalCitations DESC
    LIMIT ${limit}
  `.trim();

  const params: any[] = [];
  if (fromYear) params.push(fromYear);
  params.push(minSubjects);

  return { sql, params };
}

/* ============================
   MULTIDISCIPLINARY – STEP 2
   ============================ */
export function buildMultidisciplinaryResearchersDetailsQuery(
  authorIds: number[],
  fromYear?: number
) {
  if (!authorIds.length) {
    return { sql: "", params: [] as any[] };
  }

  const where = yearFilter(fromYear);
  const whereOrAnd = where ? "AND" : "WHERE";
  const inClause = authorIds.map(() => "?").join(",");

  const sql = `
    SELECT
      au.author_id                                AS author_id,
      au.name                                     AS name,
      COUNT(DISTINCT a.article_id)                AS articleCount,
      COUNT(DISTINCT asub.subject_id)             AS subjectCount,
      SUM(a.citation_count)                       AS totalCitations,
      ROUND(AVG(a.citation_count), 2)             AS avgCitationsPerArticle,
      GROUP_CONCAT(
        DISTINCT s.subject_name
        ORDER BY s.subject_name
        SEPARATOR '||'
      ) AS subjects,
      GROUP_CONCAT(
        DISTINCT i.name
        ORDER BY i.name
        SEPARATOR '||'
      ) AS institutions
    FROM Authors au
    JOIN ArticlesAuthors aa ON au.author_id = aa.author_id
    JOIN Articles a ON aa.article_id = a.article_id
    JOIN ArticlesSubjects asub ON a.article_id = asub.article_id
    JOIN Subjects s ON asub.subject_id = s.subject_id
    LEFT JOIN ArticleAuthorInstitutions aai ON aai.article_id = aa.article_id AND aai.author_id = aa.author_id
    LEFT JOIN Institutions i ON aai.institution_id = i.institution_id
    ${where}
    ${whereOrAnd} au.author_id IN (${inClause})
    GROUP BY au.author_id
    ORDER BY subjectCount DESC, totalCitations DESC
  `.trim();

  return {
    sql,
    params: fromYear ? [fromYear, ...authorIds] : authorIds,
  };
}
