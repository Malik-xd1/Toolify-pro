import { NextResponse } from "next/server";
import { cleanupBlobs } from "@/utils/transfer/store";

/** Deletes expired temporary files. Called daily by Vercel Cron (see vercel.json). */
export async function GET(request: Request) {
  const auth = request.headers.get("authorization"); // reading headers keeps this route dynamic
  const secret = process.env.CRON_SECRET;
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  return NextResponse.json({ deleted: await cleanupBlobs() });
}
