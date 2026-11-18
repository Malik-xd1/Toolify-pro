import { NextResponse } from "next/server";
import { head } from "@vercel/blob";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { authenticate, cloudMaxBytes, cloudMode, getSession, recordBlob, SENDER } from "@/utils/transfer/store";
import { formatBytes } from "@/utils/transfer/shared";

const blobPrefix = (id: string, i: number) => `transfer/${id}/${i}-`;

async function authorize(s: string | undefined, i: number, token: string | undefined) {
  const session = await getSession(s ?? null);
  if (!session) throw new Error("Transfer ended.");
  if ((await authenticate(session, token ?? null)) !== SENDER) throw new Error("Not authorized.");
  if (!Number.isInteger(i) || i < 0 || i >= session.files.length) throw new Error("Invalid file.");
  if (session.files[i].size > cloudMaxBytes()) throw new Error(`Cloud fallback supports files up to ${formatBytes(cloudMaxBytes())}.`);
  return session;
}

/**
 * Vercel Blob client uploads: the browser uploads straight to Blob storage (no 4.5 MB function
 * limit). This route only issues a short-lived, size-limited upload token to the verified sender.
 */
export async function POST(request: Request) {
  if (cloudMode() !== "blob") return NextResponse.json({ error: "Cloud storage is not configured." }, { status: 503 });
  const body = (await request.json()) as HandleUploadBody;
  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const p = JSON.parse(clientPayload || "{}") as { s?: string; i?: number; t?: string };
        const i = Number(p.i);
        const session = await authorize(p.s, i, p.t);
        if (!pathname.startsWith(blobPrefix(session.id, i))) throw new Error("Invalid upload path.");
        return {
          maximumSizeInBytes: session.files[i].size,
          addRandomSuffix: true,
          ttlDays: 1, // safety net: Blob deletes it even if cleanup never runs
          validUntil: Date.now() + 10 * 60_000,
        };
      },
      onUploadCompleted: async () => {
        /* recorded via PUT below (this webhook can't reach localhost) */
      },
    });
    return NextResponse.json(json);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

/** Sender confirms a finished upload; the server verifies it before receivers can see it. */
export async function PUT(request: Request) {
  if (cloudMode() !== "blob") return NextResponse.json({ error: "Cloud storage is not configured." }, { status: 503 });
  try {
    const { s, i, url } = (await request.json()) as { s?: string; i?: number; url?: string };
    const idx = Number(i);
    const session = await authorize(s, idx, request.headers.get("x-transfer-token") ?? undefined);
    if (typeof url !== "string") throw new Error("Invalid upload.");
    const meta = await head(url);
    if (!meta.pathname.startsWith(blobPrefix(session.id, idx)) || meta.size !== session.files[idx].size) {
      throw new Error("Uploaded file does not match.");
    }
    await recordBlob(session, idx, meta.url);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
