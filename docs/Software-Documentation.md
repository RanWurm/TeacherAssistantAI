# 📗 Software Documentation

## Part I – Data Collection & Processing

### 1. Data Source

The main data source is [OpenAlex](https://openalex.org/), an open academic metadata API covering articles, authors, institutions, subjects, and keywords.

---

### 2. Data Ingestion Pipeline

Data ingestion consists of two primary stages:

#### 2.1 Extraction (Fetching)

- Subjects are resolved using the OpenAlex Concepts API.
- For each subject, papers are fetched using cursor-based pagination.
- Crawling is both rate-limited and stateful to avoid duplication and API overuse.
- Only articles meeting both of the following are ingested:
  - Have open access URLs.
  - Have valid source information.

**Files created in this stage:**
- `core/data/openalex_raw/<subject>.jsonl`
- `core/data/openalex_state/<subject>.json`

#### 2.2 Transformation & Loading (Normalization)

- Raw OpenAlex objects are reduced and normalized into distinct tables for:
  - Articles
  - Sources
  - Authors
  - Institutions
  - Subjects
  - Keywords
- Data is batch-inserted into MySQL with mechanisms for:
  - Deduplication
  - Maintaining referential integrity
  - Managing many-to-many mappings via relation tables

---

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

All tables define primary keys based on auto-incrementing integer IDs.
Unique constraints are enforced on external OpenAlex identifiers (e.g., articles, authors, institutions) to prevent duplication.
Indexes are explicitly and manually defined to support the system’s core access patterns and analytics workloads.

*Indexing strategy includes:*

- *Temporal filtering:*  
  Index on Articles(year) for efficient year-range queries.

- *Ranking and sorting:*  
  Composite index on Articles(citation_count DESC, year DESC) optimized for ordered result sets (e.g., top-cited recent articles).

- *Textual access:*  
  - FULLTEXT index on Articles(title) to support fast title-based search.  
  - Prefix index on Articles(article_url(100)) for URL-based filtering.

- *Lookup and filtering:*  
  Indexes on Authors(name), Subjects(subject_name), and Keywords(keyword) to accelerate filter resolution.

- *Many-to-many joins:*  
  Indexes on foreign keys such as ArticlesAuthors(author_id) and  
  ArticleAuthorInstitutions(author_id, institution_id) to optimize join-heavy analytical queries.

- *Behavioral analytics:*  
  Descending index on ArticleViews(view_count) to support popularity-based ranking.

Primary-key indexes are created automatically by MySQL.

All other indexes are manually designed based on observed query patterns and performance considerations.

See: 📊 Separate schema diagram for a visual overview of entities, relationships, and indexed fields.

<img width="1344" height="645" alt="image" src="https://github.com/user-attachments/assets/9b279f1e-523e-41c9-9bcb-c9e8c132ab8e" />


---

## Part III – Queries & Analytics

### Example Complex Query: Top Sources by Impact Score

**Purpose:**  
Rank journals/sources by a balanced measure of influence (combining both citation impact and publication volume).

**Formula:**  
ImpactScore = (TotalCitations / ArticleCount) · ln(1 + ArticleCount)



**Explanation of Terms**

- **TotalCitations** – Total number of citations received by all articles published in the source
- **ArticleCount** – Total number of articles published by the source
- **ln(1+ArticleCount)** – Logarithmic smoothing factor that balances publication volume

**Benefits:**
- Reduces bias toward journals that publish the most papers.
- Downweights sources with only a few (possibly outlier) articles.
- Goes beyond simple aggregate counts to produce nuanced rankings.

**Optimization Approaches:**
- Use of Common Table Expressions (CTEs) for intermediate aggregations.
- Aggregation as early as possible (reducing scanned rows).
- Indexed joins and minimal table scans.

**Other Supported Analytics:**
- Publication trends over time
- Keyword emergence/growth by year
- Multidisciplinary author detection
- Subject–source heatmaps
- Sophisticated author rankings (multi-step queries)
- All app-facing queries are strictly read-only

For every query, documentation includes:
- SQL template
- Parameter definitions
- Output schema
- Notes on computational performance

---

## Part IV – Code Architecture

### 1. High-Level Separation of Concerns

- **Frontend:** Presentation and user interaction (UI/UX only).
- **Backend:** Core application logic (“the brain”).
- **Database:** Persistent, normalized academic data.
- **LLM (AI):** External logic and reasoning (cannot directly access the database).

> *There is no direct connection allowed between the frontend, the DB, and the LLM. All communication flows through controlled backend APIs.*

---

### 2. Backend Structure (Directory Overview)

```
backend/
├── agents/        # Planner, Executor, Orchestrator modules
├── db/            # Query logic, validators, connection pool
├── tools/         # Tools accessible by LLM via backend
├── api/           # Express HTTP routes
├── pdf/           # PDF parsing and extraction
```

---

### 3. Central Algorithm – AI Agent Orchestration

- The main system loop is orchestrated as follows:
  1. The “Planner” (LLM) determines the user intent and decomposes it into steps.
  2. The “Executor” reliably and securely runs the necessary backend tools and queries.
  3. The LLM synthesizes the results for the user.
- At every step, read-only SQL constraints are enforced (prevents unsafe write operations).
- This design:
  - Prevents unsafe or direct DB access from the LLM or frontend.
  - Reduces model “hallucination”.
  - Ensures every step is auditable and explainable.

### 4. Key Design Decisions

- Relational DB (MySQL) selected for structured, interconnected academic data.
- Strictly enforced read-only SQL for security and data integrity.
- Modular, agent-based backend for extensibility.
- Selective, incremental data fetching for scalability and system performance.
