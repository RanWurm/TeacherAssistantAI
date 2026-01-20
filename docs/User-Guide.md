# 📘 User Guide

## 1. System Overview

The system is intended for students, researchers, and academic users who wish to explore research trends and relevant literature.

This academic research assistant helps users to:

- **Search and filter academic papers**
- **Explore statistical insights** on a vast scholarly dataset
- **Interact with an AI research agent** for research idea generation and literature retrieval

The platform is fully web-based, composed of a frontend application and a backend server.

---

## 2. System Requirements & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/)
- [MySQL](https://www.mysql.com/) (running locally)
- Environment variables configured (`.env` file)

### Running the System

To run the system locally, follow these steps (see `installation-and-setup.md` for detailed guidance):

1. **Create the MySQL database**
2. **Set up the database schema**
3. **Configure backend environment variables**
4. **Fetch and load OpenAlex data** (ETL pipeline)

5. **Install and start the backend server**
   ```sh
   cd core/backend
   npm install
   npm run dev   # Runs backend at http://localhost:3001
   ```
6. **Install and start the frontend client**:
   ```sh
   cd front
   npm install
   npm run dev   # Runs frontend at http://localhost:3000
   ```

> **Note:** Keep both backend and frontend servers running for full app functionality.

- The **backend** exposes REST APIs and the AI agent interface.
- The **frontend** connects to these APIs for data and agent features.

## 3. Main User Flows

## 3.0 Main Entry Point

When opening the application, users are presented with the chat page.
From there, they can either:
- Start a conversation with the AI assistant
- Navigate to the Search page
- Navigate to the statistics dashboard

---

### 3.1 AI Chat Agent – Research Idea Assistant

Use the chat interface to interact with the AI agent.

**Capabilities:**
- Generate novel research ideas
- Retrieve relevant papers
- Run advanced analytical queries
- Summarize existing literature
- Guide exploratory research

The agent operates through predefined tools and has controlled access to the database.

<div align="center">
<img width="1254" height="903" alt="chat page" src="https://github.com/user-attachments/assets/0634dcca-a7a0-4e66-b49a-11a8701912f4" />

</div>

---

### 3.2.1 Search by Criteria

Use this flow to search for academic papers based on general research topics or various filters.

**Steps:**
1. Navigate to the search page.
3. Refine results using filters, such as:
   - Subject(s)
   - Author(s)
   - Keyword(s)
   - Publication type
   - Language
   - Year range
4. Apply filters.
5. View ranked results (by citations, year).

**Displayed fields:**
- Paper title
- Publication year
- Citation count
- Source
- PDF/URL (if available)
- Subjects
- Keyword
- Language
- Type


<div align="center">
<img width="1268" height="905" alt="search page" src="https://github.com/user-attachments/assets/63bcb7cb-440d-4450-b7c3-1da0b2228171" />

</div>

---

### 3.2.2 Search by Title

Use this flow to find papers by specific authors or by keywords.

**Steps:**
1. Navigate to the search page.
2. Select the "Search by Title" option or use the author/keyword input.
3. Enter the author name or keyword of interest.
4. (Optionally) Refine results by year, publication type, or other filters.
5. View relevant papers written by the selected author or matching the keyword.

**Displayed fields:**
- Paper title
- Publication year
- Citation count
- Source
- PDF/URL (if available)
- Subjects
- Keyword
- Language
- Type

<div align="center">
<img width="1260" height="624" alt="search by title page" src="https://github.com/user-attachments/assets/5b2c6916-36e6-4d84-9006-ff254fc5b43c" />

</div>

---

### 3.3 Viewing Statistics & Insights

The statistics dashboard is organized into analytical sections.

**Year-based filtering options:**
- Last year
- Last 3 years
- Last 5 years
- All years

**Insights include:**
- Publication timelines
- Top sources by impact score
- Multidisciplinary vs. single-subject trends
- Keyword trends and growth
- Subject–source heatmaps
- Most cited authors and institutions

<div align="center">
<img width="1709" height="1080" alt="image" src="https://github.com/user-attachments/assets/62723fdb-4d47-45e8-a9a8-99a0ae108202" />
</div>

---

## 4. Example Usage Scenario

1. User explores trends in a research area.
2. Identifies emerging keywords or subjects.
3. Uses the AI agent to propose a novel research idea.
4. Retrieves supporting academic papers.

---
