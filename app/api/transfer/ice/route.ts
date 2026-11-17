import { NextResponse } from "next/server";
import { authenticate, getSession, iceServers } from "@/utils/transfer/store";

/** STUN/TURN config. Only session participants get (short-lived) TURN credentials. */
export async function GET(request: Request) {
  const s = getSession(new URL(request.url).searchParams.get("s"));
  if (!s) return NextResponse.json({ error: "Transfer ended." }, { status: 410 });
  const me = authenticate(s, request.headers.get("x-transfer-token"));
  if (!me) return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  return NextResponse.json({ iceServers: iceServers(me) }, { headers: { "Cache-Control": "no-store" } });
}
