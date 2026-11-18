import { NextResponse } from "next/server";
import { authenticate, cloudMaxBytes, cloudMode, cloudRefs, getSession, saveDiskFile, SENDER } from "@/utils/transfer/store";
import { formatBytes } from "@/utils/transfer/shared";

/** Self-hosted fallback: sender streams one file to the server's temp folder. */
export async function PUT(request: Request) {
  if (cloudMode() !== "disk") return NextResponse.json({ error: "Disk uploads are not enabled on this server." }, { status: 503 });
  const url = new URL(request.url);
  const s = await getSession(url.searchParams.get("s"));
  if (!s) return NextResponse.json({ error: "Transfer ended." }, { status: 410 });
  if ((await authenticate(s, request.headers.get("x-transfer-token"))) !== SENDER) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }
  const index = Number(url.searchParams.get("i"));
  if (!Number.isInteger(index) || index < 0 || index >= s.files.length) {
    return NextResponse.json({ error: "Invalid file." }, { status: 400 });
  }
  if (s.files[index].size > cloudMaxBytes()) {
    return NextResponse.json({ error: `Cloud fallback supports files up to ${formatBytes(cloudMaxBytes())}.` }, { status: 413 });
  }
  if ((await cloudRefs(s))[index]) return NextResponse.json({ ok: true });
  if (!request.body) return NextResponse.json({ error: "Empty upload." }, { status: 400 });
  try {
    await saveDiskFile(s, index, request.body);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message || "Upload failed." }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
