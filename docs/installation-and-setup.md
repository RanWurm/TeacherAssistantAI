# 🚀 Installation & Setup

This document explains how to **set up, build, and run** the TeacherAssistantAI project locally.  
**Note:** On the BIU server, the database is named `db06` instead of `teacher_assistant_ai`.

---

## 📋 Prerequisites

Ensure you have the following installed:

- **Node.js** 18 or newer
- **MySQL** 8 or newer
- **npm**
- MySQL Workbench or any MySQL client (must have at least one)

---

## 🗄️ Database Setup

### 1. Create the Database

In MySQL CLI or MySQL Workbench, run:

```sql
CREATE DATABASE teacher_assistant_ai;
USE teacher_assistant_ai;
```

> **Note:** If you are setting up the project on the BIU server, use `db06` as the database name:
> ```sql
> CREATE DATABASE db06;
> USE db06;
> ```

### 2. Create Schema

To set up the database structure, you need to execute the schema file that creates all the required tables and indexes. In your MySQL client (such as MySQL CLI or MySQL Workbench), run the `core/schema.sql` file against the `teacher_assistant_ai` database  
(**or `db06` on the BIU server**).

If you are using the MySQL command line, you can do this by running:

```sh
mysql -u root -p teacher_assistant_ai < core/schema.sql
```

> **Note:** On the BIU server, use:
> ```sh
> mysql -u root -p db06 < core/schema.sql
> ```

After you enter your MySQL password, this command will load and execute all the SQL statements in `core/schema.sql`, creating the tables, relationships, and indexes needed for the project. Make sure your current directory is the project root (so that the path to `core/schema.sql` is correct), or adjust the path as necessary.

This schema sets up the following tables:

- **Sources**: Information about publication sources
- **Articles**: Stores articles and metadata
- **Authors**: Stores author details
- **Subjects**: Controlled vocabulary for classification
- **Keywords**: For tagging articles
- **Institutions**: For author affiliations
- **Relation Tables** (many-to-many relationships):
  - ArticlesAuthors (links articles and authors)
  - ArticlesSubjects (links articles and subjects)
  - ArticlesKeywords (links articles and keywords)
  - ArticleAuthorInstitutions (links articles, authors, and institutions)
- **ArticleViews**: Tracks how often articles are viewed

All relevant indexes and uniqueness constraints are also created.

---

## ⚙️ Backend Configuration

### 3. Environment Variables

Create a `.env` file inside `core/backend/` with:

```
DB_HOST=localhost
DB_USER=root
DB_PASS=YOUR_PASSWORD
DB_NAME=teacher_assistant_ai
PORT=3001
DB_PORT=3306

# CORS_ORIGIN allows you to specify which frontend URLs can connect to the backend API.
# Use a comma-separated list for multiple origins. For local development, keep as below.
CORS_ORIGIN=http://localhost:3000

# GROQ_API_KEY is required for agent features. 
# Set your GROQ API key to enable LLM/AI functionality in the agent.
GROQ_API_KEY=your_groq_api_key_here

```

> **Important:**  
> On the BIU server, use `db06` for `DB_NAME`:
> ```
> DB_NAME=db06
> ```

---

## 🔄 ETL Pipeline (OpenAlex → MySQL)

The ETL process has two steps.

### 4. Fetch Data from OpenAlex

Downloads raw academic metadata and stores it locally.

```sh
node core/etl/fetch_openalex.cjs
```

Output files:  
`core/data/openalex_raw/*.jsonl`

### 5. Load Data into MySQL

Normalizes and loads the fetched data into the database.

```sh
node core/etl/load_openalex_to_mysql.cjs
```

### 6. Verify Data Load (Optional)

To check if data loaded successfully, run in MySQL:

```sql
USE teacher_assistant_ai;

SELECT COUNT(*) FROM Articles;
SELECT COUNT(*) FROM Authors;
SELECT COUNT(*) FROM Journals;
SELECT COUNT(*) FROM Subjects;
SELECT COUNT(*) FROM Keywords;
```

> **Note:** If you are on the BIU server, replace `teacher_assistant_ai` with `db06`:
> ```sql
> USE db06;
> ```

---

## 🧠 Running the Backend Server

### 7. Install Backend Dependencies

```sh
cd core/backend
npm install
```

### 8. Start Backend Server

```sh
npm run dev
```

Backend available at:  
http://localhost:3001

#### Health Check

Test server status:

```http
GET http://localhost:3001/api/health
```

Expected response:

```json
{
  "status": "ok"
}
```

---

## 🖥️ Running the Frontend

### 9. Install Frontend Dependencies

```sh
cd front
npm install
```

### 10. Start the Frontend in Development Mode

To start the frontend with hot-reloading for development, run:

```sh
npm run dev
```

Frontend will be available at:  
http://localhost:3000

### 11. Production Build (Optional)

To build the frontend for production deployment:

```sh
npm run build
```

You can then serve the production build locally with:

```sh
npm start
```

Frontend available at:  
http://localhost:3000

---

## 📡 API Testing (Optional)

The project includes ready-to-use API test requests at:

```
core/backend/test_api.http
```

You can run these with:

- VSCode REST Client extension
- Insomnia
- Postman

---

## ✅ Summary

To run the project end-to-end:

1. Create the database (`teacher_assistant_ai`, or `db06` on the BIU server)
2. Run schema.sql
3. Configure backend `.env` (set `DB_NAME` appropriately for your environment)
4. Run ETL (fetch + load)
5. Start backend
6. Start frontend

You should now have a fully working local instance of TeacherAssistantAI.
