import { NextResponse } from "next/server";

const BACKEND_BASE = process.env.BACKEND_BASE_URL || "http://localhost:3001";
const AGENT_URL = `${BACKEND_BASE}/agent/ask`;

export async function POST(req: Request) {
  try {
    const body = await req.json(); // מצפה: { message: "..." }

    const r = await fetch(AGENT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await r.json().catch(async () => ({ answer: await r.text() }));

    if (!r.ok) {
      return NextResponse.json(
        { error: "Agent request failed", status: r.status, body: data },
        { status: 502 }
      );
    }

    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json(
      { error: "Proxy error", message: e?.message || String(e) },
      { status: 500 }
    );
  }
}
