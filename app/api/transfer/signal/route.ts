import { NextResponse } from "next/server";
import { authenticate, drainMessages, endedStatus, getSession, postMessage, receiverList, SENDER } from "@/utils/transfer/store";
import type { PollResponse } from "@/utils/transfer/shared";

const MAX_SIGNAL_BYTES = 64 * 1024;

/** Send a signaling message (SDP offer/answer, ICE candidate, control). */
export async function POST(request: Request) {
  const text = await request.text();
  if (text.length > MAX_SIGNAL_BYTES) return NextResponse.json({ error: "Message too large." }, { status: 413 });
  let body: { s?: string; to?: string; data?: Record<string, unknown> };
  try {
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const id = typeof body.s === "string" ? body.s : null;
  const s = getSession(id);
  if (!s) return NextResponse.json({ error: "Transfer ended.", status: endedStatus(id) }, { status: 410 });
  const from = authenticate(s, request.headers.get("x-transfer-token"));
  if (!from) return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  if (typeof body.to !== "string" || typeof body.data !== "object" || !body.data) {
    return NextResponse.json({ error: "Invalid message." }, { status: 400 });
  }
  if (!postMessage(s, from, body.to, body.data)) return NextResponse.json({ error: "Unknown recipient." }, { status: 400 });
  return NextResponse.json({ ok: true });
}

/** Poll: returns pending messages for the caller plus session state (acts as heartbeat). */
export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("s");
  const s = getSession(id);
  if (!s) return NextResponse.json({ status: endedStatus(id), messages: [], cloud: [], expiresAt: 0 }, { status: 410 });
  const me = authenticate(s, request.headers.get("x-transfer-token"));
  if (!me) return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  const res: PollResponse = {
    status: "active",
    expiresAt: s.expiresAt,
    messages: drainMessages(s, me),
    cloud: s.cloud,
    receivers: me === SENDER ? receiverList(s) : undefined,
  };
  return NextResponse.json(res, { headers: { "Cache-Control": "no-store" } });
}
