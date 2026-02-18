# Scentra

Scentra is a social fragrance app built with Next.js App Router, Prisma/PostgreSQL, and NextAuth.

## Core features

- Email/password signup and login.
- Personal fragrance collections.
- Wear Today recommendations from your own collection using weather-aware heuristics.
- Follow/follower relationships and profile pages.
- WOTD posting and feed from people you follow.

## Required environment variables

Create a `.env` file:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/scentra"
NEXTAUTH_SECRET="replace-with-strong-secret"
NEXTAUTH_URL="http://localhost:3000"
WEATHER_PROVIDER="openweather"
WEATHER_API_KEY="your_openweather_api_key"
```

Notes:

- If `WEATHER_API_KEY` is missing or weather request fails, Wear Today uses a neutral fallback weather profile.
- `WEATHER_PROVIDER=none` forces fallback mode.

## Local development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start PostgreSQL:
   ```bash
   docker compose up -d
   ```
3. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```
4. Seed sample data:
   ```bash
   npm run db:seed
   ```
5. Start the app:
   ```bash
   npm run dev
   ```

## Vercel deploy notes

1. Import the repo into Vercel.
2. Add all required environment variables in Vercel Project Settings.
3. Redeploy after setting vars.
4. Build command can use:
   ```bash
   npm run vercel-build
   ```

## Key pages

- `/feed` – WOTD feed.
- `/wotd` – create a WOTD post.
- `/wear-today` – weather-aware wear recommendations.
- `/explore` – fragrance catalog/search.
- `/collection` – your personal collection.
- `/u/[username]` – user profile.
- `/u/[username]/collection` – public collection page.

## API endpoints

- `GET|POST|DELETE /api/collection`
- `POST /api/follow`
- `GET /api/following?username=...`
- `GET /api/followers?username=...`
- `POST /api/wotd`
- `GET /api/wotd/feed`
- `POST /api/recs/wear-today`
