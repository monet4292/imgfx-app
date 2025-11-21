<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

## Top-Level Rules
- Execute multiple independent processes **concurrently, not sequentially**
- **Do not** use `any` or `unknown` types in TypeScript
- You must not use TypeScript `class` unless absolutely necessary
- All markdown file must be in folder docs/
- Testing guide markdown file must be in folder docs/testing/
- Plan guide markdown file must be in folder docs/plan/
- Architecture guide markdown file must be in folder docs/architecture/
- Design guide markdown file must be in folder docs/design/

## Project Structure & Module Organization
ImageFX is a Next.js (Pages Router) app under `src/`. Route components and API handlers live in `src/pages` (`index.tsx`, `gallery.tsx`, `api/generate.ts`) and should remain thin shims over the domain classes in `src/lib/core` (`ImageFX.ts`, `Account.ts`, `Prompt.ts`, `Image.ts`). Shared UI primitives are in `src/components` (plus `components/ui/*`), with cross-cutting contexts and helpers in `src/context` and `src/lib/history.ts`. Static assets sit in `public/`, docs and long-form specs can go in `docs/`, and `.github/` houses agent instructions. Use the `@/*` alias defined in `tsconfig.json` to avoid brittle relative imports.

## Build, Test, and Development Commands
- `npm run dev` – starts the webpack-backed dev server at http://localhost:3000 with hot reload.
- `npm run build` – compiles production assets and will fail on type or ESLint errors.
- `npm run start` – serves the `.next` output for smoke-testing a build.
- `npm run lint` – runs ESLint (Next.js core-web-vitals + TypeScript); fix or annotate warnings before pushing.  
Install dependencies once with `npm install`. Provide a valid Google `GOOGLE_COOKIE` in the UI settings so `/api/generate` calls succeed.

## Coding Style & Naming Conventions
TypeScript is mandatory; keep explicit prop and API payload types and leverage discriminated unions for request variants. Follow the existing two-space indentation, trailing commas, and single quotes seen in `src/pages/index.tsx`. Components and contexts use PascalCase filenames, hooks stay camelCase, and Next routes mirror their URL (`caption.tsx`). Compose UI with Tailwind 4 utilities inside JSX; global overrides belong in `src/styles`. Domain logic should remain inside the `src/lib/core` classes with custom error types instead of ad-hoc `fetch` calls in components.

## Testing Guidelines
There is no automated test suite yet, so treat linting plus manual QA as required. When adding tests, colocate them under `src/lib/__tests__/` or `src/pages/__tests__/` using filenames like `ImageFX.test.ts` and mock external `fetch` plus `CookieContext` to avoid leaking real cookies. During manual verification, run `npm run dev`, exercise `/api/generate` with the `curl` example from `.github/copilot-instructions.md`, and confirm `imgfx_history` updates in localStorage.

## Commit & Pull Request Guidelines
The sandbox does not expose git history, so adhere to Conventional Commit prefixes (`feat: gallery view`, `fix: guard cookies`) for clarity. Keep commits scoped to one behavior change and include relevant files (UI plus API) together. PRs must describe the motivation, list the commands executed (`npm run lint`, `npm run build`), link any issues, and attach screenshots or screen recordings for UI changes. Call out handling of secrets (no real cookies) and note any migrations that impact `history.ts`.

## Security & Configuration Tips
Never log or commit the real Google session cookie; rely on `CookieContext` (stores `GOOGLE_COOKIE`) and pass cookies to API routes via the request body. History is persisted in `localStorage` under `imgfx_history`; migration scripts should preserve existing entries. Future secrets belong in `.env.local` (ignored by git). When editing `src/lib/core/Constants.ts`, remember the exported `DefaultHeader` object is shared—clone it before mutating to avoid bleeding headers between requests.