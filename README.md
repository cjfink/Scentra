# Scentra MVP

Scentra is a social fragrance network MVP built with Next.js App Router, Prisma + PostgreSQL, NextAuth, Tailwind, and TypeScript.

## Features
- Auth (credentials + OAuth-ready via GitHub)
- User profiles (`/u/[username]`) with tags and notes
- Seeded fragrance catalog with image URLs
- Explore page with filters
- Collection management with typeahead + image previews
- WOTD feed with likes/comments API
- Collection gap recommendation heuristic
- Wear-today recommendations based on weather and preferences

## Tech Stack
- Next.js 14 + TypeScript + Tailwind
- shadcn-style UI primitives + lucide-react
- Prisma + PostgreSQL
- NextAuth
- Zod validation

## Setup
1. Copy envs:
   ```bash
   cp .env.example .env
   ```
2. Start postgres:
   ```bash
   docker compose up -d
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Generate/migrate db:
   ```bash
   npm run db:migrate
   ```
5. Seed data:
   ```bash
   npm run db:seed
   ```
6. Start app:
   ```bash
   npm run dev
   ```

Demo credentials after seed:
- email: `demo@scentra.app`
- password: `demo1234`

## Scripts
- `npm run dev`
- `npm run db:migrate`
- `npm run db:seed`
- `npm run lint`
