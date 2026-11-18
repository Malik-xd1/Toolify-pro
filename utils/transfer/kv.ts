// SERVER-ONLY: tiny key-value layer used by the transfer store.
//
// - If Upstash/Vercel KV REST credentials are set (UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN,
//   or KV_REST_API_URL + KV_REST_API_TOKEN), everything goes to Redis. Required on Vercel/serverless,
//   where each request may hit a different instance.
// - Otherwise an in-process store is used, snapshotted to disk so a restart doesn't lose sessions.
//   Fine for a single self-hosted `next start` server or local development.

import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

export interface KV {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSec: number): Promise<void>;
  del(...keys: string[]): Promise<void>;
  incr(key: string, ttlSec: number): Promise<number>;
  /** Append to a list (and refresh its TTL). */
  rpush(key: string, value: string, ttlSec: number, maxLen: number): Promise<void>;
  /** Atomically read and clear a list. */
  drain(key: string): Promise<string[]>;
  hset(key: string, field: string, value: string, ttlSec: number): Promise<void>;
  hdel(key: string, field: string): Promise<void>;
  hgetall(key: string): Promise<Record<string, string>>;
}

// ------------------------------------------------------------------ Upstash (REST)

const REST_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

type Cmd = (string | number)[];

async function rest(endpoint: "pipeline" | "multi-exec", cmds: Cmd[]): Promise<unknown[]> {
  const res = await fetch(`${REST_URL}/${endpoint}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${REST_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmds),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Redis error ${res.status}`);
  const out = (await res.json()) as { result?: unknown; error?: string }[];
  const err = out.find((o) => o.error);
  if (err) throw new Error(`Redis: ${err.error}`);
  return out.map((o) => o.result);
}

const redisKV: KV = {
  async get(key) {
    return ((await rest("pipeline", [["GET", key]]))[0] as string | null) ?? null;
  },
  async set(key, value, ttl) {
    await rest("pipeline", [["SET", key, value, "EX", ttl]]);
  },
  async del(...keys) {
    if (keys.length) await rest("pipeline", [["DEL", ...keys]]);
  },
  async incr(key, ttl) {
    const r = await rest("multi-exec", [["INCR", key], ["EXPIRE", key, ttl]]);
    return Number(r[0]);
  },
  async rpush(key, value, ttl, maxLen) {
    await rest("multi-exec", [["RPUSH", key, value], ["LTRIM", key, -maxLen, -1], ["EXPIRE", key, ttl]]);
  },
  async drain(key) {
    const r = await rest("multi-exec", [["LRANGE", key, 0, -1], ["DEL", key]]);
    return (r[0] as string[]) ?? [];
  },
  async hset(key, field, value, ttl) {
    await rest("multi-exec", [["HSET", key, field, value], ["EXPIRE", key, ttl]]);
  },
  async hdel(key, field) {
    await rest("pipeline", [["HDEL", key, field]]);
  },
  async hgetall(key) {
    const flat = ((await rest("pipeline", [["HGETALL", key]]))[0] as string[]) ?? [];
    const o: Record<string, string> = {};
    for (let i = 0; i + 1 < flat.length; i += 2) o[flat[i]] = flat[i + 1];
    return o;
  },
};

// ------------------------------------------------------------------ In-process (+ disk snapshot)

type Entry = { v: string | string[] | Record<string, string>; exp: number };
const SNAPSHOT = path.join(os.tmpdir(), "toolify-transfer", "_kv.json");
const g = globalThis as unknown as { __toolifyKV?: Map<string, Entry> };

function memMap(): Map<string, Entry> {
  if (g.__toolifyKV) return g.__toolifyKV;
  const m = new Map<string, Entry>();
  try {
    for (const [k, e] of JSON.parse(readFileSync(SNAPSHOT, "utf8")) as [string, Entry][]) if (e.exp > Date.now()) m.set(k, e);
  } catch {
    /* no snapshot yet */
  }
  return (g.__toolifyKV = m);
}

let saveTimer: ReturnType<typeof setTimeout> | undefined;
function persist() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      const m = memMap();
      const now = Date.now();
      // Mailboxes (signaling) are short-lived and not worth persisting.
      const data = [...m].filter(([k, e]) => e.exp > now && !k.startsWith("tx:m:"));
      mkdirSync(path.dirname(SNAPSHOT), { recursive: true });
      writeFileSync(SNAPSHOT + ".tmp", JSON.stringify(data));
      renameSync(SNAPSHOT + ".tmp", SNAPSHOT);
    } catch (e) {
      console.warn("[transfer] could not persist store", e);
    }
  }, 200);
}

function live(key: string): Entry | undefined {
  const m = memMap();
  const e = m.get(key);
  if (e && e.exp <= Date.now()) {
    m.delete(key);
    return undefined;
  }
  return e;
}
const exp = (ttl: number) => Date.now() + ttl * 1000;

const memoryKV: KV = {
  async get(key) {
    const e = live(key);
    return typeof e?.v === "string" ? e.v : null;
  },
  async set(key, value, ttl) {
    memMap().set(key, { v: value, exp: exp(ttl) });
    persist();
  },
  async del(...keys) {
    keys.forEach((k) => memMap().delete(k));
    persist();
  },
  async incr(key, ttl) {
    const n = Number((live(key)?.v as string) ?? 0) + 1;
    memMap().set(key, { v: String(n), exp: exp(ttl) });
    persist();
    return n;
  },
  async rpush(key, value, ttl, maxLen) {
    const list = ((live(key)?.v as string[]) ?? []).concat(value).slice(-maxLen);
    memMap().set(key, { v: list, exp: exp(ttl) });
  },
  async drain(key) {
    const list = (live(key)?.v as string[]) ?? [];
    memMap().delete(key);
    return list;
  },
  async hset(key, field, value, ttl) {
    const h = { ...((live(key)?.v as Record<string, string>) ?? {}), [field]: value };
    memMap().set(key, { v: h, exp: exp(ttl) });
    persist();
  },
  async hdel(key, field) {
    const e = live(key);
    if (e) delete (e.v as Record<string, string>)[field];
    persist();
  },
  async hgetall(key) {
    return { ...((live(key)?.v as Record<string, string>) ?? {}) };
  },
};

export const usingRedis = !!(REST_URL && REST_TOKEN);
export const kv: KV = usingRedis ? redisKV : memoryKV;
