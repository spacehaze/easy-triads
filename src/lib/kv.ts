import { Redis } from "@upstash/redis";

export type Comment = {
  id: string;
  name: string | null;
  text: string;
  ts: number;
};

const KEY = "easy-triads:comments";
const MAX_NAME = 32;
const MAX_TEXT = 600;
const MAX_STORED = 500;

let cached: Redis | null = null;

export function isKvConfigured(): boolean {
  const url =
    process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  return Boolean(url && token);
}

function getRedis(): Redis | null {
  if (cached) return cached;
  if (!isKvConfigured()) return null;
  cached = new Redis({
    url: (process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL)!,
    token: (process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN)!,
  });
  return cached;
}

/**
 * List all comments in chronological order (oldest first).
 * Returns [] if KV is not configured.
 */
export async function listComments(): Promise<Comment[]> {
  const redis = getRedis();
  if (!redis) return [];
  // LRANGE returns elements in their insertion order. We LPUSH new comments,
  // so the newest is at index 0; reverse for chronological display.
  const raw = await redis.lrange<Comment | string>(KEY, 0, -1);
  const items = raw.map((r) =>
    typeof r === "string" ? (JSON.parse(r) as Comment) : r
  );
  return items.reverse();
}

/**
 * Append a comment. Returns the created Comment, or null if KV isn't
 * configured / the input doesn't pass validation.
 */
export async function addComment(input: {
  name?: string | null;
  text: string;
}): Promise<Comment | null> {
  const redis = getRedis();
  if (!redis) return null;
  const text = input.text.trim().slice(0, MAX_TEXT);
  if (!text) return null;
  const name = input.name?.trim().slice(0, MAX_NAME) || null;
  const comment: Comment = {
    id: crypto.randomUUID(),
    name,
    text,
    ts: Date.now(),
  };
  await redis.lpush(KEY, JSON.stringify(comment));
  // Bound storage so a runaway adversary can't fill the list forever.
  await redis.ltrim(KEY, 0, MAX_STORED - 1);
  return comment;
}
