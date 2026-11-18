import { NextResponse } from "next/server";
import { endedStatus, getSession, joinSession, postMessage } from "@/utils/transfer/store";

/** Receiver joins a session (verifies optional password) and gets an expiring token. */
export async function POST(request: Request) {
  let body: { s?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const id = typeof body.s === "string" ? body.s : null;
  const s = await getSession(id);
  if (!s) {
    const st = await endedStatus(id);
    const msg =
      st === "cancelled" ? "The sender cancelled this transfer." : st === "expired" ? "This transfer has expired." : "Transfer not found.";
    return NextResponse.json({ error: msg, status: st }, { status: 410 });
  }
  const result = await joinSession(s, typeof body.password === "string" ? body.password : undefined);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });
  await postMessage(s, result.peerId, "sender", { type: "joined" });
  return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
}
