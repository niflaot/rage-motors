# Rage Motors

Responsive Rage Motors site built with Next.js App Router, strict TypeScript,
Tailwind CSS, React Compiler, `next-intl`, Zod, and Better Auth. Persistent data
lives in PostgreSQL through same-origin Next.js Route Handlers and Prisma.

## Requirements

- Node.js 20.9 or newer
- npm 10 or newer

## Start locally

```bash
npm install
npm run prisma:deploy
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Discord authentication

The staff route at `/panel` uses Better Auth with Discord and a seven-day,
encrypted stateless session cookie. Copy `.env.example` to `.env.local`, then
provide:

- `BETTER_AUTH_SECRET` (at least 32 high-entropy characters)
- `BETTER_AUTH_URL` (for local development: `http://localhost:3000`)
- `DISCORD_CLIENT_ID`
- `DISCORD_CLIENT_SECRET`
- `DATABASE_URL`
- `AUTHORIZED_DISCORD_IDS` (Discord user IDs separated by commas)

In the Discord Developer Portal, register this OAuth2 redirect URL:

```text
http://localhost:3000/api/auth/callback/discord
```

Use the equivalent HTTPS URL for production. These private variables are
required when compiling and starting the full-stack application.

## Persistent request workflow

The contact form and the small staff catalog use shared Zod contracts and
persist their data directly in PostgreSQL through same-origin Route Handlers.
Browser storage is not used for catalog items, offers, or requests. Once
authenticated and authorized, requests appear in `/panel`, where staff can
complete or remove them.

Apply schema changes from this repository:

```bash
npm run prisma:generate
npm run prisma:migrate -- --name nombre_del_cambio
```

## Commands

| Command             | Purpose                                    |
| ------------------- | ------------------------------------------ |
| `npm run dev`       | Start the local Next.js server             |
| `npm run build`     | Create a production build                  |
| `npm run start`     | Run the production build                   |
| `npm run lint`      | Run ESLint with no warnings allowed        |
| `npm run format`    | Format the repository                      |
| `npm run typecheck` | Check strict TypeScript types              |
| `npm run test`      | Run the Vitest suite once                  |
| `npm run verify`    | Run every required quality check and build |

## Portainer

El stack reproducible para desplegar un commit específico de este repositorio
junto con PostgreSQL está documentado en [`deploy/README.md`](deploy/README.md). Incluye
un volumen persistente fijo para `mt-rage-postgres` y validación del SHA antes de
compilar la aplicación.

## Project structure

```text
messages/                    Translation catalogs
src/app/                     Thin Next.js route and layout shims
src/components/              Reusable UI components
src/features/                Reusable product behavior
prisma/                      PostgreSQL schema and migrations
src/i18n/                    Locale configuration and request resolution
src/layout/                  Shared shells and provider composition
src/view/                    Domain-facing route bodies
src/test/                    Shared test setup
```

## Internationalization without locale routes

URLs remain stable (`/`, `/precios`, and so on) and never include `/en` or
`/es`. The request configuration reads the `locale` cookie, validates it against
the supported locale list, and falls back to Spanish. The included language
switcher updates that cookie with a Server Action.

To add a language:

1. Add its locale identifier in `src/i18n/locales.ts`.
2. Add a matching `messages/{locale}.json` catalog.
3. Add its translated label to every existing catalog.

## Coding conventions

Source and configuration files use single quotes and no semicolons. Prettier
enforces these rules. All application declarations use TSDoc, route files stay
thin, user-facing copy comes from translation catalogs, and component tests live
beside the components they cover. See `AGENTS.md` for the complete repository
rules.
