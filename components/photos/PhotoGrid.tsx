"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { PhotoDto } from "@/lib/types";
import { PhotoCard } from "@/components/photos/PhotoCard";

type PhotosResponse = {
  data: PhotoDto[];
  page: number;
  per_page: number;
  hasMore: boolean;
  error?: string;
};

const CATEGORIES = [
  "All",
  "Animation",
  "Branding",
  "Illustration",
  "Mobile",
  "Print",
  "Product Design",
  "Typography",
  "Web Design",
] as const;

export function PhotoGrid() {
  const router = useRouter();
  const [photos, setPhotos] = useState<PhotoDto[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingLikeId, setPendingLikeId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] =
    useState<(typeof CATEGORIES)[number]>("All");
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);

  const loadPage = useCallback(async (nextPage: number, replace = false) => {
    if (loadingRef.current) {
      return;
    }
    loadingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/photos?page=${nextPage}&per_page=12`,
      );
      const payload = (await response.json()) as PhotosResponse;

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to load photos");
      }

      setPhotos((current) => {
        if (replace) {
          return payload.data;
        }
        const seen = new Set(current.map((photo) => photo.id));
        const incoming = payload.data.filter((photo) => !seen.has(photo.id));
        return [...current, ...incoming];
      });
      setPage(nextPage);
      setHasMore(payload.hasMore);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load photos",
      );
    } finally {
      loadingRef.current = false;
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadPage(1, true);
  }, [loadPage]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !loadingRef.current) {
          void loadPage(page + 1);
        }
      },
      { rootMargin: "240px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadPage, page]);

  async function handleToggleLike(photoId: string) {
    const previous = photos;
    setPendingLikeId(photoId);
    setPhotos((current) =>
      current.map((photo) =>
        photo.id === photoId
          ? {
              ...photo,
              likedByMe: !photo.likedByMe,
            }
          : photo,
      ),
    );

    try {
      const response = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId }),
      });

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Like failed");
      }

      const payload = (await response.json()) as { liked: boolean };
      setPhotos((current) =>
        current.map((photo) =>
          photo.id === photoId
            ? { ...photo, likedByMe: payload.liked }
            : photo,
        ),
      );
    } catch {
      setPhotos(previous);
    } finally {
      setPendingLikeId(null);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-col gap-4 border-b border-zinc-200 pb-4">
        <div className="flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleLogout}
            className="h-10 rounded-lg border border-zinc-200 px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Log out
          </button>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            className="inline-flex h-10 items-center gap-1 rounded-lg border border-zinc-200 px-3 text-sm font-medium text-zinc-800"
          >
            Popular
            <span aria-hidden="true">▾</span>
          </button>
          <nav
            aria-label="Categories"
            className="flex max-w-full gap-4 overflow-x-auto pb-1 text-sm text-zinc-500"
          >
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`shrink-0 whitespace-nowrap transition ${
                  activeCategory === category
                    ? "font-semibold text-zinc-900"
                    : "hover:text-zinc-800"
                }`}
              >
                {category}
              </button>
            ))}
          </nav>
          <button
            type="button"
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border border-zinc-200 px-3 text-sm font-medium text-zinc-700"
          >
            <FiltersIcon />
            Filters
          </button>
        </div>
      </header>

      {error ? (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p>{error}</p>
          <button
            type="button"
            className="mt-2 font-semibold underline"
            onClick={() => void loadPage(page, page === 1)}
          >
            Retry
          </button>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {photos.map((photo) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            likePending={pendingLikeId === photo.id}
            onToggleLike={handleToggleLike}
          />
        ))}
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="animate-pulse">
                <div className="aspect-[4/3] rounded-xl bg-zinc-200" />
                <div className="mt-3 h-4 w-2/3 rounded bg-zinc-200" />
              </div>
            ))
          : null}
      </div>

      <div ref={sentinelRef} className="h-10 w-full" aria-hidden="true" />

      {!hasMore && photos.length > 0 ? (
        <p className="py-8 text-center text-sm text-zinc-500">
          You&apos;ve reached the end of the feed.
        </p>
      ) : null}
    </div>
  );
}

function FiltersIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 stroke-current" fill="none" aria-hidden="true">
      <path strokeWidth="2" d="M4 7h16M7 12h10M10 17h4" />
    </svg>
  );
}
