# Anime Website

A full-stack anime streaming platform template built with **Next.js**, **NextAuth**, and **Prisma** for licensed/owned content distribution.

## Features

- Google sign-in, Apple sign-in, and optional email/password authentication
- User dashboard with:
  - recent activity
  - continue watching
  - watch history
- Anime catalog with title search and browsing
- Structured content model:
  - Anime series
  - Seasons per anime
  - Episodes per season
- Episode playback pages supporting long-form videos (1 hour+)
- Admin UI to add/manage:
  - anime title/description/cover/metadata
  - seasons
  - episodes and video URLs

## Tech stack

- Next.js 16 (App Router, TypeScript)
- NextAuth (Google, Apple, Credentials)
- Prisma ORM
- SQLite (default for solo/development)
- Tailwind CSS

## Licensing and content rights

Only upload and distribute anime content you own or are licensed to distribute.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp .env.example .env
```

3. Update OAuth credentials in `.env` (Google/Apple are optional but supported).

4. Generate Prisma client and apply schema:

```bash
npm run prisma:generate
npm run prisma:push
```

5. Seed sample data (development-only sample admin + sample anime):

```bash
npm run prisma:seed
```

6. Start development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Development sample admin (seed)

- Email: `admin@example.com`
- Password: `admin123`

This account is for local development only. Replace or rotate seeded credentials before any shared/staging/production deployment.

## Project routes

- `/` Home + quick search
- `/auth/login` Authentication (OAuth + email/password)
- `/anime` Catalog + search
- `/anime/[animeSlug]` Anime details with seasons and episodes
- `/watch/[episodeId]` Episode playback page
- `/dashboard` User dashboard (auth required)
- `/admin` Admin content management (admin role required)

## Production notes

- Replace SQLite with PostgreSQL for production scale.
- Store videos in dedicated object/video storage (S3, Mux, Cloudflare Stream, etc.).
- Configure secure OAuth callback URLs for Google and Apple.
- Set a strong `NEXTAUTH_SECRET`.
- Remove development seed credentials and provision admin users securely.
