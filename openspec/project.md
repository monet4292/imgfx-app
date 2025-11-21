# Project Context

## Purpose
Next.js (Pages Router) web UI for Google ImageFX: users enter prompts or captions, server-side API routes proxy to core library to call Google endpoints, return base64 images, and persist history locally.

## Tech Stack
- TypeScript, React 19, Next.js 16 (Pages Router)
- Tailwind CSS v4, Radix UI primitives, class-variance-authority/clsx/tailwind-merge, lucide-react
- Node 18+, uuid for IDs, yargs for CLI args

## Project Conventions

### Code Style
- Two-space indent, single quotes, trailing commas; no `any`/`unknown`
- Avoid new `class` unless necessary; prefer functions and hooks
- Use `@/*` alias for imports; components/contexts PascalCase files, hooks camelCase, routes mirror URL
- Pages & API stay thin; domain logic lives in `src/lib/core/*`; reuse UI primitives in `src/components/ui`
- Clone `DefaultHeader` before mutation; keep files reasonably small (~<200 lines when feasible)
- All markdown docs live under `docs/` (plan/testing/architecture/design in their subfolders)

### Architecture Patterns
- Pages under `src/pages/*.tsx` render UI and call API; API routes in `src/pages/api/*` construct `Prompt` and call `ImageFX`
- Core domain: `ImageFX.ts`, `Account.ts`, `Prompt.ts`, `Image.ts` handle external calls, models, and errors
- State: `CookieContext` manages `GOOGLE_COOKIE`; history stored via `src/lib/history.ts` in `localStorage`
- Data flow: UI -> API route -> core library -> Google ImageFX -> base64 images -> UI/history

### Testing Strategy
- No automated suite yet; required: `npm run lint`; optional: `npx tsc --noEmit`
- Manual QA: run `npm run dev`, call `/api/generate` with POST body `cookie` to verify, check UI updates and localStorage history

### Git Workflow
- Conventional commits (`feat: ...`, `fix: ...`); one behavior change per commit
- No CI present; recommended pre-PR checks: `npm ci`, `npm run lint`, `npm run build`
- Never commit cookies or secrets

## Domain Context
- Integrates with Google ImageFX endpoints (`labs.google/fx/api`, `aisandbox-pa.googleapis.com`) for image generation/caption
- Requires valid Google session cookie stored in `localStorage` (`GOOGLE_COOKIE`) via CookieContext
- Images returned as base64; history capped (~50 items) in `localStorage`
- Models supported: IMAGEN_3, IMAGEN_3_5, IMAGEN_4 configured through `Prompt`

## Important Constraints
- Do not leak or log cookies; no server-side persistence
- Base64 payloads are large; respect memory and `localStorage` limits
- Follow existing structure/naming; avoid introducing new classes unnecessarily
- Keep documentation under `docs/` hierarchy

## External Dependencies
- Google ImageFX APIs (network + valid cookie required)
- Browser `localStorage` for auth/history persistence
- Radix UI + Tailwind CSS for UI; Next.js/Node runtime; no database/queue services
