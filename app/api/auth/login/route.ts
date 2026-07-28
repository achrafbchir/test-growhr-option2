import { NextResponse } from "next/server";
import { authenticateUser } from "@/lib/auth/authenticate";
import {
  SESSION_COOKIE,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/auth/session";
import { seedUsers } from "@/lib/db/seed";
import { loginSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    await seedUsers();

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Informations de connexion invalides" },
        { status: 400 },
      );
    }

    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Informations de connexion invalides" },
        { status: 400 },
      );
    }

    const { username, password, remember } = parsed.data;
    const result = await authenticateUser(username, password);

    if (!result.ok) {
      return NextResponse.json(
        { error: result.message },
        { status: result.status },
      );
    }

    const { token, maxAge } = await createSessionToken(
      result.user.username,
      remember,
    );

    const response = NextResponse.json({ user: result.user });
    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(maxAge));
    return response;
  } catch (error) {
    console.error("login error", error);
    return NextResponse.json(
      { error: "Unable to sign in right now." },
      { status: 500 },
    );
  }
}
