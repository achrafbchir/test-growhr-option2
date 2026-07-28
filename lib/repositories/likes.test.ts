import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { closeDb, getDb } from "@/lib/db";
import {
  getLikedPhotoIds,
  hasLike,
  toggleLike,
} from "@/lib/repositories/likes";

describe("likes repository", () => {
  let dbPath: string;

  beforeEach(async () => {
    dbPath = await fs.mkdtemp(path.join(os.tmpdir(), "growhr-likes-"));
    await closeDb();
  });

  afterEach(async () => {
    await closeDb();
    await fs.rm(dbPath, { recursive: true, force: true });
  });

  it("toggles like create and delete", async () => {
    const db = getDb(dbPath);
    expect(await hasLike("muser1", "photo-1", db)).toBe(false);

    expect(await toggleLike("muser1", "photo-1", db)).toBe(true);
    expect(await hasLike("muser1", "photo-1", db)).toBe(true);

    expect(await toggleLike("muser1", "photo-1", db)).toBe(false);
    expect(await hasLike("muser1", "photo-1", db)).toBe(false);
  });

  it("returns liked photo ids for a page", async () => {
    const db = getDb(dbPath);
    await toggleLike("muser1", "a", db);
    await toggleLike("muser1", "c", db);

    const liked = await getLikedPhotoIds("muser1", ["a", "b", "c"], db);
    expect([...liked].sort()).toEqual(["a", "c"]);
  });
});
