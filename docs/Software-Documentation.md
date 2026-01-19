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

- All tables have primary keys (auto-incrementing IDs).
- Unique constraints on OpenAlex identifiers.
- Extensive indexing is used for:
  - Year
  - Citation count
  - Name/label fields
  - Keywords
  - View counts
- `FULLTEXT` index is applied to article titles for efficient search.
- Indexes are a mix of automatic (for PKs) and manual for query optimization.

> **See: 📊 Separate schema diagram for visual reference.**

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