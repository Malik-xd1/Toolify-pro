import { Readable } from "node:stream";
import { NextResponse } from "next/server";
import { authenticate, cloudRefs, getSession, openDiskFile } from "@/utils/transfer/store";

/** Receiver downloads a temporarily stored file. Token is in the query so native downloads work. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const s = await getSession(url.searchParams.get("s"));
  if (!s) return NextResponse.json({ error: "Transfer ended." }, { status: 410 });
  if (!(await authenticate(s, url.searchParams.get("t")))) return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  const index = Number(url.searchParams.get("i"));
  const ref = Number.isInteger(index) ? (await cloudRefs(s))[index] : undefined;
  if (!ref) return NextResponse.json({ error: "File not available." }, { status: 404 });
  const meta = s.files[index];

  if (ref.startsWith("http")) {
    // Vercel Blob: send the browser to the (unguessable, auto-expiring) storage URL.
    const target = new URL(ref);
    if (url.searchParams.get("inline") !== "1") target.searchParams.set("download", "1");
    return NextResponse.redirect(target, { status: 302, headers: { "Cache-Control": "no-store" } });
  }

  const stream = Readable.toWeb(openDiskFile(s, index)) as unknown as ReadableStream;
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
