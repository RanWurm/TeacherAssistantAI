# 📗 Software Documentation

## Part I – Data Collection & Processing

### 1. Data Source

The primary data source used in this project is [OpenAlex](https://openalex.org/), an open and publicly accessible academic metadata platform. OpenAlex provides structured information on scholarly articles, authors, institutions, journals (sources), subjects, and keywords, making it suitable for large-scale academic analysis.

The system relies exclusively on OpenAlex’s REST API for data acquisition. No third-party datasets were imported, and all metadata is derived directly from OpenAlex responses.

---

### 2. Data Ingestion Pipeline

The data ingestion process is implemented as a multi-stage pipeline, designed to be scalable, reproducible, and resilient to partial failures. The pipeline is implemented using custom scripts and is divided into two main phases: Extraction and Transformation & Loading.

#### 2.1 Extraction (Data Fetching)

Data extraction is carried out using dedicated Node.js scripts that directly interact with the OpenAlex API. To fetch articles, run:

```
node core/etl/fetch_openalex.cjs
```

This script automates the process of downloading and storing raw OpenAlex data for further transformation.

**Subject Resolution:**  
Academic subjects are first resolved using the OpenAlex Concepts API, ensuring consistent subject identifiers across all fetched data.

**Article Fetching:**  
For each resolved subject, relevant articles are retrieved using cursor-based pagination. This approach allows continuous crawling of large result sets without relying on offset-based pagination, which is inefficient at scale.

**Stateful Crawling & Rate Limiting:**  
The crawler maintains a persistent state per subject, stored locally, to:

- Resume crawling from the last processed cursor
- Prevent duplicate ingestion
- Respect OpenAlex rate limits and avoid API overuse

**Filtering Criteria:**  
Only articles that satisfy both of the following conditions are ingested:

- The article provides a valid open-access URL
- The article contains valid source (journal/conference) metadata

**Output Artifacts:**  
The raw data collected at this stage is stored in a line-delimited JSON format for efficient downstream processing:

- `core/data/openalex_raw/<subject>.jsonl` – raw article metadata per subject
- `core/data/openalex_state/<subject>.json` – crawler state and pagination metadata

These files serve as an immutable snapshot of the raw OpenAlex responses and allow reprocessing without repeated API calls.

#### 2.2 Transformation & Loading (Normalization)

Once the raw OpenAlex data is collected, it undergoes a transformation and normalization phase before database loading. This process is handled by a dedicated script:

```
node core/etl/load_openalex_to_mysql.cjs
```

This script processes raw JSONL files, cleans and normalizes the data, and loads it into a structured relational database.

**Normalization Logic:**  
Custom transformation scripts extract and normalize only the relevant fields from OpenAlex responses into structured entities:

- Articles
- Sources (journals / venues)
- Authors
- Institutions
- Subjects
- Keywords

**Schema Design:**  
The database schema follows a normalized relational model. Many-to-many relationships (e.g., articles–authors, articles–subjects, articles–keywords) are represented using dedicated junction tables.

**Data Cleaning & Deduplication:**  
During transformation:

- Duplicate entities are detected using stable OpenAlex identifiers
- Referential integrity is enforced between tables
- Partial or malformed records are discarded

**Batch Loading:**  
Data is inserted into MySQL in batches to improve performance and ensure transactional consistency during large imports.

---

### 3. API Usage Beyond OpenAlex

Beyond OpenAlex, the system incorporates API-based integrations with Large Language Models (LLMs) and other external services to enable advanced downstream analysis and user interaction features such as summarization, trend analysis, or semantic enrichment. These API interactions are strictly separated from the data ingestion and do not alter the raw or normalized academic dataset.

The agent utilizes the following APIs to fulfill user requests:

- **LLM Provider API (Groq or Gemini):**  
  Invoked twice per user request — first by the `PlannerAgent` to interpret the user's intent and generate an action plan, then by the `ExecutorAgent` to compose the final response using tool results. The backend LLM engine is configurable through the `LLM_PROVIDER` environment variable.

- **MySQL Database:**  
  Serves as the primary store of academic paper metadata aggregated from OpenAlex. The agent runs read-only queries to search articles, fetch details, list authors, enumerate subjects, and retrieve view counts.

- **PDF Extraction:**  
  Automates the retrieval of open-access PDFs using `curl` from supported sources (e.g., arXiv, JMLR, OpenReview, NeurIPS). It then uses the `pdf-parse` library to extract plain text for further summarization or semantic processing.

- **Unpaywall API:**  
  Used when users provide a DOI instead of a direct PDF link. This service resolves DOIs to open-access PDF URLs when available.

These integrations are modular and orchestrated to ensure reliable, read-only supplementation of user requests, with no modification of primary research data.

## Part II – Database Schema

### 1. Schema Overview

- The database is fully normalized (3NF+), centered around the `Articles` table.

**Primary entities:**
- Articles
- Authors
- Sources
- Institutions
- Subjects
- Keywords

**Relation tables (manage many-to-many relationships):**
- ArticlesAuthors
- ArticlesSubjects
- ArticlesKeywords
- ArticleAuthorInstitutions

**Behavioral tables:**
- ArticleViews (tracks dynamic user interactions)

### 2. Keys & Indexes

All tables define primary keys based on auto-incrementing integer IDs. Unique constraints are enforced on external OpenAlex identifiers (e.g., articles, authors, institutions) to prevent duplication. Indexes are explicitly and manually defined to support the system’s core access patterns and analytics workloads.

**Indexing strategy includes:**

- **Temporal filtering:**  
  Index on `Articles(year)` for efficient year-range queries.

- **Ranking and sorting:**  
  Composite index on `Articles(citation_count DESC, year DESC)` optimized for ordered result sets (e.g., top-cited recent articles).

- **Textual access:**  
  - `FULLTEXT` index on `Articles(title)` to support fast title-based search.  
  - Prefix index on `Articles(article_url(100))` for URL-based filtering.

- **Lookup and filtering:**  
  Indexes on `Authors(name)`, `Subjects(subject_name)`, and `Keywords(keyword)` to accelerate filter resolution.

- **Many-to-many joins:**  
  Indexes on foreign keys such as `ArticlesAuthors(author_id)` and `ArticleAuthorInstitutions(author_id, institution_id)` to optimize join-heavy analytical queries.

- **Behavioral analytics:**  
  Descending index on `ArticleViews(view_count)` to support popularity-based ranking.

Primary-key indexes are created automatically by MySQL.

All other indexes are manually designed based on observed query patterns and performance considerations.

> **See: 📊 Separate schema diagram for a visual overview of entities, relationships, and indexed fields.**

image.png

---

## Part III – Queries & Analytics

This section provides full, detailed documentation for **all data access queries** used in the system.  
Each documentation block describes a single query: its purpose, SQL structure, parameters, performance considerations, and design notes.

---

### Query 1: Subjects × Sources Heatmap

**Purpose**  
Retrieve a heatmap (matrix) showing the number of articles associated with each `(subject, source)` pair, considering only the top N subjects and sources by publication volume.  
Used for visual analytics showing discipline–journal intersections (e.g., in dashboards or explorer tools).

**SQL Template**
```sql
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
  [WHERE a2.year >= ?]         -- Optional: fromYear
  GROUP BY asub2.subject_id
  ORDER BY COUNT(*) DESC
  LIMIT :subjectLimit
) topSubjects ON topSubjects.subject_id = sub.subject_id

-- Join to limited sources
INNER JOIN (
  SELECT a3.source_id
  FROM Articles a3
  [WHERE a3.year >= ?]         -- Optional: fromYear
  GROUP BY a3.source_id
  ORDER BY COUNT(*) DESC
  LIMIT :sourceLimit
) topSources ON topSources.source_id = s.source_id

[WHERE a.year >= ?]            -- Optional: fromYear
GROUP BY sub.subject_id, s.source_id
ORDER BY subject, source
```
*Square brackets [ ] indicate optional presence depending on input parameters.*

**Parameters**

| Name         | Type    | Allowed Values / Constraints      | Purpose & Effect                                |
|--------------|---------|-----------------------------------|-------------------------------------------------|
| `fromYear`   | number? | integer, optional                 | Limit to articles published after this year     |
| `subjectLimit` | number | integer > 0 (default 5)          | Maximum number of subjects in result matrix     |
| `sourceLimit`  | number | integer > 0 (default 4)          | Maximum number of sources in result matrix      |

---

### Query 2: Language Impact

**Purpose**  
Compute the number of articles per language and the average number of citations for articles in each language. Supports analyses of linguistic diversity and citation patterns.

**SQL Template**
```sql
SELECT
  a.language            AS language,
  COUNT(*)              AS articleCount,
  AVG(a.citation_count) AS avgCitations
FROM Articles a
[WHERE a.year >= ?]   -- Optional: fromYear filter
GROUP BY a.language
ORDER BY articleCount DESC
```

**Parameters**

| Name       | Type    | Allowed Values | Purpose & Effect      |
|------------|---------|---------------|----------------------|
| fromYear   | number? | integer, optional | Lower bound for publication year |

---

### Query 3: Multidisciplinary vs. Single-Subject Article Analysis

**Purpose**  
Quantifies the distribution and citation impact of articles categorized as “single-subject” versus “multi-subject” (multidisciplinary).  
Used for exploratory research statistics and reporting.

**SQL Template**
```sql
SELECT
  t.type,
  COUNT(*)                          AS articles,
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
  JOIN ArticlesSubjects asub ON asub.article_id = a.article_id
  [WHERE a.year >= ?]         -- Optional: fromYear
  GROUP BY a.article_id, a.citation_count, a.source_id
) t
LEFT JOIN ArticlesAuthors aa ON aa.article_id = t.article_id
GROUP BY t.type
ORDER BY t.type
```

**Parameters**

| Name       | Type    | Allowed Values | Purpose & Effect      |
|------------|---------|---------------|----------------------|
| fromYear   | number? | integer, optional | Lower bound for article year |

---

### Query 4: Top Sources by Impact Score

**Purpose**  
Rank academic sources (journals, proceedings, etc.) by an impact score balancing total citations and publication volume.  
Displayed in ranking dashboards and source explorer UIs.

**SQL Template**
```sql
WITH top_sources AS (
  SELECT
    a.source_id,
    COUNT(*) AS articleCount,
    SUM(a.citation_count) AS totalCitations
  FROM Articles a
  [WHERE a.year >= ?] -- Optional: fromYear
  GROUP BY a.source_id
  HAVING articleCount >= :minCount
  ORDER BY
    (SUM(a.citation_count) / COUNT(*)) * LN(1 + COUNT(*)) DESC
  LIMIT :limit
)
SELECT
  s.source_id,
  s.name,
  s.type,
  s.publisher,
  ts.articleCount,
  ts.totalCitations,
  COUNT(DISTINCT aa.author_id)  AS authorCount,
  COUNT(DISTINCT asj.subject_id) AS subjectCount,
  ROUND(
    (ts.totalCitations / ts.articleCount)
    * LN(1 + ts.articleCount),
    2
  ) AS impactScore
FROM top_sources ts
JOIN Sources s ON s.source_id = ts.source_id
LEFT JOIN Articles a ON a.source_id = ts.source_id
LEFT JOIN ArticlesAuthors aa ON aa.article_id = a.article_id
LEFT JOIN ArticlesSubjects asj ON asj.article_id = a.article_id
GROUP BY s.source_id
ORDER BY impactScore DESC, ts.totalCitations DESC
```

**Parameters**

| Name       | Type   | Allowed Values      | Effect                          |
|------------|--------|---------------------|---------------------------------|
| fromYear   | number?| year (optional)     | Temporal filter for articles    |
| limit      | number | 1–50 (default 5)    | Maximum sources returned        |
| minCount   | number | ≥10                 | Minimum unique articles/source  |

---

### Query 5: Subject Impact per Source

**Purpose**  
For each source, computes publication and subject diversity metrics, including an “impact score.”  
Used in analytics dashboards for multi-dimensional source assessments.

**SQL Template**
```sql
WITH source_articles AS (
  SELECT
    a.source_id,
    COUNT(*) AS articleCount,
    SUM(a.citation_count) AS totalCitations
  FROM Articles a
  [WHERE a.year >= ?]       -- Optional: fromYear
  GROUP BY a.source_id
)
SELECT
  s.source_id,
  s.name AS sourceName,
  s.type AS sourceType,
  sa.articleCount,
  COUNT(DISTINCT asj.subject_id) AS subjectCount,
  ROUND(
    (sa.totalCitations / sa.articleCount)
    * LN(1 + sa.articleCount),
    2
  ) AS impactScore
FROM source_articles sa
JOIN Sources s ON s.source_id = sa.source_id
LEFT JOIN Articles a ON a.source_id = sa.source_id
LEFT JOIN ArticlesSubjects asj ON asj.article_id = a.article_id
GROUP BY s.source_id
ORDER BY sourceName ASC
LIMIT 1000
```

**Parameters**

| Name       | Type    | Allowed Values | Purpose & Effect      |
|------------|---------|---------------|----------------------|
| fromYear   | number? | integer, optional | Articles date filter |

---

### Query 6: Trending Topics by Keyword

**Purpose**  
Identify recently/emergently popular keywords, ranked by how many distinct articles each appears in over a time window.

**SQL Template**
```sql
SELECT
  k.keyword,
  COUNT(DISTINCT ak.article_id) AS articleCount,
  MIN(a.year) AS firstAppearanceYear,
  MAX(a.year) AS latestYear
FROM ArticlesKeywords ak
JOIN Articles a ON a.article_id = ak.article_id
JOIN Keywords k ON ak.keyword_id = k.keyword_id
WHERE 1=1
  [AND a.year >= ?]   -- fromYear, optional
GROUP BY ak.keyword_id
ORDER BY articleCount DESC
LIMIT :limit
```

**Parameters**

| Name     | Type    | Allowed Values      | Effect                             |
|----------|---------|---------------------|-------------------------------------|
| fromYear | number? | integer, optional   | Lower bound: article year           |
| limit    | number  | integer, ≥1         | Maximum results (default 5)         |

---

### Query 7: Keyword Growth Over Time

**Purpose**  
Track the number of articles for given keyword(s) over time (per year), providing a temporal evolution chart.

**SQL Template**
```sql
SELECT
  k.keyword AS keyword,
  a.year    AS year,
  COUNT(DISTINCT a.article_id) AS articleCount
FROM Keywords k
JOIN ArticlesKeywords ak ON k.keyword_id = ak.keyword_id
JOIN Articles a ON a.article_id = ak.article_id
WHERE k.keyword IN (?, ?, ...)      -- keywords array
  [AND a.year >= ?]                 -- fromYear, optional
GROUP BY k.keyword_id, a.year
ORDER BY k.keyword, a.year DESC
```

**Parameters**

| Name      | Type     | Allowed Values     | Effect                      |
|-----------|----------|--------------------|-----------------------------|
| keywords  | array    | list of strings    | Target keywords to analyze  |
| fromYear  | number?  | integer, optional  | Minimum article year filter |

---

### Query 8: Keyword Cross-Domain Analysis

**Purpose**  
For each keyword, count how many distinct subjects it is associated with, as a proxy for its “cross-disciplinarity.”

**SQL Template**
```sql
SELECT
  k.keyword AS keyword,
  COUNT(DISTINCT asub.subject_id) AS subjectCount,
  COUNT(DISTINCT ak.article_id)   AS articleCount,
  GROUP_CONCAT(
    DISTINCT s.subject_name
    ORDER BY s.subject_name
    SEPARATOR '||'
  ) AS subjects
FROM ArticlesKeywords ak
JOIN Articles a ON a.article_id = ak.article_id
JOIN Keywords k ON ak.keyword_id = k.keyword_id
JOIN ArticlesSubjects asub ON asub.article_id = a.article_id
JOIN Subjects s ON s.subject_id = asub.subject_id
WHERE k.keyword IN (?, ?, ...)      -- keywords array
  AND s.subject_name <> k.keyword
  [AND a.year >= ?]
GROUP BY k.keyword_id
HAVING subjectCount >= ?
ORDER BY articleCount DESC, subjectCount DESC
```

**Parameters**

| Name        | Type    | Allowed Values     | Effect                                               |
|-------------|---------|--------------------|------------------------------------------------------|
| keywords    | array   | strings            | Which keywords to examine                            |
| fromYear    | number? | integer, optional  | Starting year filter                                 |
| minSubjects | number  | integer (default 2)| Minimum number of subjects for a valid result        |

---

### Query 9: Top Researchers by Total Citations (Phase 1: Candidates)

**Purpose**  
Select the top N authors (by total citations from their articles), for use in leaderboards or further analysis.

**SQL Template**
```sql
SELECT
  aa.author_id,
  SUM(a.citation_count) AS totalCitations
FROM Articles a
JOIN ArticlesAuthors aa ON a.article_id = aa.article_id
[WHERE a.year >= ?]
GROUP BY aa.author_id
ORDER BY totalCitations DESC
LIMIT :limit
```

**Parameters**

| Name     | Type    | Allowed Values     | Purpose & Effect                |
|----------|---------|--------------------|---------------------------------|
| fromYear | number? | integer, optional  | Earliest article year           |
| limit    | number  | integer (default 5)| Top N researchers               |

---

### Query 10: Top Researchers Details (Phase 2)

**Purpose**  
Obtain comprehensive statistics for a list of top author IDs: counts, mean citations, diversity of subjects/institutions, etc.

**SQL Template**
```sql
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
[WHERE a.year >= ?]
AND au.author_id IN (?, ?, ...)
GROUP BY au.author_id
ORDER BY subjectCount DESC, totalCitations DESC
```

**Parameters**

| Name       | Type    | Allowed Values     | Effect                        |
|------------|---------|--------------------|-------------------------------|
| authorIds  | array   | integer array      | List of author IDs to report  |
| fromYear   | number? | integer, optional  | Article year lower-bound      |

---

### Query 11: Generic Article Lookup by IDs

**Purpose**  
Retrieve detailed information for an explicit list of article IDs, complete with source/author/subject keyword aggregation.

**SQL Template**
```sql
SELECT DISTINCT
  a.article_id,
  a.openalex_id,
  a.title,
  a.year,
  a.language,
  a.type,
  a.citation_count,
  a.article_url,
  av.view_count AS views,
  src.name AS source,
  src.type AS source_type,
  src.publisher AS publisher,
  GROUP_CONCAT(DISTINCT au.name) AS authors,
  GROUP_CONCAT(DISTINCT s.subject_name) AS subjects,
  GROUP_CONCAT(DISTINCT k.keyword) AS keywords
FROM Articles a
LEFT JOIN Sources src ON a.source_id = src.source_id
LEFT JOIN ArticlesAuthors aa ON a.article_id = aa.article_id
LEFT JOIN Authors au ON aa.author_id = au.author_id
LEFT JOIN ArticlesSubjects asub ON a.article_id = asub.article_id
LEFT JOIN Subjects s ON asub.subject_id = s.subject_id
LEFT JOIN ArticlesKeywords ak ON a.article_id = ak.article_id
LEFT JOIN Keywords k ON ak.keyword_id = k.keyword_id
LEFT JOIN ArticleViews av ON a.article_id = av.article_id
WHERE a.article_id IN (?, ?, ...)
GROUP BY a.article_id
ORDER BY FIELD(a.article_id, ?, ?, ...)
```

**Parameters**

| Name        | Type   | Allowed Values    | Purpose                  |
|-------------|--------|------------------|--------------------------|
| articleIds  | array  | integer []       | Which articles to show   |

---

### Query 12: Full-Text Search and Filtered Paper Lookups

**Purpose**  
Enables user-facing search for articles by title (using FULLTEXT), keyword, subject, and publication year range.  
Employed in search result APIs and advanced filtering pages.

**SQL Template**
```sql
SELECT DISTINCT
  a.article_id,
  a.title,
  a.year,
  a.citation_count,
  a.article_url,
  src.name AS source_name,
  src.type AS source_type
FROM Articles a
LEFT JOIN Sources src ON a.source_id = src.source_id
LEFT JOIN ArticlesSubjects asub ON a.article_id = asub.article_id
LEFT JOIN Subjects s ON asub.subject_id = s.subject_id
LEFT JOIN ArticlesKeywords ak ON a.article_id = ak.article_id
LEFT JOIN Keywords k ON ak.keyword_id = k.keyword_id
[WHERE ... various filters ...]
ORDER BY a.citation_count DESC
LIMIT :limit
```
Where:
- `WHERE` clause includes 0 or more of:  
  - MATCH(a.title) AGAINST (? IN NATURAL LANGUAGE MODE)
  - k.keyword LIKE ?
  - s.subject_name LIKE ?
  - a.year >= ?
  - a.year <= ?

**Parameters**

| Name     | Type    | Allowed Values           | Description                                           |
|----------|---------|--------------------------|-------------------------------------------------------|
| query    | string? | any text                 | Searched in article title (FULLTEXT) and keyword LIKE |
| subject  | string? | any text                 | Filter on subject name                                |
| yearMin  | number? | integer, optional        | Filter: year >= value                                 |
| yearMax  | number? | integer, optional        | Filter: year <= value                                 |
| limit    | number? | 1–10 (default: 5)        | Maximum rows returned                                 |

**Notes:**  
- Relies on FULLTEXT index on Articles.title.

---

### Query 13: Get Paper Details by Article ID

**Purpose**  
Return rich, joined information for a single given article (source, authors, institutions, subjects, keywords).

**SQL Template Sequence**
1. Basic Article:
   ```sql
   SELECT 
     a.*,
     src.name AS source_name,
     src.type AS source_type,
     src.publisher
   FROM Articles a
   LEFT JOIN Sources src ON a.source_id = src.source_id
   WHERE a.article_id = ?
   ```
2. Authors:
   ```sql
   SELECT au.author_id, au.name
   FROM Authors au
   JOIN ArticlesAuthors aa ON au.author_id = aa.author_id
   WHERE aa.article_id = ?
   ```
3. Institutions:
   ```sql
   SELECT aai.author_id, i.name AS institution_name
   FROM ArticleAuthorInstitutions aai
   JOIN Institutions i ON aai.institution_id = i.institution_id
   WHERE aai.article_id = ?
   ```
4. Subjects:
   ```sql
   SELECT s.subject_name
   FROM Subjects s
   JOIN ArticlesSubjects asub ON s.subject_id = asub.subject_id
   WHERE asub.article_id = ?
   ```
5. Keywords:
   ```sql
   SELECT k.keyword
   FROM Keywords k
   JOIN ArticlesKeywords ak ON k.keyword_id = ak.keyword_id
   WHERE ak.article_id = ?
   ```
**Parameters**

| Name       | Type   | Allowed Values    | Description                 |
|------------|--------|------------------|-----------------------------|
| articleId  | number | integer          | Target article ID           |

---

### Query 14: Get Author Papers (by Name, Fuzzy)

**Purpose**  
Find papers associated with authors whose name matches a given string (used for search/autocomplete).

**SQL Template**
```sql
SELECT DISTINCT
  a.article_id,
  a.title,
  a.year,
  a.citation_count,
  au.name AS author_name
FROM Articles a
JOIN ArticlesAuthors aa ON a.article_id = aa.article_id
JOIN Authors au ON aa.author_id = au.author_id
WHERE au.name LIKE ?
ORDER BY a.citation_count DESC
LIMIT ?
```

**Parameters**

| Name        | Type   | Allowed Values        | Description             |
|-------------|--------|----------------------|-------------------------|
| authorName  | string | '%' wildcards allowed| Author name filter      |
| limit       | number | 1–N (default: 5)     | Maximum number returned |

---

### Query 15: List Subjects with Paper Counts

**Purpose**  
Return all subjects with the count of associated articles, ordered by prevalence.

**SQL Template**
```sql
SELECT s.subject_name, COUNT(asub.article_id) AS paper_count
FROM Subjects s
LEFT JOIN ArticlesSubjects asub ON s.subject_id = asub.subject_id
GROUP BY s.subject_id, s.subject_name
ORDER BY paper_count DESC
LIMIT 30
```

**Parameters**  
_None_

---

### Query 16: Search Papers with PDF Links

**Purpose**  
Find articles that have a PDF or are from known preprint sources, optionally matching title text.

**SQL Template**
```sql
SELECT a.article_id, a.title, a.year, a.citation_count, a.article_url, src.name as source_name
FROM Articles a
LEFT JOIN Sources src ON a.source_id = src.source_id
WHERE (a.article_url LIKE '%arxiv.org%' 
       OR a.article_url LIKE '%jmlr.org%'
       OR a.article_url LIKE '%mlr.press%'
       OR a.article_url LIKE '%.pdf')
  AND (? IS NULL OR MATCH(a.title) AGAINST(? IN NATURAL LANGUAGE MODE))
ORDER BY a.citation_count DESC
LIMIT ?
```

**Parameters**

| Name    | Type    | Allowed Values         | Description                      |
|---------|---------|-----------------------|----------------------------------|
| query   | string? | text or null          | Match in article title           |
| limit   | number  | integer (default: 5)  | Max returned                     |

---

### Query 17: Get Most Viewed Articles

**Purpose**  
Shows the most-read or most-accessed articles, used for popularity charts/tracking.

**SQL Template**
```sql
SELECT 
  a.article_id,
  a.title,
  a.year,
  a.citation_count,
  a.article_url,
  v.view_count,
  v.last_viewed_at
FROM ArticleViews v
JOIN Articles a ON v.article_id = a.article_id
ORDER BY v.view_count DESC
LIMIT ?
```
**Parameters**

| Name   | Type   | Allowed Values      | Purpose                |
|--------|--------|---------------------|------------------------|
| limit  | number | integer (default 10)| Maximum to return      |

---

### Query 18: Get Article ID by URL

**Purpose**  
Utility query to look up an article’s numeric ID given a unique (or nearly unique) URL.

**SQL Template**
```sql
SELECT article_id FROM Articles WHERE article_url = ? LIMIT 1
```
**Parameters**

| Name  | Type   | Allowed Values  | Description / Purpose      |
|-------|--------|-----------------|----------------------------|
| url   | string | valid URL       | Find article_id by URL     |

---

## Part IV – Code Architecture

### 1. High-Level Overview: Layers & Project Structure

The TeacherAssistantAI project emphasizes modularity, security, and clear separation between system layers—frontend, backend (API, agent logic, data access), ETL, and docs.

The high-level directory structure is:

```
TeacherAssistantAI/
├── core/
│   ├── backend/             # API server (Express + TypeScript)
│   │   └── src/
│   │       ├── agent/       # LLM, chat/agent logic
│   │       │   ├── agents/
│   │       │   │   ├── executor.ts
│   │       │   │   ├── index.ts
│   │       │   │   ├── orchestrator.ts
│   │       │   │   └── planner.ts
│   │       │   ├── types/
│   │       │   │   └── plan.ts
│   │       │   ├── _archive_agent.txt
│   │       │   ├── db.ts
│   │       │   ├── pdf.ts
│   │       │   ├── server.ts
│   │       │   ├── strategies.ts
│   │       │   ├── tools.ts
│   │       │   └── types.ts
│   │       ├── controllers/ # REST API controllers
│   │       │   ├── articlesController.ts
│   │       │   ├── filters.ts
│   │       │   └── insightsController.ts
│   │       ├── db/          # Database logic & queries
│   │       │   ├── insights/
│   │       │   │   ├── crossQueries.ts
│   │       │   │   ├── overviewQueries.ts
│   │       │   │   ├── researchersQueries.ts
│   │       │   │   ├── sourcesQueries.ts
│   │       │   │   └── trendsQueries.ts
│   │       │   ├── search/
│   │       │   │   ├── ArticleSearchIdsQuery.ts
│   │       │   │   └── ArticleSearchQuery.ts
│   │       │   └── queryBuilder.ts
│   │       ├── routes/      # Express route handlers
│   │       │   ├── articles.ts
│   │       │   ├── chat.ts
│   │       │   ├── filters.ts
│   │       │   └── insights.ts
│   │       ├── services/    # Service/business logic layer
│   │       │   ├── articlesService.ts
│   │       │   ├── filters.ts
│   │       │   └── insightsService.ts
│   │       ├── types/       # Shared TypeScript types
│   │       │   ├── ArticleSearchFilters.ts
│   │       │   └── insights.types.ts
│   │       ├── validation/  # Validation logic (schemas, input)
│   │       │   ├── articleSearchSchema.ts
│   │       │   └── filtersSchemas.ts
│   │       ├── app.ts
│   │       ├── db.ts
│   │       └── schemas.ts
│   ├── etl/                 # OpenAlex ingestion scripts
│   │   ├── fetch_openalex.cjs
│   │   ├── load_openalex_to_mysql.cjs
│   └── schema.sql           # Database schema
├── front/                     # Next.js frontend
│   ├── app/                   # Application routes & layouts (Next.js app router)
│   │   ├── chat/
│   │   │   ├── components/
│   │   │   │   ├── chat-input.tsx
│   │   │   │   ├── message-item.tsx
│   │   │   │   ├── message-list.tsx
│   │   │   │   └── MessageTime.tsx
│   │   │   └── page.tsx
│   │   ├── insights/
│   │   │   ├── components/
│   │   │   │   ├── cross-analysis/
│   │   │   │   │   ├── cross-analysis-view.tsx
│   │   │   │   │   ├── language-impact-bar-chart.tsx
│   │   │   │   │   ├── multidisciplinary-vs-single.tsx
│   │   │   │   │   └── subject-source-heatmap.tsx
│   │   │   │   ├── overview/
│   │   │   │   │   ├── metrics-cards.tsx
│   │   │   │   │   ├── overview-view.tsx
│   │   │   │   │   └── publications-timeline.tsx
│   │   │   │   ├── researchers/
│   │   │   │   │   ├── multidisciplinary-researcher-card.tsx
│   │   │   │   │   ├── multidisciplinary-researchers-grid.tsx
│   │   │   │   │   ├── researcher-grid.tsx
│   │   │   │   │   ├── researcher-profile-card.tsx
│   │   │   │   │   └── researchers-view.tsx
│   │   │   │   ├── sources/
│   │   │   │   │   ├── citation-volatility-table.tsx
│   │   │   │   │   ├── sources-view.tsx
│   │   │   │   │   └── top-sources-table.tsx
│   │   │   │   ├── trends/
│   │   │   │   │   ├── keyword-cross-domain.tsx
│   │   │   │   │   ├── keyword-growth-table.tsx
│   │   │   │   │   ├── trending-topics-table.tsx
│   │   │   │   │   └── trends-view.tsx
│   │   │   │   ├── insights-header.tsx
│   │   │   │   └── view-tabs.tsx
│   │   │   ├── types/
│   │   │   │   └── insights.types.ts
│   │   │   └── page.tsx
│   │   ├── search/
│   │   │   ├── components/
│   │   │   │   ├── AsyncMultiSelect.tsx
│   │   │   │   ├── filters-sidebar.tsx
│   │   │   │   ├── pagination.tsx
│   │   │   │   ├── result-card.tsx
│   │   │   │   ├── results-header.tsx
│   │   │   │   ├── results-list.tsx
│   │   │   │   ├── search-header.tsx
│   │   │   │   └── SearchByTitle.tsx
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   └── HtmlDirection.tsx
│   │   ├── nav/
│   │   │   ├── LanguageToggle.tsx
│   │   │   ├── nav.config.ts
│   │   │   ├── NavLinks.tsx
│   │   │   ├── NavLogo.tsx
│   │   │   └── TopNav.tsx
│   │   └── ui/
│   │       └── Loader.tsx
│   ├── hooks/
│   │   ├── insights/
│   │   │   ├── useInsightsCross.ts
│   │   │   ├── useInsightsOverview.ts
│   │   │   ├── useInsightsResearchers.ts
│   │   │   ├── useInsightsSources.ts
│   │   │   └── useInsightsTrends.ts
│   │   ├── useArticlesSearch.ts
│   │   ├── useArticleView.ts
│   │   └── useFilterOptions.ts
│   ├── i18n/
│   │   ├── en.json
│   │   ├── he.json
│   │   ├── I18nProvider.tsx
│   │   └── index.ts
│   ├── lib/
│   │   ├── api/
│   │   │   ├── agent.ts
│   │   │   ├── articles.api.ts
│   │   │   ├── client.ts
│   │   │   ├── filters.api.ts
│   │   │   └── insights.api.ts
│   │   └── types/
│   │       ├── filters/
│   │       │   └── ArticleSearchFilters.ts
│   │       ├── insights/
│   │       │   ├── CrossAnalysis.ts
│   │       │   ├── Overview.ts
│   │       │   ├── Researchers.ts
│   │       │   ├── Sources.ts
│   │       │   └── Trends.ts
│   │       └── article.ts
│   ├── styles/
│   │   ├── globals.css
│   │   └── variables.css
```

#### Key Layer Descriptions

- **front/**: Next.js frontend – all user-facing pages, chat/search/insights features, UI components, hooks, and i18n (internationalization).
- **core/backend/src**:
  - **agent/**: Orchestration logic for LLM-powered features (Planner: intent decomposition; Executor: controlled tool/query execution).
  - **controllers/**: API endpoint handlers – connect HTTP REST requests to backend/service logic.
  - **services/**: Main business logic and orchestration layer for backend features.
  - **db/**: All database access, query building, input validation, and connection pooling.
  - **routes/**: Express router definitions mapping endpoints to controllers.
  - **types/**, **validation/**: TypeScript type definitions and input schema validation.
- **core/etl/**: Scripts for extracting, transforming, and loading academic data from OpenAlex to MySQL.
- **docs/**: User and developer documentation, technical overviews, and usage guides.

> **Note:** *All* database queries and LLM (AI agent) operations are mediated strictly by the backend API. The frontend and language model *never* access the DB directly—every request flows through controller and service layers, ensuring safety, security, and full auditability.

---

### 2. Essential Backend Directory Overview

```
core/backend/src/
├── agent/        # LLM agent modules: intent planning, safe orchestration
├── controllers/  # Express API endpoint handlers
├── services/     # Core backend logic and orchestration
├── db/           # Query builder, input validation, connection utilities
├── routes/       # Route registration logic (maps endpoints to controllers)
```

### 3. Essential Frontend Directory Overview

#### Key Hooks & API Layers

```
front/
├── hooks/         # React hooks for loading articles, insights, and filters
├── lib/
│   ├── api/       # Modules to call backend endpoints (search, chat, insights)
│   └── types/     # Central TypeScript types for API data
```

- **hooks/**: Provides fully-typed React hooks for loading articles, insights, researchers, filter options, and for chat interactions.
- **lib/api/**: Contains API modules, one per backend entity/feature, encapsulating all HTTP calls. Each returns structured data for hooks/UI.
- **lib/types/**: Centralized API types for responses, request params, and reusability.

UI components consume hooks, which themselves wrap these API modules for type safety and clean separation.

---

### 4. Central Algorithm: LLM Agent Orchestration

The system's centerpiece is its agent orchestration pipeline, which operates as follows:

1. **Planner phase:**  
   The LLM (acting as a Planner) analyzes the user’s message/intention and decomposes it into an ordered plan (a sequence of tool/database steps).
2. **Executor phase:**  
   The Executor module securely runs the required backend tools and database queries, following strict read-only SQL constraints to prevent side effects or unsafe operations.
3. **Result synthesis:**  
   The LLM synthesizes, summarizes, or reformulates results for return to the user.
4. **PDF/document reading (when applicable):**  
   If article PDF parsing is needed, the system reads documents page-by-page and extracts key info efficiently.

**Security and Reliability Features:**
- Enforced read-only SQL execution—no direct writes, no schema access, no LLM or frontend-initiated DB changes.
- Controller/service query mediation—never direct LLM or client DB access.
- All agent-driven actions are fully auditable and explainable.
- Model “hallucination” is minimized by tightly controlling access to tools and queries.

This architecture enables safe, powerful AI-driven exploration and analytics of academic data with rigorous safeguards.