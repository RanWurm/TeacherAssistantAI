# Backend API Documentation

This document describes the REST API exposed by the TeacherAssistantAI backend.

The API provides search, filtering, and analytics capabilities over a large-scale academic dataset ingested from **OpenAlex** and stored in a normalized MySQL database.

> **Note:** There is currently **no authentication** layer. All endpoints are publicly accessible.

---

## Base URL

```
http://localhost:3001/api
```

All endpoints return JSON responses.

---

## Articles

### Search Articles

```
POST /articles/search
```

Search for academic articles using multiple optional filters.

#### Request Body

```json
{
  "keyword": "machine learning",
  "author": "Smith",
  "subject": "biology",
  "fromYear": 2018,
  "toYear": 2024,
  "language": "en",
  "type": "journal-article",
  "limit": 10,
  "offset": 0
}
```

#### Supported Filters

| Field     | Type    | Description                         |
| --------- | ------- | ----------------------------------- |
| keyword   | string  | Keyword contained in the article    |
| author    | string  | Author name (partial match)         |
| subject   | string  | Subject name                        |
| fromYear  | number  | Start publication year              |
| toYear    | number  | End publication year                |
| language  | string  | Article language                    |
| type      | string  | Article type                        |
| limit     | number  | Page size                           |
| offset    | number  | Pagination offset                   |

#### Response Example

```json
{
  "results": [
    {
      "article_id": 4123,
      "openalex_id": "W1234567890",
      "title": "Machine Learning in Biology",
      "year": 2021,
      "language": "en",
      "type": "journal-article",
      "citation_count": 29,
      "journal": {
        "journal_id": 51,
        "name": "Journal of Bioinformatics",
        "publisher": "Springer",
        "impact_factor": null
      },
      "authors": [
        {
          "author_id": 932,
          "name": "John Smith",
          "affiliation": "Cambridge University"
        }
      ],
      "subjects": ["Biology", "Artificial Intelligence"],
      "keywords": ["gene expression", "neural networks"],
      "article_url": "https://doi.org/xxx/yyyy"
    }
    // ...more articles
  ],
  "total": 84,
  "limit": 10,
  "offset": 0
}
```

---

## Filters

Filters endpoints are used to populate dropdowns and UI selectors in the frontend.

**Get Subjects**

```
GET /filters/subjects
```

Returns a list of all available subjects.

**Get Authors**

```
GET /filters/authors
```

Returns a list of authors.

**Get Keywords**

```
GET /filters/keywords
```

Returns a list of keywords.

_All filter endpoints return JSON arrays (optionally paginated), for example:_
```json
["Biology", "Machine Learning", "Genomics", "Neuroscience"]
```

---

## Insights & Analytics

Insights endpoints return aggregated and statistical views over the dataset.

All insights endpoints use POST requests and may accept filter parameters in the request body.

### Overview Insights

```
POST /insights/overview
```

Returns high-level statistics such as:

- Total articles
- Total authors
- Total journals
- Distribution over years

#### Example Request

```json
{
  "subject": "Artificial Intelligence",
  "fromYear": 2020,
  "toYear": 2023
}
```

#### Example Response

```json
{
  "totalArticles": 1321,
  "totalCitations": 52038,
  "topAuthors": [],
  "topJournals": []
}
```

### Trends Insights

```
POST /insights/trends
```

Returns trend data over time, typically grouped by subject, year, and article count.
Used to identify emerging or declining research topics.

### Researchers Insights

```
POST /insights/researchers
```

Returns statistics related to researchers, such as:

- Most active authors
- Publication counts
- Citation-based metrics

### Journals Insights

```
POST /insights/journals
```

Returns journal-level analytics, including:

- Article volume
- Citation aggregates
- Subject coverage

### Cross-Dimensional Insights

```
POST /insights/cross
```

Returns cross-entity analytics combining multiple dimensions, such as:

- Subject × Year
- Journal × Subject
- Author × Subject

---

## Chat Endpoints (Session-Based)

The backend includes session-based chat endpoints used by the frontend.

> **Important:** The internal agent/orchestrator logic is not documented here and is handled in a dedicated module.

### Send Chat Message

```
POST /chat
```

**Request Body**
```json
{
  "message": "Show me emerging topics in computer science",
  "session_id": "default"
}
```
**Response**
```json
{
  "message": "Here are several rapidly growing research areas...",
  "intent": "research_exploration",
  "confidence": 0.91,
  "steps_executed": ["analyze_trends", "rank_subjects"],
  "tokens": 742,
  "session_id": "default",
  "debug": {}
}
```

### Clear Chat Session

```
POST /chat/clear
```

**Request Body**
```json
{
  "session_id": "default"
}
```
Clears the stored conversation history for the given session.

### Get Chat History

```
GET /chat/history/:session_id
```

Returns the full message history for a session.

---

## Error Handling

All errors are returned as JSON.
- HTTP status codes are used appropriately.
- Validation errors return 400.
- Server errors return 500.

**Example error response:**

```json
{
  "error": "Message is required"
}
```

---

## Notes

- Pagination is supported using `limit` and `offset`.
- All endpoints return structured JSON.
- API is designed to be easily extensible to additional entities and analytics.
