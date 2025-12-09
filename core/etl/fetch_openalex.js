// fetch_openalex.js
import fs from "fs";
import fetch from "node-fetch";

const QUERY = "machine learning";     // לשנות למה שאתה רוצה
const PER_PAGE = 200;                 // המקסימום של OpenAlex
const MAX_RESULTS = 10000;            // הגבלה שלך
const SAVE_PATH = "data/openalex_raw.json";

// Mailto — חובה לשים משהו פורמלי, אבל לא אמיתי
const MAILTO = "openalex@test.com";

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function fetchPage(cursor) {
  const url = `https://api.openalex.org/works?filter=title.search:${encodeURIComponent(
    QUERY
  )}&per-page=${PER_PAGE}&cursor=${cursor}&mailto=${MAILTO}`;

  const res = await fetch(url);

  if (res.status === 429) {
    console.log("⚠ Rate limit — waiting 3 seconds…");
    await delay(3000);
    return fetchPage(cursor);
  }

  if (!res.ok) {
    console.log("HTTP error:", res.status);
    return null;
  }

  return await res.json();
}

async function main() {
  console.log(`🚀 Fetching OpenAlex works for query: "${QUERY}"\n`);

  let results = [];
  let cursor = "*";   // OpenAlex uses "*" as starting cursor

  while (results.length < MAX_RESULTS) {
    console.log(`→ Fetching page, cursor = ${cursor}`);

    const data = await fetchPage(cursor);
    if (!data || !data.results || data.results.length === 0) break;

    results.push(...data.results);

    console.log(`Collected: ${results.length}`);

    if (!data.meta.next_cursor) break;
    cursor = data.meta.next_cursor;

    await delay(400);
  }

  // Save
  fs.writeFileSync(SAVE_PATH, JSON.stringify(results, null, 2));
  console.log(`\n✔ Saved ${results.length} results → ${SAVE_PATH}\n`);
}

main();
