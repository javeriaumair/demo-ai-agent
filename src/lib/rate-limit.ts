import "server-only";
import { createHash } from "node:crypto";
import { Redis } from "@upstash/redis";

// Daily generation limit per visitor (by IP) — resets at midnight Pakistan time.
//
// Storage:
// - Upstash Redis when its env vars are set (production on Vercel). Supports
//   both Upstash's own names (UPSTASH_REDIS_REST_URL / _TOKEN) and the Vercel
//   Marketplace integration names (KV_REST_API_URL / KV_REST_API_TOKEN).
// - Otherwise server memory (local development). Memory resets on restart
//   and is not shared between serverless instances.

const DEFAULT_DAILY_LIMIT = 5;
const KEY_PREFIX = "likhoai:daily-limit";
const KEY_TTL_SECONDS = 60 * 60 * 26; // a little over a day, so keys clean themselves up

export function getDailyLimit(): number {
  const fromEnv = Number.parseInt(process.env.DAILY_GENERATION_LIMIT ?? "", 10);
  return Number.isFinite(fromEnv) && fromEnv > 0 ? fromEnv : DEFAULT_DAILY_LIMIT;
}

/** Current date in Pakistan time (PKT), e.g. "2026-10-13". */
function todayInPakistan(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Karachi" }).format(new Date());
}

/** Store a hash instead of the raw IP address (privacy). */
function hashVisitor(visitor: string): string {
  return createHash("sha256").update(visitor).digest("hex").slice(0, 32);
}

// ---------- Redis (production) ----------

let redis: Redis | null | undefined;

function getRedis(): Redis | null {
  if (redis !== undefined) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  redis = url && token ? new Redis({ url, token }) : null;
  if (!redis) {
    if (process.env.VERCEL_ENV === "production") {
      console.warn("[rate-limit] Upstash Redis env vars missing in production — using in-memory limit.");
    }
  }
  return redis;
}

// ---------- In-memory fallback (local development) ----------

let memoryDay = "";
const memoryCounts = new Map<string, number>();

function memoryIncrement(key: string, by: 1 | -1): number {
  const today = todayInPakistan();
  if (today !== memoryDay) {
    memoryDay = today;
    memoryCounts.clear();
  }
  const next = Math.max(0, (memoryCounts.get(key) ?? 0) + by);
  memoryCounts.set(key, next);
  return next;
}

// ---------- Public API ----------

export type Reservation = { allowed: boolean; remaining: number; release: () => Promise<void> };

/**
 * Reserve one generation for this visitor. Call `release()` if the
 * generation fails, so failures don't count against the limit.
 */
export async function reserveGeneration(visitor: string): Promise<Reservation> {
  const limit = getDailyLimit();
  const key = `${KEY_PREFIX}:${todayInPakistan()}:${hashVisitor(visitor)}`;
  const client = getRedis();

  let used: number;
  let decrement: () => Promise<unknown>;

  if (client) {
    try {
      const [count] = await client.pipeline().incr(key).expire(key, KEY_TTL_SECONDS).exec<[number, number]>();
      used = count;
      decrement = () => client.decr(key);
    } catch (error) {
      // Don't take the app down if Redis has a hiccup; fall back for this request.
      console.error("[rate-limit] Redis error, using in-memory limit", error);
      used = memoryIncrement(key, 1);
      decrement = async () => memoryIncrement(key, -1);
    }
  } else {
    used = memoryIncrement(key, 1);
    decrement = async () => memoryIncrement(key, -1);
  }

  if (used > limit) {
    await decrement().catch(() => {}); // over the limit: don't keep counting
    return { allowed: false, remaining: 0, release: async () => {} };
  }

  let released = false;
  return {
    allowed: true,
    remaining: limit - used,
    release: async () => {
      if (released) return;
      released = true;
      await decrement().catch((error) => console.error("[rate-limit] release failed", error));
    },
  };
}
