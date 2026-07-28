import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth/get-session";
import { seedUsers } from "@/lib/db/seed";
import { findByUsername } from "@/lib/repositories/users";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  await seedUsers();
  const user = await findByUsername(session.sub);
  if (!user || user.status === "blocked") {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({
    user: { username: user.username, status: user.status },
  });
}
