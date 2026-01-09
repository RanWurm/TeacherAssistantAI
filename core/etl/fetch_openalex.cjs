/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

const BASE = "https://api.openalex.org";
const CORE_DIR = path.join(__dirname, ".."); // => core/
const RAW_DIR = path.join(CORE_DIR, "data", "openalex_raw");
const STATE_DIR = path.join(CORE_DIR, "data", "openalex_state");

const SUBJECTS = [
  "Medicine","Biology","Computer science","Engineering","Physics","Chemistry","Mathematics",
  "Psychology","Environmental science","Materials science","Economics","Business","Political science",
  "Sociology","Education","Geography","History","Philosophy","Art","Law",
  "Agricultural and food sciences","Earth sciences","Neuroscience","Public health",
  "Mechanical engineering","Electrical engineering","Artificial intelligence","Data science",
  "Linguistics","Anthropology"
];

const TARGET_TOTAL = 100000;
const PER_PAGE = 200;
const POLITE_DELAY_MS = 150;
const MAILTO = process.env.OPENALEX_MAILTO || "";

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function httpGetJson(url) {
  const res = await fetch(url, { headers: { "User-Agent": "TeacherAssistantAI-ETL" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function resolveConceptId(subjectName) {
  const q = new URLSearchParams({ search: subjectName, per_page: "5" });
  if (MAILTO) q.set("mailto", MAILTO);

  const data = await httpGetJson(`${BASE}/concepts?${q.toString()}`);
  const first = data?.results?.[0];
  if (!first?.id) throw new Error(`Could not resolve concept for subject="${subjectName}"`);
  return first.id; // https://openalex.org/C...
}

function statePath(subjectName) {
  return path.join(STATE_DIR, `${subjectName.replaceAll(" ", "_")}.json`);
}

function rawPath(subjectName) {
  return path.join(RAW_DIR, `${subjectName.replaceAll(" ", "_")}.jsonl`);
}

function loadState(subjectName) {
  const p = statePath(subjectName);
  if (!fs.existsSync(p)) return { cursor: "*", pulled: 0, conceptId: null };
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

function saveState(subjectName, state) {
  fs.writeFileSync(statePath(subjectName), JSON.stringify(state, null, 2));
}

function appendJsonl(subjectName, obj) {
  fs.appendFileSync(rawPath(subjectName), JSON.stringify(obj) + "\n");
}

async function fetchWorksByConcept(conceptId, cursor) {
  const qs = new URLSearchParams({
    filter: `concept.id:${conceptId}`,
    per_page: String(PER_PAGE),
    cursor: cursor || "*",
  });
  if (MAILTO) qs.set("mailto", MAILTO);

  return httpGetJson(`${BASE}/works?${qs.toString()}`);
}

async function main() {
  ensureDir(RAW_DIR);
  ensureDir(STATE_DIR);

  let totalPulled = 0;
  const quotaPerSubject = Math.ceil(TARGET_TOTAL / SUBJECTS.length);

  for (const subject of SUBJECTS) {
    const st = loadState(subject);

    if (!st.conceptId) {
      try {
        st.conceptId = await resolveConceptId(subject);
      } catch (e) {
        console.warn(`Skipping subject "${subject}"`);
        continue;
      }      
      saveState(subject, st);
    }

    while (st.pulled < quotaPerSubject && totalPulled < TARGET_TOTAL) {
      const page = await fetchWorksByConcept(st.conceptId, st.cursor);
      const results = page?.results || [];
      if (results.length === 0) break;

      for (const w of results) {
        const oaUrl = w.best_oa_location?.pdf_url 
           || w.primary_location?.pdf_url 
           || w.open_access?.oa_url;
        if (!oaUrl) {
          continue
        }else{
          appendJsonl(subject, w);
          st.pulled += 1;
          totalPulled += 1;
          if (st.pulled >= quotaPerSubject || totalPulled >= TARGET_TOTAL) break;
      }
    }

      st.cursor = page?.meta?.next_cursor || null;
      saveState(subject, st);

      if (!st.cursor) break;
      await sleep(POLITE_DELAY_MS);
    }

    console.log(`Done subject="${subject}" pulled=${st.pulled}`);
    if (totalPulled >= TARGET_TOTAL) break;
  }

  console.log(`TOTAL pulled: ${totalPulled}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
