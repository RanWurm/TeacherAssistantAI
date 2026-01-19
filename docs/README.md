# TeacherAssistantAI

TeacherAssistantAI is a platform that helps **students discover new research ideas** by enabling the search, analysis, and exploration of academic literature at scale.

The platform ingests academic metadata from **OpenAlex**, stores it in a normalized MySQL database, and provides search and analytics through a modern web interface.

---

## 🎯 Project Motivation

Students often face difficulty in identifying:
- Relevant research domains
- Emerging topics
- Influential journals and researchers

TeacherAssistantAI addresses these challenges by providing:
- Structured academic search
- Statistical insights across disciplines
- A foundation for AI-assisted research exploration

---

## 🏗️ High-Level Architecture

```
[ Frontend (Next.js) ]
        |
        v
[ Backend API (Node.js / TypeScript) ]
        |                    |
        v                    v
[ MySQL Database ]    [ LLM (AI Model) ]
        ^
        |
[  ETL Pipeline   ]
(OpenAlex → MySQL)
---------------------------
```

- The backend handles all communication with the frontend, the MySQL database (for querying and analytics), and the LLM (for AI-driven chat, explanations, and research assistance).
- The frontend accesses the system exclusively via the backend API.
- The ETL pipeline ingests and normalizes academic data from OpenAlex into MySQL.
- The backend is responsible for querying, aggregation, and filtering of data.

---

## 🧰 Tech Stack

- **Frontend:** Next.js (React)
- **Backend:** Node.js + TypeScript (Express)
- **Database:** MySQL 8+
- **Data Source:** OpenAlex
- **ETL:** Node.js scripts
- **Visualization:** Frontend charts & statistics

---

## 📂 Project Structure

```
TeacherAssistantAI/
│
├── core/
│   ├── backend/             # API server (Express + TypeScript)
│   │   └── src/
│   │       ├── agent/       # LLM, chat/agent logic
│   │       ├── controllers/ # REST API controllers
│   │       ├── db/          # Database logic & queries
│   │       ├── routes/      # Express route handlers
│   │       ├── services/    # Service/business logic layer
│   │       ├── types/       # Shared TypeScript types
│   │       └── validation/  # Validation logic (schemas, input)
│   ├── etl/                 # OpenAlex ingestion scripts
│   ├── data/                # Raw/state ETL files
│   └── schema.sql           # Database schema
├── front/                     # Next.js frontend
│   ├── app/                   # Application routes & layouts (Next.js app router)
│   │   ├── chat/              # Chat page
│   │   ├── insights/          # Insights/statistics page
│   │   ├── search/            # Search page
│   │   ├── layout.tsx         # App root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # Reusable React components
│   ├── hooks/                 # React hooks
│   ├── i18n/                  # Internationalization config
│   ├── lib/                   # Utility libraries
│   ├── styles/                # CSS/SCSS files
│   ├── .env.local             # Local environment variables
│
├── docs/                    # Documentation
│   ├── backend-api.md
│   ├── data-model.md
│   ├── frontend-guide.md
│   ├── README.md
│   └── Schema.drawio.png
│
└── assets/
    └── screenshots/ # UI screenshots
```

### 🖼️ Screenshots

Place screenshots in:

```
assets/screenshots/
```

Example:

![Search Page](assets/screenshots/search.png)

---

## 📚 Documentation

See:
- Backend API (docs/backend-api.md)
- Frontend Guide (docs/frontend-guide.md)
- Installation Guide (docs/installation-and-setup.md)
---
