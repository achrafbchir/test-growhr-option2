"use client";

import Image from "next/image";
import type { PhotoDto } from "@/lib/types";
import { LikeButton } from "@/components/photos/LikeButton";

type PhotoCardProps = {
  photo: PhotoDto;
  onToggleLike: (photoId: string) => Promise<void> | void;
  likePending?: boolean;
};

export function PhotoCard({ photo, onToggleLike, likePending }: PhotoCardProps) {
  return (
    <article className="flex flex-col gap-2">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-zinc-100">
        <Image
          src={photo.thumbUrl}
          alt={photo.alt}
          fill
          className="object-cover transition duration-300 hover:scale-[1.02]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
        />
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          {photo.authorAvatar ? (
            <Image
              src={photo.authorAvatar}
              alt=""
              width={24}
              height={24}
              className="size-6 rounded-full object-cover"
            />
          ) : (
            <span className="flex size-6 items-center justify-center rounded-full bg-zinc-200 text-[10px] font-semibold text-zinc-600">
              {photo.authorName.slice(0, 1).toUpperCase()}
            </span>
          )}
          <p className="truncate text-sm font-medium text-zinc-800">
            {photo.authorName}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 text-zinc-500">
          <LikeButton
            photoId={photo.id}
            liked={photo.likedByMe}
            likesCount={photo.likesCount}
            disabled={likePending}
            onToggle={onToggleLike}
          />
          {photo.viewsCount !== null ? (
            <span className="inline-flex items-center gap-1 text-sm">
              <EyeIcon />
              {formatCount(photo.viewsCount)}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-2" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function formatCount(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
  }
  return String(value);
}
