import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { authenticateUser, AUTH_MESSAGES } from "@/lib/auth/authenticate";
import { closeDb, getDb } from "@/lib/db";
import { seedUsers } from "@/lib/db/seed";

describe("authenticateUser", () => {
  let dbPath: string;

  beforeEach(async () => {
    dbPath = await fs.mkdtemp(path.join(os.tmpdir(), "growhr-auth-"));
    await closeDb();
    const db = getDb(dbPath);
    await seedUsers(db);
  });

  afterEach(async () => {
    await closeDb();
    await fs.rm(dbPath, { recursive: true, force: true });
  });

  it("authenticates muser1 successfully", async () => {
    const result = await authenticateUser("muser1", "mpassword1", getDb(dbPath));
    expect(result).toEqual({
      ok: true,
      user: { username: "muser1", status: "active" },
    });
  });

  it("authenticates muser2 successfully", async () => {
    const result = await authenticateUser("muser2", "mpassword2", getDb(dbPath));
    expect(result.ok).toBe(true);
  });

  it("rejects blocked muser3 with French message", async () => {
    const result = await authenticateUser("muser3", "mpassword3", getDb(dbPath));
    expect(result).toEqual({
      ok: false,
      status: 403,
      message: AUTH_MESSAGES.blocked,
    });
  });

  it("rejects invalid credentials with French message", async () => {
    const result = await authenticateUser("nobody", "wrong", getDb(dbPath));
    expect(result).toEqual({
      ok: false,
      status: 401,
      message: AUTH_MESSAGES.invalid,
    });
  });

  it("rejects wrong password for known user", async () => {
    const result = await authenticateUser("muser1", "bad", getDb(dbPath));
    expect(result).toEqual({
      ok: false,
      status: 401,
      message: AUTH_MESSAGES.invalid,
    });
  });
});
