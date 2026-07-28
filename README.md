# GrowHR Web Challenge (Option 2)

Next.js App Router application for authentication, Unsplash photo browsing with infinite scroll, and per-user likes stored in LevelDB.

## Features

- **Authentication** with the three required challenge scenarios
- **Photo listing** via the Unsplash API with infinite scroll
- **Likes** persisted in LevelDB for the signed-in user
- **Responsive UI** inspired by the provided login and gallery mocks
- **Unit tests** for auth, session, seed, likes, validation, and key UI pieces

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- LevelDB (`level`) for users and likes
- JWT session cookie (`jose`)
- Zod validation
- Vitest + Testing Library

## Getting started

```bash
npm install
cp .env.example .env.local
```

Fill `.env.local`:

```env
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
SESSION_SECRET=a-long-random-secret-at-least-16-chars
```

Then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Test accounts

| Username | Password | Expected result |
|----------|----------|-----------------|
| `muser1` | `mpassword1` | Success → `/photos` |
| `muser2` | `mpassword2` | Success → `/photos` |
| `muser3` | `mpassword3` | Error: `Ce compte a été bloqué.` |
| anything else | — | Error: `Informations de connexion invalides` |

The login field is labeled **Email** but accepts these usernames.

## Scripts

```bash
npm run dev      # development server
npm run build    # production build
npm run start    # production server
npm run lint     # ESLint
npm test         # unit tests
npm run test:watch
```

## Architecture

- `app/api/auth/*` — login, logout, current user
- `app/api/photos` — Unsplash proxy + `likedByMe` flags
- `app/api/likes` — toggle like for the current user
- `lib/db.ts` — Level singleton (Node runtime)
- `lib/repositories/*` — user and like access
- `middleware.ts` — protects `/photos` and related APIs

### LevelDB keys

- `user:{username}` → `{ username, passwordHash, status }`
- `like:{userId}:{photoId}` → `{ createdAt }`

Data is stored under `./data/leveldb` (gitignored).

## UI notes

Best-effort reproduction of the provided mocks:

- Split login layout on large screens; form-first on mobile
- Gallery filters / Popular / Google sign-in / Sign up / Forgot password are decorative (not required by the challenge scenarios)

## Security notes

- Keep Unsplash keys and `SESSION_SECRET` in `.env.local` only
- Never commit secrets
- Unsplash requests are server-side only
