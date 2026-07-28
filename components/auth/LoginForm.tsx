"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

type LoginFormProps = {
  initialError?: string | null;
};

export function LoginForm({ initialError = null }: LoginFormProps) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, remember }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(payload.error ?? "Informations de connexion invalides");
        return;
      }

      router.push("/photos");
      router.refresh();
    } catch {
      setError("Unable to sign in right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5" noValidate>
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-zinc-500 sm:text-base">
          Welcome back! Please enter your details.
        </p>
      </div>

      {error ? (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </div>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="username" className="text-sm font-medium text-zinc-700">
          Email
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          placeholder="Enter your email"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="h-11 rounded-lg border border-zinc-300 px-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-zinc-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-11 rounded-lg border border-zinc-300 px-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
          required
        />
      </div>

      <div className="flex items-center justify-between gap-3 text-sm">
        <label className="flex cursor-pointer items-center gap-2 text-zinc-600">
          <input
            type="checkbox"
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
            className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
          />
          Remember for 30 days
        </label>
        <button
          type="button"
          className="font-semibold text-zinc-900 hover:underline"
        >
          Forgot password
        </button>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex h-11 w-full items-center justify-center rounded-lg bg-zinc-900 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Signing in…" : "Sign in"}
      </button>

      <button
        type="button"
        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50"
      >
        <GoogleIcon />
        Sign in with Google
      </button>

      <p className="pt-2 text-center text-sm text-zinc-600">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          className="relative font-semibold text-zinc-900 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[3px] after:rounded-full after:bg-[radial-gradient(circle,_#a1a1aa_1.5px,_transparent_1.6px)] after:bg-size-[6px_3px]"
        >
          Sign up for free
        </button>
      </p>
    </form>
  );
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
      <path
        fill="#EA4335"
        d="M12 10.2v3.6h5.1c-.2 1.2-1.5 3.6-5.1 3.6-3.1 0-5.6-2.5-5.6-5.6S8.9 6.2 12 6.2c1.8 0 3 .7 3.7 1.4l2.5-2.4C16.7 3.7 14.5 2.7 12 2.7 6.9 2.7 2.7 6.9 2.7 12S6.9 21.3 12 21.3c5.2 0 8.6-3.6 8.6-8.7 0-.6-.1-1-.1-1.4H12z"
      />
      <path
        fill="#34A853"
        d="M3.9 7.4l3 2.2C7.7 7.5 9.7 6.2 12 6.2c1.8 0 3 .7 3.7 1.4l2.5-2.4C16.7 3.7 14.5 2.7 12 2.7 8.5 2.7 5.5 4.7 3.9 7.4z"
      />
      <path
        fill="#FBBC05"
        d="M12 21.3c2.4 0 4.5-.8 6-2.2l-2.9-2.2c-.8.5-1.8.9-3.1.9-3.5 0-6.5-2.4-7.5-5.6l-3 2.3c1.6 3.2 4.9 5.8 10.5 5.8z"
      />
      <path
        fill="#4285F4"
        d="M20.6 12.6c0-.6-.1-1-.1-1.4H12v3.6h5.1c-.3 1.2-1.1 2.2-2.2 2.9l2.9 2.2c1.7-1.6 2.8-4 2.8-7.3z"
      />
    </svg>
  );
}
