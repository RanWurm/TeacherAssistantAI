# 🚀 Installation & Setup

This document explains how to **set up, build, and run** the TeacherAssistantAI project locally.

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

### 2. Create Schema

The database schema defines all required tables. Run:

```sh
mysql -u root -p teacher_assistant_ai < core/schema.sql
```

This creates tables for:

- Articles
- Authors
- Journals
- Subjects
- Keywords
- Relation tables (many-to-many)

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

# CORS_ORIGIN allows you to specify which frontend URLs can connect to the backend API.
# Use a comma-separated list for multiple origins. For local development, keep as below.
CORS_ORIGIN=http://localhost:3000

# GROQ_API_KEY is required for agent features. 
# Set your GROQ API key to enable LLM/AI functionality in the agent.
GROQ_API_KEY=your_groq_api_key_here

```

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

### 10. Start Frontend Server

```sh
npm run dev
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

1. Create the database
2. Run schema.sql
3. Configure backend `.env`
4. Run ETL (fetch + load)
5. Start backend
6. Start frontend

You should now have a fully working local instance of TeacherAssistantAI.