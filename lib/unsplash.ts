import type { PhotoDto } from "@/lib/types";

type UnsplashPhoto = {
  id: string;
  alt_description: string | null;
  description: string | null;
  urls: {
    small: string;
    regular: string;
  };
  likes: number;
  views?: number;
  user: {
    name: string;
    profile_image?: {
      small?: string;
    };
  };
};

export function mapUnsplashPhoto(
  photo: UnsplashPhoto,
  likedByMe = false,
): PhotoDto {
  return {
    id: photo.id,
    url: photo.urls.regular,
    thumbUrl: photo.urls.small,
    alt: photo.alt_description ?? photo.description ?? "Unsplash photo",
    authorName: photo.user.name,
    authorAvatar: photo.user.profile_image?.small ?? null,
    likesCount: photo.likes,
    viewsCount: typeof photo.views === "number" ? photo.views : null,
    likedByMe,
  };
}

export async function fetchUnsplashPhotos(
  page: number,
  perPage: number,
): Promise<UnsplashPhoto[]> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    throw new Error("UNSPLASH_ACCESS_KEY is not configured");
  }

  const url = new URL("https://api.unsplash.com/photos");
  url.searchParams.set("page", String(page));
  url.searchParams.set("per_page", String(perPage));

  const response = await fetch(url, {
    headers: {
      Authorization: `Client-ID ${accessKey}`,
      "Accept-Version": "v1",
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Unsplash request failed with ${response.status}`);
  }

  return (await response.json()) as UnsplashPhoto[];
}
