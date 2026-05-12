import { Redis } from "@upstash/redis";

function build(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
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
