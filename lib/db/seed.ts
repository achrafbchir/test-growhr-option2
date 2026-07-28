import bcrypt from "bcryptjs";
import { getDb, userKey, type AppDb } from "@/lib/db";
import type { UserRecord } from "@/lib/types";

const SEED_USERS: Array<{
  username: string;
  password: string;
  status: UserRecord["status"];
}> = [
  { username: "muser1", password: "mpassword1", status: "active" },
  { username: "muser2", password: "mpassword2", status: "active" },
  { username: "muser3", password: "mpassword3", status: "blocked" },
];

export async function seedUsers(db: AppDb = getDb()): Promise<void> {
  await db.open();

  for (const seed of SEED_USERS) {
    const key = userKey(seed.username);
    const existing = await db.get(key);
    if (existing !== undefined) {
      continue;
    }

    const record: UserRecord = {
      username: seed.username,
      passwordHash: await bcrypt.hash(seed.password, 10),
      status: seed.status,
    };
    await db.put(key, JSON.stringify(record));
  }
}
