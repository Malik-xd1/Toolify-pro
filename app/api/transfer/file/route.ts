import { Readable } from "node:stream";
import { NextResponse } from "next/server";
import { authenticate, getSession, openCloudFile } from "@/utils/transfer/store";

/** Receiver downloads a temporarily stored file. Token is in the query so native downloads work. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const s = getSession(url.searchParams.get("s"));
  if (!s) return NextResponse.json({ error: "Transfer ended." }, { status: 410 });
  if (!authenticate(s, url.searchParams.get("t"))) return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  const index = Number(url.searchParams.get("i"));
  if (!Number.isInteger(index) || !s.cloud[index]) return NextResponse.json({ error: "File not available." }, { status: 404 });
  const meta = s.files[index];
  const stream = Readable.toWeb(openCloudFile(s, index)) as unknown as ReadableStream;
  return new Response(stream, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Length": String(meta.size),
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(meta.name)}`,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
