import pdf from "pdf-parse";
import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const PDF_DOWNLOAD_DIR = "/tmp/teacher-assistant-pdfs";
const UNPAYWALL_EMAIL = "teacher-assistant@example.com";

// ─────────────────────────────────────────────────────────────
// PDF Fetching and Extraction
// ─────────────────────────────────────────────────────────────

const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10MB limit
const FETCH_TIMEOUT = 120000; // 2 minutes

interface PdfResult {
  text: string;
  pages_extracted: number;
  total_pages: number;
  truncated: boolean;
  error?: string;
}

/**
 * Resolve DOI to direct PDF URL using Unpaywall
 */
export async function resolveDOItoPDF(doi: string): Promise<string | null> {
  try {
    const cleanDoi = doi
      .replace(/^https?:\/\/doi\.org\//, '')
      .replace(/^doi:/, '')
      .trim();

    const url = `https://api.unpaywall.org/v2/${cleanDoi}?email=${UNPAYWALL_EMAIL}`;
    
    const response = await fetch(url, { 
      headers: { "User-Agent": "TeacherAssistantAI/1.0" }
    });

    if (!response.ok) {
      console.log(`[PDF] Unpaywall returned ${response.status} for DOI: ${cleanDoi}`);
      return null;
    }

    const data = await response.json();

    if (data.best_oa_location?.url_for_pdf) {
      return data.best_oa_location.url_for_pdf;
    }

    for (const location of data.oa_locations || []) {
      if (location.url_for_pdf) {
        return location.url_for_pdf;
      }
    }

    console.log(`[PDF] No open access PDF found for DOI: ${cleanDoi}`);
    return null;
  } catch (err) {
    console.error(`[PDF] Error resolving DOI:`, err);
    return null;
  }
}

export async function fetchAndExtractPdf(
  url: string,
  maxPages: number = 1
): Promise<PdfResult> {
  try {
    // If it's a DOI, try to resolve to PDF first
    if (url.includes('doi.org') || url.startsWith('10.')) {
      console.log(`[PDF] Detected DOI, resolving via Unpaywall...`);
      const pdfUrl = await resolveDOItoPDF(url);
      if (pdfUrl) {
        console.log(`[PDF] Resolved to: ${pdfUrl}`);
        url = pdfUrl;
      } else {
        return {
          text: "",
          pages_extracted: 0,
          total_pages: 0,
          truncated: false,
          error: "No open access PDF available for this paper. The URL is a DOI/landing page, not a direct PDF link.",
        };
      }
    }

    // Ensure download directory exists
    await fs.mkdir(PDF_DOWNLOAD_DIR, { recursive: true });

    // Generate unique filename
    const filename = `pdf_${Date.now()}_${Math.random().toString(36).slice(2)}.pdf`;
    const filepath = path.join(PDF_DOWNLOAD_DIR, filename);

    // Download with curl (follows redirects)
   try {
  await execAsync(
    `curl -L -o "${filepath}" -m 120 -A "TeacherAssistantAI/1.0" "${url}"`,
    { timeout: 130000 }
  );
  } catch (err) {
    // Check if partial download exists
    const partialStats = await fs.stat(filepath).catch(() => null);
    if (!partialStats || partialStats.size === 0) {
      return {
        text: "",
        pages_extracted: 0,
        total_pages: 0,
        truncated: false,
        error: "Failed to download PDF",
      };
    }
    // Continue with partial file if it exists
  }

    // Check if file exists and is valid
    const stats = await fs.stat(filepath).catch(() => null);
    if (!stats || stats.size === 0) {
      await fs.unlink(filepath).catch(() => {});
      return {
        text: "",
        pages_extracted: 0,
        total_pages: 0,
        truncated: false,
        error: "Download failed or empty file",
      };
    }

    if (stats.size > MAX_PDF_SIZE) {
      await fs.unlink(filepath).catch(() => {});
      return {
        text: "",
        pages_extracted: 0,
        total_pages: 0,
        truncated: false,
        error: "PDF file too large (>10MB)",
      };
    }

    // Read the file
    const buffer = await fs.readFile(filepath);

    // Verify it's a PDF
    if (!buffer.slice(0, 5).toString().includes("%PDF")) {
      await fs.unlink(filepath).catch(() => {});
      return {
        text: "",
        pages_extracted: 0,
        total_pages: 0,
        truncated: false,
        error: "Downloaded file is not a valid PDF",
      };
    }

    // Clean up file after reading
    await fs.unlink(filepath).catch(() => {});

    // Parse with page limit
    const data = await pdf(buffer, {
      max: maxPages,
    });

    // Truncate text if too long (token budget)
    const maxChars = 4000;
    let text = data.text.trim();
    const truncated = text.length > maxChars;

    if (truncated) {
      text = text.slice(0, maxChars) + "\n\n[... content truncated for token budget ...]";
    }

    return {
      text,
      pages_extracted: Math.min(maxPages, data.numpages),
      total_pages: data.numpages,
      truncated,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";

    if (message.includes("aborted")) {
      return {
        text: "",
        pages_extracted: 0,
        total_pages: 0,
        truncated: false,
        error: "Request timed out",
      };
    }

    return {
      text: "",
      pages_extracted: 0,
      total_pages: 0,
      truncated: false,
      error: `PDF extraction failed: ${message}`,
    };
  }
}

// ─────────────────────────────────────────────────────────────
// Text Utilities
// ─────────────────────────────────────────────────────────────

export function extractAbstract(text: string): string | null {
  const patterns = [
    /abstract[:\s]*\n?([\s\S]*?)(?=\n\s*(?:introduction|keywords|1\.|background))/i,
    /abstract[:\s]*\n?([\s\S]{100,1500}?)(?=\n\n)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      return match[1].trim().slice(0, 1500);
    }
  }

  return text.slice(0, 1000) + (text.length > 1000 ? "..." : "");
}

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}