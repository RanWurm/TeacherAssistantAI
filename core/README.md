# core-research-assistant

---

## Core Research Assistant – Backend

A modular backend system for fetching, cleaning, loading, storing, and searching academic articles from the [CORE](https://core.ac.uk/) dataset, leveraging a fully normalized MySQL database and a robust TypeScript query engine.

---

## 📌 Overview

**Key Features:**
- **✅ Comprehensive ETL Pipeline:** Fetch, clean, normalize, and load articles into MySQL
- **✅ General-purpose MySQL communication layer**
- **✅ Dynamic Query Builder:** Flexible SQL construction based on frontend filters
- **✅ REST API endpoints:** Accessible search for Articles, Authors, Journals, Subjects, and Keywords
- **✅ Strong TypeScript type safety for filters & schemas**
- **✅ Modular, scalable folder structure**

This backend is the foundation for the upcoming **Research Assistant Platform**.

---

## 📂 Project Structure

```
core-research-assistant/
│
├── backend/
│   ├── src/
│   │   ├── app.ts                  ← Express app entry
│   │   ├── db/
│   │   │   ├── db.ts               ← MySQL pool + general query()
│   │   │   ├── queryBuilder.ts     ← Generic SQL builder
│   │   │   ├── ArticleSearchQuery.ts
│   │   │   ├── AuthorSearchQuery.ts
│   │   │   ├── JournalSearchQuery.ts
│   │   │   ├── KeywordSearchQuery.ts
│   │   │   └── SubjectsSearchQuery.ts
│   │   ├── controllers/            ← API controllers
│   │   ├── routes/                 ← Express routes
│   │   ├── services/               ← DB service layer
│   │   ├── types/
│   │   │   ├── ArticleSearchFilters.ts
│   │   │   ├── AuthorSearchFilters.ts
│   │   │   ├── JournalSearchFilters.ts
│   │   │   ├── KeywordSearchFilters.ts
│   │   │   └── SubjectSearchFilters.ts
│   │   └── schemas.ts              ← TypeScript DB object schemas
│   ├── data/
│   │   ├── openalex_raw/              # Raw JSONL files fetched from OpenAlex
│   │   └── openalex_state/            # State files (cursors) for incremental fetching
│   │
│   ├── etl/
│   │   ├── fetch_openalex.cjs         # Fetches data from OpenAlex API
│   │   └── load_openalex_to_mysql.cjs # Loads and normalizes data into MySQL
│   │
│   ├── schema.sql                  ← Database schema
│   ├── test_api.http               ← Postman/VSCode API tests
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
└── front/                          ← (future frontend)
```

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configuration

Create a `.env` file in `/backend/` with your database credentials:

```
DB_HOST=localhost
DB_USER=root
DB_PASS=YOUR_PASSWORD
DB_NAME=YOUR_DATABASE
PORT=3001
```

---

## 🗄️ Database Initialization

### 3. Create the Database Schema

Open **MySQL Workbench** or your preferred CLI tool and run:

```sql
CREATE DATABASE coredb;
USE coredb;
```

Then execute the full schema from:

```
core/schema.sql
```

This creates all necessary tables, including:
- Articles, Authors, Journals, Subjects, Keywords
- Relation tables: ArticlesAuthors, ArticlesSubjects, ArticlesKeywords

---

## 🔄 ETL Workflow

### 4. Fetch Articles from OpenAlex

Pull and save raw articles from OpenAlex:

```bash
node backend/etl/fetch_openalex.cjs
```

Output: backend/data/openalex_raw/*.jsonl

### 5. Load Data into MySQL

Normalize and load raw data:

```bash
node core/etl/load_openalex_to_mysql.cjs
```

### 6. Verify Data Load

Check entity counts:

```sql
USE coredb;

SELECT COUNT(*) FROM Articles;
SELECT COUNT(*) FROM Authors;
SELECT COUNT(*) FROM Journals;
SELECT COUNT(*) FROM Subjects;
SELECT COUNT(*) FROM Keywords;
```

---

## 🧠 Running the Backend Server

### 7. Start the API Server

Make sure dependencies are installed, then start the dev server:

```bash
npm run dev
```

The server runs at [http://localhost:3001](http://localhost:3001).

#### Health Check

Test server status:

```http
GET http://localhost:3001/api/health
```

Should return:

```json
{
  "status": "ok"
}
```

---

## 📡 API Overview

### 8. Query Endpoints

Available search endpoints:
- `POST /api/articles/search`
- `POST /api/authors/search`
- `POST /api/journals/search`
- `POST /api/keywords/search`
- `POST /api/subjects/search`

#### Example Article Search Request

```http
POST http://localhost:3001/api/articles/search
Content-Type: application/json

{
  "keyword": "machine learning",
  "subject": "biology",
  "fromYear": 2018,
  "toYear": 2024,
  "author": "Smith",
  "limit": 10,
  "offset": 0
}
```

*See more ready-to-run queries in [`backend/test_api.http`](backend/test_api.http), usable with [VSCode REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) or [Insomnia](https://insomnia.rest/).*

#### Search Fields Supported

- **Articles:**
  - `keyword` (string)
  - `subject` (string)
  - `author` (string)
  - `fromYear`, `toYear` (number)
  - `language` (string)
  - `type` (string)
  - `limit`, `offset` (number)
- **Authors:**  
  - `name` (string)
  - `affiliation` (string)
  - `limit`, `offset` (number)
- **Journals:**  
  - `name` (string)
  - `limit`, `offset` (number)
- **Keywords:**  
  - `keyword` (string)
  - `limit`, `offset` (number)
- **Subjects:**  
  - `subject_name` (string)
  - `limit`, `offset` (number)

Filtering and pagination are available for all endpoints.

---

## ⚙️ Backend Architecture

### 🧩 General MySQL Communication Layer

**Location:** `src/db/db.ts`

**Core Function:**
```ts
export async function query(sql: string, params: any[] = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}
```
All backend modules use this function to interact with the database.

---

### 🏗️ Dynamic Query Builder Utility

**Location:** `src/db/queryBuilder.ts`

This utility provides dynamic SQL building, including:
- `SELECT` clauses
- `JOIN` logic
- `WHERE` filters
- Ordering & pagination

All search modules leverage this builder for adaptable, secure queries.

---

### 🔍 Search Modules per Entity

Each core entity has a dedicated search builder to generate SQL statements from API filters.

| Entity   | Query Builder File                 |
|----------|-----------------------------------|
| Articles | `src/db/ArticleSearchQuery.ts`    |
| Authors  | `src/db/AuthorSearchQuery.ts`     |
| Journals | `src/db/JournalSearchQuery.ts`    |
| Subjects | `src/db/SubjectsSearchQuery.ts`   |
| Keywords | `src/db/KeywordsSearchQuery.ts`   |

**How it Works:**
- Each builder takes filter parameters from the API body.
- It assembles the correct SQL and parameters with the generic builder.
- Filter fields map directly to relevant columns or join conditions.
- Query and parameter arrays are returned to the calling service.

#### Example Articles Search Request

```json
{
  "subject": "machine",
  "author": "John",
  "fromYear": 2019,
  "toYear": 2023,
  "keyword": "neural",
  "limit": 20,
  "offset": 0
}
```

**Request Handling:**
- The Articles search builder filters by subject, author, year range, and keyword.
- Paging applies through `limit` and `offset`.
- Similar logic applies for the other entity search modules.

> **Note**: The architecture is easy to extend to new entities and filters.

---

## 📄 CORE Article Schema

**Sample Fetched Article:**

```json
{
  "id": "string",
  "title": "string",
  "authors": [
    {
      "name": "string",
      "affiliation": "string | null"
    }
  ],
  "year": 1999,
  "venue": "string | null",
  "citationCount": 123,
  "downloadUrl": "string | null",
  "pdfHash": "string | null",
  "references": [
    "string",
    "string",
    "string"
  ]
}
```

These properties are mapped and normalized to your relational schema: Articles, Authors, Journals, Subjects, Keywords.

---

## 📐 Database Schema Reference

See [`schema.sql`](./schema.sql) for a detailed MySQL schema, including normalized tables for articles, authors, journals, subjects, keywords, and their many-to-many relations.

---

## 📦 API Response Object Schemas

Defined in: `src/schemas.ts`

Includes strict TypeScript interfaces for:
- Article
- Author
- Journal
- Subject
- Keyword

Ensures structural consistency across:
- Database rows
- API responses
- Frontend consumption

**Raw CORE Article Example (for ETL):**
```json
{
  "id": "string",
  "title": "string",
  "authors": [
    {
      "name": "string",
      "affiliation": "string | null"
    }
  ],
  "year": 2020,
  "venue": "string | null",
  "citationCount": 42,
  "references": ["id1", "id2"]
}
```
*The ETL pipeline transforms and loads these into Articles, Authors, Journals, Subjects, Keywords, and relevant relation tables.*

---

## ✅ Verification and Notes

- **Verify**: After ETL, use SQL to check row counts for all tables.
- **Performance**: For large-scale loads, batching or parallel processing may be needed.
- **Normalization**: All data cleaning and normalization are performed during ETL.
- **MySQL**: Ensure your MySQL server and credentials are set correctly.

---

## 📝 Summary

- ✔️ Robust MySQL communication
- ✔️ Flexible query builder architecture
- ✔️ Modular search modules for all entities
- ✔️ Complete REST API and endpoint coverage
- ✔️ Strict TypeScript schemas
- ✔️ End-to-end ETL and data normalization
- ✔️ Clean, scalable folder structure

This backend is production-grade, ready for extension, and fully compatible with any frontend research platform.




## 🧰 Database Setup

The project uses **MySQL 8+** as the reference database.

### Local MySQL (Windows / Linux)

CREATE DATABASE coredb;

mysql -u root -p coredb < core/schema.sql

### MySQL via Docker (Linux)

docker run -d --name taai-mysql \
  -e MYSQL_ROOT_PASSWORD=rootpass \
  -e MYSQL_DATABASE=coredb \
  -e MYSQL_USER=app \
  -e MYSQL_PASSWORD=app_pass \
  -p 3307:3306 \
  mysql:8

docker exec -i taai-mysql mysql -u root -prootpass coredb < core/schema.sql
