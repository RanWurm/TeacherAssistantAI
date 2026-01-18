
# Frontend Usage Guide

This guide describes the academic analytics web frontend, designed to be user-friendly and powerful for exploration, searching, and statistical insight. The system is built for ease of use by students and researchers at all technical levels.

---

## Application Pages & Features

### 1. Home (`/`)

- **Conversational Search:**  
  Provides a chat-based entry point where users can ask questions, explore research topics, or get help with academic discovery.
- **Smart Agent:**  
  An AI-powered assistant guides users in formulating queries or navigating the platform. The agent logic is handled separately from the main interface to keep the user experience smooth.
- **Quick Start Links:**  
  Prominent buttons or suggestions direct users toward common actions, such as searching articles, viewing insights, or asking about research topics.

---

### 2. Search (`/search`)

The search page is the primary tool for finding scholarly content.

#### a. Criteria-Based Search
- Users can filter academic articles using multiple facets:
  - **Subject (discipline)**
  - **Author**
  - **Publication year**
  - **Keyword**
  - **Language**
- Supports live filtering, result previews, and result pagination for browsing large datasets.
- Results display key metadata, author lists, subjects, and direct links to the full articles.

#### b. Direct Name Search
- Users can search directly by the name of an article, author, or journal.
- Autocomplete and instant feedback are provided as users type, making it fast to jump to exact matches.
- Results show entity-specific details (e.g., author affiliations, journal metrics).

- Both search modes support sorting (e.g., by publication year or citation count) and can be combined for flexible exploration.

---

### 3. Insights (`/insights`)

The Insights section enables visual and statistical exploration of the research landscape through interactive dashboards and charts, structured into five sub-sections:

- **General Overview Statistics:**  
  Summary counts (articles, authors, journals), quick facts, and at-a-glance trends.
- **Topic and Subject Trends:**  
  Visualization of subject popularity and how research topics have evolved over time.
- **Leading Researchers:**  
  Rankings and profiles of prolific or multidisciplinary researchers, based on publication count and citation metrics. Includes affiliation and research area breakdowns.
- **Journal-Level Statistics:**  
  Comparative charts and rankings for journals based on impact, article count, and subject coverage.
- **Cross-Dimensional Analysis:**  
  Matrix or heatmap visualizations, e.g., subject × year, or keyword × journal, for deeper analytical insights.

These sections help users:

- Identify emerging or popular fields
- Discover influential journals and researchers
- Analyze historical trends in academic output
- Find interdisciplinary connections between topics

---

## Intended Audience

The frontend is tailored for:

- Undergraduate students seeking an introduction to research fields
- Graduate students needing in-depth literature reviews and analytics
- Early-stage researchers conducting literature surveys or journal scouting
- Faculty advisors or educators supporting student research

No previous technical or programming knowledge is required. The interface is intuitive and fully accessible via the browser.

---

## Design Principles

- **Simple Navigation:**  
  Logical and minimal UI with clear page separation; navigation bars and breadcrumbs support orientation.
- **Data-Driven Exploration:**  
  Emphasis on discovery via statistics, charts, filters, and rich metadata, not just search results.
- **Separation of Concerns:**  
  Search tools (precise, criteria-driven, or name-based) are distinct from analytic dashboards, helping users focus on their current task.
- **Accessibility & Responsiveness:**  
  Fully responsive layout (desktop and mobile), keyboard-accessible, and usable for all users.
- **Performance:**  
  Supports large-scale data without noticeable delay via server-side filtering, pagination, and optimized queries.

---

For more implementation details, see the [Project Structure](README.md).