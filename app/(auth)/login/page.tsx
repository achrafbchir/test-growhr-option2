import Image from "next/image";
import { LoginForm } from "@/components/auth/LoginForm";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1600&q=80";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-16">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </section>

        <section className="relative hidden min-h-[420px] overflow-hidden lg:block">
          <Image
            src={HERO_IMAGE}
            alt="Professional standing in front of a bookshelf"
            fill
            priority
            className="object-cover"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

          <div className="absolute inset-x-8 bottom-8 rounded-2xl border border-white/30 bg-white/20 p-6 text-white shadow-lg backdrop-blur-md sm:inset-x-10 sm:bottom-10 sm:p-8">
            <div className="mb-4 flex items-start justify-between gap-4">
              <p className="max-w-xl text-xl font-medium leading-relaxed sm:text-2xl">
                &ldquo;We&apos;ve been using Untitled to kick start every new
                project and can&apos;t imagine working without it.&rdquo;
              </p>
              <div className="flex shrink-0 gap-0.5 text-white" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, index) => (
                  <StarIcon key={index} />
                ))}
              </div>
            </div>

            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-semibold">Andi Lane</p>
                <p className="text-sm text-white/85">Founder, Catalog</p>
                <p className="text-sm text-white/85">Web Design Agency</p>
              </div>
              <div className="flex gap-2">
                <span className="flex size-10 items-center justify-center rounded-full border border-white/70 text-lg">
                  ←
                </span>
                <span className="flex size-10 items-center justify-center rounded-full border border-white/70 text-lg">
                  →
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 20 20" className="size-4 fill-current" aria-hidden="true">
      <path d="M10 1.5l2.5 5.1 5.6.8-4 3.9.9 5.6L10 14.8 4.9 17l.9-5.6-4-3.9 5.6-.8L10 1.5z" />
    </svg>
  );
}
