import "server-only";

// Phase 1A daily limit per visitor (by IP), kept in server memory.
// Limitations (accepted for 1A, see PRD): resets when the server restarts
// and is not shared between serverless instances. Phase 1B moves this to
// Supabase per user account.

const DEFAULT_DAILY_LIMIT = 5;

export function getDailyLimit(): number {
  const fromEnv = Number.parseInt(process.env.DAILY_GENERATION_LIMIT ?? "", 10);
  return Number.isFinite(fromEnv) && fromEnv > 0 ? fromEnv : DEFAULT_DAILY_LIMIT;
}

/** Current date in Pakistan time (PKT), e.g. "2026-10-13" — the limit resets at PKT midnight. */
function todayInPakistan(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Karachi" }).format(new Date());
}

let currentDay = "";
const counts = new Map<string, number>();

function resetIfNewDay() {
  const today = todayInPakistan();
  if (today !== currentDay) {
    currentDay = today;
    counts.clear();
  }
}

/** Reserve one generation. Returns false when the visitor has hit today's limit. */
export function tryConsume(key: string): { allowed: boolean; remaining: number } {
  resetIfNewDay();
  const limit = getDailyLimit();
  const used = counts.get(key) ?? 0;
  if (used >= limit) return { allowed: false, remaining: 0 };
  counts.set(key, used + 1);
  return { allowed: true, remaining: limit - used - 1 };
}

/** Give a reserved generation back (e.g. when the AI call failed). */
export function refund(key: string): void {
  const used = counts.get(key) ?? 0;
  if (used > 0) counts.set(key, used - 1);
}
