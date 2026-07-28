import { getDb, userKey, type AppDb } from "@/lib/db";
import type { UserRecord } from "@/lib/types";

export async function findByUsername(
  username: string,
  db: AppDb = getDb(),
): Promise<UserRecord | null> {
  await db.open();
  const raw = await db.get(userKey(username));
  if (raw === undefined) {
    return null;
  }
  return JSON.parse(raw) as UserRecord;
}
