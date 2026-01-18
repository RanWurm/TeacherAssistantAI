// fetch_core.js
import fs from "fs";
import fetch from "node-fetch";

const LIMIT = 100;
const MAX_RESULTS = 10000;
const QUERY = "machine learning"; // you can change this to your desired query

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function fetchPage(offset) {
  const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(
    QUERY
  )}&limit=${LIMIT}&offset=${offset}&fields=title,abstract,authors,year,venue,citationCount,openAccessPdf`;

  const res = await fetch(url, {
    headers: { "User-Agent": "research-assistant/1.0" }
  });

  if (res.status === 429) {
    console.log("⚠ Rate limit — waiting...");
    await delay(3000);
    return fetchPage(offset);
  }

  if (!res.ok) {
    console.log("HTTP error:", res.status);
    return [];
  }

  const json = await res.json();
  return json.data || [];
}

async function main() {
  let results = [];

  for (let offset = 0; offset < MAX_RESULTS; offset += LIMIT) {
    console.log(`→ offset ${offset}`);

    const batch = await fetchPage(offset);
    if (batch.length === 0) break;

    results.push(...batch);

    console.log(`collected: ${results.length}`);

    await delay(400);
  }

  fs.writeFileSync("data/core_raw.json", JSON.stringify(results, null, 2));
  console.log(`\n✔ Saved ${results.length} results → data/core_raw.json`);
}

main();
