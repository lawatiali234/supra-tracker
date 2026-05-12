import { rget, rset } from "./redis";

export async function getList<T>(key: string): Promise<T[]> {
  const data = await rget<T[]>(key);
  return Array.isArray(data) ? data : [];
}

export async function setList<T>(key: string, items: T[]): Promise<void> {
  await rset(key, items);
}

export async function appendItem<T>(key: string, item: T): Promise<T[]> {
  const items = await getList<T>(key);
  items.push(item);
  await setList(key, items);
  return items;
}

export async function updateItem<T extends { id: string }>(
  key: string,
  id: string,
  patch: Partial<T>,
): Promise<T[]> {
  const items = await getList<T>(key);
  const idx = items.findIndex((x) => x.id === id);
  if (idx === -1) return items;
  items[idx] = { ...items[idx], ...patch, id: items[idx].id } as T;
  await setList(key, items);
  return items;
}

export async function deleteItem<T extends { id: string }>(
  key: string,
  id: string,
): Promise<T[]> {
  const items = await getList<T>(key);
  const next = items.filter((x) => x.id !== id);
  await setList(key, next);
  return next;
}

export async function getObject<T>(key: string): Promise<T | null> {
  return rget<T>(key);
}

export async function setObject<T>(key: string, value: T): Promise<void> {
  await rset(key, value);
}
