import { getDb, likeKey, type AppDb } from "@/lib/db";
import type { LikeRecord } from "@/lib/types";

export async function hasLike(
  userId: string,
  photoId: string,
  db: AppDb = getDb(),
): Promise<boolean> {
  await db.open();
  const raw = await db.get(likeKey(userId, photoId));
  return raw !== undefined;
}

export async function getLikedPhotoIds(
  userId: string,
  photoIds: string[],
  db: AppDb = getDb(),
): Promise<Set<string>> {
  const liked = await Promise.all(
    photoIds.map(async (photoId) =>
      (await hasLike(userId, photoId, db)) ? photoId : null,
    ),
  );
  return new Set(liked.filter((id): id is string => id !== null));
}

export async function toggleLike(
  userId: string,
  photoId: string,
  db: AppDb = getDb(),
): Promise<boolean> {
  await db.open();
  const key = likeKey(userId, photoId);
  const alreadyLiked = await hasLike(userId, photoId, db);

  if (alreadyLiked) {
    await db.del(key);
    return false;
  }

  const record: LikeRecord = { createdAt: new Date().toISOString() };
  await db.put(key, JSON.stringify(record));
  return true;
}
