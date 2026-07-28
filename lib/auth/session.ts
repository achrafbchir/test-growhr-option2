import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "session";

export type SessionPayload = {
  sub: string;
};

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("SESSION_SECRET must be set (min 16 characters)");
  }
  // Copy into a realm-local Uint8Array (jose instanceof checks; jsdom-safe)
  return new Uint8Array(new TextEncoder().encode(secret));
}

export async function createSessionToken(
  username: string,
  remember = false,
): Promise<{ token: string; maxAge: number }> {
  const maxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24;
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(username)
    .setIssuedAt()
    .setExpirationTime(remember ? "30d" : "1d")
    .sign(getSecret());

  return { token, maxAge };
}

export async function verifySessionToken(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (typeof payload.sub !== "string" || !payload.sub) {
      return null;
    }
    return { sub: payload.sub };
  } catch {
    return null;
  }
}

export function sessionCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}
