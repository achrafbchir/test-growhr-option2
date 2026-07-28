import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { closeDb, getDb, userKey } from "@/lib/db";
import { seedUsers } from "@/lib/db/seed";
import type { UserRecord } from "@/lib/types";

describe("seedUsers", () => {
  let dbPath: string;

  beforeEach(async () => {
    dbPath = await fs.mkdtemp(path.join(os.tmpdir(), "growhr-seed-"));
    await closeDb();
  });

  afterEach(async () => {
    await closeDb();
    await fs.rm(dbPath, { recursive: true, force: true });
  });

  it("seeds the three challenge users", async () => {
    const db = getDb(dbPath);
    await seedUsers(db);

    const user1 = JSON.parse(await db.get(userKey("muser1"))) as UserRecord;
    const user3 = JSON.parse(await db.get(userKey("muser3"))) as UserRecord;

    expect(user1.status).toBe("active");
    expect(user3.status).toBe("blocked");
  });

  it("is idempotent and keeps the original hash", async () => {
    const db = getDb(dbPath);
    await seedUsers(db);
    const first = await db.get(userKey("muser1"));
    await seedUsers(db);
    const second = await db.get(userKey("muser1"));
    expect(second).toBe(first);
  });
});
