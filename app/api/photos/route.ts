import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth/get-session";
import { seedUsers } from "@/lib/db/seed";
import { getLikedPhotoIds } from "@/lib/repositories/likes";
import { fetchUnsplashPhotos, mapUnsplashPhoto } from "@/lib/unsplash";
import { photosQuerySchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const parsed = photosQuerySchema.safeParse({
      page: searchParams.get("page") ?? undefined,
      per_page: searchParams.get("per_page") ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid query" }, { status: 400 });
    }

    const { page, per_page } = parsed.data;
    const photos = await fetchUnsplashPhotos(page, per_page);

    await seedUsers();
    const likedIds = await getLikedPhotoIds(
      session.sub,
      photos.map((photo) => photo.id),
    );

    const data = photos.map((photo) =>
      mapUnsplashPhoto(photo, likedIds.has(photo.id)),
    );

    return NextResponse.json({
      data,
      page,
      per_page,
      hasMore: photos.length === per_page,
    });
  } catch (error) {
    console.error("photos error", error);
    return NextResponse.json(
      { error: "Unable to load photos right now." },
      { status: 500 },
    );
  }
}
