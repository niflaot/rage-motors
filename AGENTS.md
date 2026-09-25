<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Rage Motors frontend rules

This repository contains only the Rage Motors frontend. Backend behavior belongs
in the appropriate service and must be consumed through documented API contracts.

## Architecture

- Keep `src/app/**/page.tsx` and `src/app/**/layout.tsx` as thin framework shims.
- Put page bodies in `src/view/{domain}/{area}/NameView/NameView.tsx`.
- Put shared provider and shell composition in `src/layout/*`.
- Put reusable UI in `src/components/*` and reusable product logic in
  `src/features/*` or `src/lib/*`.
- Put React contexts in `src/context/{domain}/NameContext/NameContext.tsx`.
- Keep folders focused, preferably below six source files, and split files before
  they become difficult to scan (normally around 250 lines).
- Use semantic HTML whenever an element has document meaning.

## TypeScript and React

- Use strict TypeScript. Avoid `any`; prefer `unknown`, generics, and narrow types.
- Prefer readonly response and UI data shapes.
- Document every type, interface, function, component, and meaningful constant
  with TSDoc, including private helpers and test harnesses.
- Declare React components as typed constants and default-export each folder's
  primary component.
- Use PascalCase component folders and colocate tests as
  `Component/Component.test.tsx`.
- Put private view or component sections in `parts/Name.tsx` with a colocated test.
- Name plain TypeScript files with lower dashed case.
- Use single quotes and omit semicolons in TypeScript, TSX, and configuration files.
- Keep every user-facing string in the `next-intl` message catalogs. Store stable
  translation keys, never display copy, in configuration.

## Internationalization

- Localization is request-scoped and must not add locale segments to URLs.
- Resolve the locale from the `locale` cookie in `src/i18n/request.ts`, with the
  configured default as a safe fallback.
- Add supported languages to `src/i18n/locales.ts` and `messages/{locale}.json`.
- Use `next-intl` APIs for text, dates, numbers, and lists.

## Product quality

- Every interactive element needs semantic behavior, keyboard access, a visible
  focus state, and an accessible name.
- Give icon-only buttons an `aria-label` and hide decorative icons from assistive
  technology.
- Pair hover affordances with `focus-visible` affordances.
- Use shared validation contracts for forms, reserve accessible field-level error
  regions, and never rely only on a toast for validation failures.
- Use route-shaped skeletons for loading states.

## Workflow and Git hygiene

- Do not overwrite user changes.
- Do not commit generated output, dependency caches, local environment files,
  editor metadata, coverage, or `plan/`.
- Run `npm run verify` before considering frontend work complete.
