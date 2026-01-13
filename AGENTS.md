# Repository Guidelines

## Project Structure & Module Organization
- `app/` uses the Next.js App Router. Route groups live in `app/(root)` and `app/(auth)`.
- `components/` holds shared UI and layout pieces; `components/ui` contains shadcn-style primitives.
- `lib/` includes server actions, validators, utilities, and constants.
- `db/` contains Prisma helpers plus `seed.ts` and sample data.
- `prisma/` stores `schema.prisma` and migrations.
- `assets/` and `public/` hold global styles and static images.

## Build, Test, and Development Commands
- `npm run dev`: start the local Next.js dev server.
- `npm run build`: create the production build.
- `npm run start`: run the production server from `.next/`.
- `npm run lint`: run ESLint with the Next.js config.
- `npx prisma migrate dev --name <name>`: apply schema changes locally.
- `npx prisma studio`: inspect the local database.
- `npx tsx ./db/seed`: seed sample data.

## Coding Style & Naming Conventions
- TypeScript + React, 2-space indentation, double quotes, and semicolons (match existing files).
- Components use `PascalCase`; variables and functions use `camelCase`.
- Route folders are kebab-case (e.g., `sign-in`, `shipping-address`).
- Prefer Tailwind utility classes; keep global CSS in `assets/styles/globals.css`.

## Testing Guidelines
- No automated test framework is configured yet. Use `npm run lint` plus manual smoke checks.
- If you add tests, place them near the feature and document how to run them.

## Commit & Pull Request Guidelines
- Commit messages are short, imperative, and sometimes prefixed with a type (`docs:`, `fix:`).
- PRs should include a clear summary, testing notes, and screenshots for UI changes.

## Configuration & Data
- Required environment variables live in `.env` (do not commit secrets).
- Update `prisma/schema.prisma` alongside migrations when models change.
