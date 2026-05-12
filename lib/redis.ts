import { Redis } from "@upstash/redis";

// Support both env var naming conventions:
//   UPSTASH_REDIS_REST_URL / _TOKEN  (Upstash native integration)
//   KV_REST_API_URL / _TOKEN          (Vercel KV integration, same Upstash backend)
function build(): Redis | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "[redis] no env vars found — set UPSTASH_REDIS_REST_URL/_TOKEN or KV_REST_API_URL/_TOKEN. Reads return null, writes silently no-op.",
      );
    }
    return null;
  }
  return new Redis({ url, token });
}

const client = build();

export const isRedisConfigured = client !== null;

export async function rget<T>(key: string): Promise<T | null> {
  if (!client) return null;
  try {
    return (await client.get<T>(key)) ?? null;
  } catch (e) {
    console.error(`[redis] get ${key} failed`, e);
    return null;
  }
}

export async function rset<T>(key: string, value: T): Promise<boolean> {
  if (!client) return false;
  try {
    await client.set(key, value);
    return true;
  } catch (e) {
    console.error(`[redis] set ${key} failed`, e);
    return false;
  }
}
