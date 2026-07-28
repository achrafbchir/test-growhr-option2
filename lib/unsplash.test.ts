import { describe, expect, it } from "vitest";
import { mapUnsplashPhoto } from "@/lib/unsplash";

describe("mapUnsplashPhoto", () => {
  it("maps Unsplash JSON to a photo DTO", () => {
    const dto = mapUnsplashPhoto(
      {
        id: "abc",
        alt_description: "A lake",
        description: null,
        urls: {
          small: "https://images.unsplash.com/small",
          regular: "https://images.unsplash.com/regular",
        },
        likes: 42,
        views: 1000,
        user: {
          name: "Jane",
          profile_image: { small: "https://images.unsplash.com/avatar" },
        },
      },
      true,
    );

    expect(dto).toEqual({
      id: "abc",
      url: "https://images.unsplash.com/regular",
      thumbUrl: "https://images.unsplash.com/small",
      alt: "A lake",
      authorName: "Jane",
      authorAvatar: "https://images.unsplash.com/avatar",
      likesCount: 42,
      viewsCount: 1000,
      likedByMe: true,
    });
  });
});
