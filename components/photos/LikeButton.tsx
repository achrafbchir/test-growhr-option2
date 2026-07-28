"use client";

type LikeButtonProps = {
  photoId: string;
  liked: boolean;
  likesCount: number;
  disabled?: boolean;
  onToggle: (photoId: string) => Promise<void> | void;
};

export function LikeButton({
  photoId,
  liked,
  likesCount,
  disabled = false,
  onToggle,
}: LikeButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={liked}
      aria-label={liked ? "Unlike photo" : "Like photo"}
      disabled={disabled}
      onClick={() => onToggle(photoId)}
      className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-1 text-sm text-zinc-600 transition hover:text-zinc-900 disabled:opacity-60"
    >
      <HeartIcon filled={liked} />
      <span>{formatCount(likesCount)}</span>
    </button>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  if (filled) {
    return (
      <svg viewBox="0 0 24 24" className="size-4 fill-rose-500" aria-hidden="true">
        <path d="M12 21s-6.7-4.3-9.3-7.3C.5 11.2 1 7.8 3.4 6.1c2-1.4 4.7-.9 6.1.8L12 9l2.5-2.1c1.4-1.7 4.1-2.2 6.1-.8 2.4 1.7 2.9 5.1.7 7.6C18.7 16.7 12 21 12 21z" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4 fill-none stroke-current stroke-2"
      aria-hidden="true"
    >
      <path d="M12 21s-6.7-4.3-9.3-7.3C.5 11.2 1 7.8 3.4 6.1c2-1.4 4.7-.9 6.1.8L12 9l2.5-2.1c1.4-1.7 4.1-2.2 6.1-.8 2.4 1.7 2.9 5.1.7 7.6C18.7 16.7 12 21 12 21z" />
    </svg>
  );
}

function formatCount(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
  }
  return String(value);
}
