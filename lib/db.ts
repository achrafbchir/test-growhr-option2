import { Level } from "level";
import path from "node:path";

export type AppDb = Level<string, string>;

declare global {
  // eslint-disable-next-line no-var
  var __growhrLevel: AppDb | undefined;
  // eslint-disable-next-line no-var
  var __growhrLevelPath: string | undefined;
}

export function getDb(dbPath?: string): AppDb {
  const resolvedPath =
    dbPath ?? path.join(process.cwd(), "data", "leveldb");

  if (
    globalThis.__growhrLevel &&
    globalThis.__growhrLevelPath === resolvedPath
  ) {
    return globalThis.__growhrLevel;
  }

  const db = new Level<string, string>(resolvedPath, {
    valueEncoding: "utf8",
  });

  globalThis.__growhrLevel = db;
  globalThis.__growhrLevelPath = resolvedPath;
  return db;
}

export async function closeDb(): Promise<void> {
  if (globalThis.__growhrLevel) {
    await globalThis.__growhrLevel.close();
    globalThis.__growhrLevel = undefined;
    globalThis.__growhrLevelPath = undefined;
  }
}

export function userKey(username: string): string {
  return `user:${username}`;
}

export function likeKey(userId: string, photoId: string): string {
  return `like:${userId}:${photoId}`;
}
