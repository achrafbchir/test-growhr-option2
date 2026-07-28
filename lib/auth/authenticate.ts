import bcrypt from "bcryptjs";
import { findByUsername } from "@/lib/repositories/users";
import type { AppDb } from "@/lib/db";
import type { AuthResult } from "@/lib/types";

export const AUTH_MESSAGES = {
  invalid: "Informations de connexion invalides",
  blocked: "Ce compte a été bloqué.",
} as const;

export async function authenticateUser(
  username: string,
  password: string,
  db?: AppDb,
): Promise<AuthResult> {
  const user = await findByUsername(username, db);

  if (!user) {
    return { ok: false, status: 401, message: AUTH_MESSAGES.invalid };
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    return { ok: false, status: 401, message: AUTH_MESSAGES.invalid };
  }

  if (user.status === "blocked") {
    return { ok: false, status: 403, message: AUTH_MESSAGES.blocked };
  }

  return {
    ok: true,
    user: { username: user.username, status: user.status },
  };
}
