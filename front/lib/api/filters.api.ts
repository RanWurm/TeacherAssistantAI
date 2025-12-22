import { apiRequest } from "./client";

export function fetchSubjects(q: string, limit = 50, offset = 0) {
  const params = new URLSearchParams();

  if (q.trim()) {
    params.set("q", q);
  }
  params.set("limit", String(limit));
  params.set("offset", String(offset));

  const queryString = params.toString();

  return apiRequest<string[]>(
    `/api/filters/subjects${queryString ? `?${queryString}` : ""}`,
    "GET"
  ).then(res => {
    return res;
  }).catch(error => {
    console.error(`[filters.api] fetchSubjects error:`, error);
    throw error;
  });
}


export function fetchAuthors(q: string, limit = 50, offset = 0) {
  const params = new URLSearchParams();

  if (q.trim()) {
    params.set("q", q);
  }
  params.set("limit", String(limit));
  params.set("offset", String(offset));

  const queryString = params.toString();

  return apiRequest<string[]>(
    `/api/filters/authors${queryString ? `?${queryString}` : ""}`,
    "GET"
  ).then(res => {
    return res;
  }).catch(error => {
    console.error(`[filters.api] fetchAuthors error:`, error);
    throw error;
  });
}

export function fetchKeywords(q: string, limit = 50, offset = 0) {
  const params = new URLSearchParams();

  if (q.trim()) {
    params.set("q", q);
  }

  params.set("limit", String(limit));
  params.set("offset", String(offset));

  const queryString = params.toString();

  return apiRequest<string[]>(
    `/api/filters/keywords${queryString ? `?${queryString}` : ""}`,
    "GET"
  ).then(res => {
    return res;
  }).catch(error => {
    console.error(`[filters.api] fetchKeywords error:`, error);
    throw error;
  });
}
