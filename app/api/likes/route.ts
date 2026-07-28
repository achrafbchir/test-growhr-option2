import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth/get-session";
import { seedUsers } from "@/lib/db/seed";
import { toggleLike } from "@/lib/repositories/likes";
import { likesSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = likesSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid photoId" }, { status: 400 });
    }

    await seedUsers();
    const liked = await toggleLike(session.sub, parsed.data.photoId);
    return NextResponse.json({ liked });
  } catch (error) {
    console.error("likes error", error);
    return NextResponse.json(
      { error: "Unable to update like." },
      { status: 500 },
    );
  }
}
