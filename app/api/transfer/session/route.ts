import { NextResponse } from "next/server";
import { authenticate, cancelSession, createSession, endedStatus, getSession, SENDER } from "@/utils/transfer/store";
import type { SessionStatus, TransferFileMeta } from "@/utils/transfer/shared";

const noStore = { "Cache-Control": "no-store" };

/** Create a transfer session (sender). */
export async function POST(request: Request) {
  let body: { files?: unknown; expiryMinutes?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const password = typeof body.password === "string" ? body.password : "";
  if (password.length > 128) return NextResponse.json({ error: "Password is too long." }, { status: 400 });
  try {
    const result = await createSession({
      files: (Array.isArray(body.files) ? body.files : []) as TransferFileMeta[],
      expiryMinutes: Number(body.expiryMinutes),
      password: password || undefined,
    });
    if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json(result, { headers: noStore });
  } catch (e) {
    console.error("[transfer] create failed", e);
    return NextResponse.json({ error: "Transfer service is unavailable. Please try again." }, { status: 503 });
  }
}

/** Public, non-sensitive session status (no file names until the receiver joins). */
export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("s");
  const s = await getSession(id);
  const res: SessionStatus = s
    ? { status: "active", expiresAt: s.expiresAt, requiresPassword: !!s.password, fileCount: s.files.length }
    : { status: await endedStatus(id) };
  return NextResponse.json(res, { headers: noStore });
}

/** Cancel the session (sender only): deletes all temporary files immediately. */
export async function DELETE(request: Request) {
  const s = await getSession(new URL(request.url).searchParams.get("s"));
  if (!s) return NextResponse.json({ ok: true });
  if ((await authenticate(s, request.headers.get("x-transfer-token"))) !== SENDER) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }
  await cancelSession(s);
  return NextResponse.json({ ok: true });
}
