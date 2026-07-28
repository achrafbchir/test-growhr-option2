import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  createSessionToken,
  verifySessionToken,
} from "@/lib/auth/session";

describe("session", () => {
  const previousSecret = process.env.SESSION_SECRET;

  beforeEach(() => {
    process.env.SESSION_SECRET = "test-session-secret-32-characters!";
  });

  afterEach(() => {
    process.env.SESSION_SECRET = previousSecret;
  });

  it("signs and verifies a session token", async () => {
    const { token, maxAge } = await createSessionToken("muser1", false);
    expect(maxAge).toBe(60 * 60 * 24);
    const session = await verifySessionToken(token);
    expect(session).toEqual({ sub: "muser1" });
  });

  it("uses longer maxAge when remember is true", async () => {
    const { maxAge } = await createSessionToken("muser1", true);
    expect(maxAge).toBe(60 * 60 * 24 * 30);
  });

  it("rejects an invalid token", async () => {
    const session = await verifySessionToken("not-a-real-token");
    expect(session).toBeNull();
  });
});
