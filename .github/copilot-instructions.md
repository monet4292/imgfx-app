<!-- Guidance for AI coding agents working on the ImageFX web app -->
# ImageFX — Copilot Instructions

This file gives focused, actionable context for an AI coding assistant working in this repository.

**Big picture**
- **What:** A Next.js (TypeScript + Tailwind) web UI for Google ImageFX model integration. The UI calls server-side API routes which in turn use `src/lib/core/*` classes to interact with Google ImageFX endpoints.
- **Flow:** UI -> `pages/api/*` -> `src/lib/core/ImageFX.ts` (uses `Account`, `Prompt`, `Image`) -> external Google endpoints (e.g. `labs.google/fx` and `aisandbox-pa.googleapis.com`).

**Key files & entry points**
- `src/pages/index.tsx` — main UI that posts to `/api/generate` and uses `CookieContext`.
- `src/pages/api/generate.ts` — API route that constructs `Prompt` and calls `new ImageFX(cookie).generateImage(...)`.
- `src/lib/core/ImageFX.ts`, `Account.ts`, `Prompt.ts`, `Image.ts` — core classes encapsulating external HTTP calls and data models.
- `src/context/CookieContext.tsx` — cookie is stored in `localStorage` under the key `GOOGLE_COOKIE` and provided to client pages.
- `src/lib/history.ts` — client-side history stored in `localStorage` key `imgfx_history`.
- `src/lib/utils.ts` and `src/components/ui/*` — UI helpers and primitives (Tailwind + `cn` helper).
- `package.json` — scripts: `dev` (`next dev --webpack`), `build` (`next build --webpack`), `start`, `lint`.
- `tsconfig.json` — path alias `@/*` maps to `./src/*` (use absolute imports like `@/lib/...`).

**Project-specific conventions and patterns**
- The code prefers small, Single Responsibility classes in `src/lib/core/` with custom `*Error` types and strict input validation — preserve these patterns when adding features.
- Network calls are performed inside the `ImageFX` and `Account` classes using `fetch`. Error handling wraps low-level errors into domain-specific errors (e.g. `ImageFXError`, `AccountError`).
- Images are returned/handled as base64 encoded strings and presented to the UI as data URLs: `data:image/png;base64,<encodedImage>` (see `src/pages/api/generate.ts` and `src/lib/core/Image.ts`).
- Client configuration is kept in `localStorage` (`GOOGLE_COOKIE`, `imgfx_history`) via the `CookieContext` and `history` helpers — prefer these helpers over ad-hoc localStorage access.
- Headers: `src/lib/core/Constants.ts` exports `DefaultHeader` (a `Headers` object) which is reused/mutated. Be careful when modifying it (it's shared behavior).

**Dev / build / debugging**
- Start dev server (PowerShell):
```
npm run dev
```
- Build and run production locally:
```
npm run build
npm run start
```
- Lint:
```
npm run lint
```
- To reproduce generation locally you must provide a valid Google session cookie. Either:
  - Configure it in the running UI (the app reads/writes `GOOGLE_COOKIE` in `localStorage` via the settings dialog), or
  - Call the API directly with a cookie in the body.

API example (POST to local dev server):
```bash
curl -X POST http://localhost:3000/api/generate \
  -H 'Content-Type: application/json' \
  -d '{"prompt":"A cyberpunk city","cookie":"<YOUR_GOOGLE_COOKIE>","count":2}'
```
PowerShell example using `Invoke-RestMethod`:
```powershell
$body = @{ prompt = 'A cyberpunk city'; cookie = '<YOUR_GOOGLE_COOKIE>'; count = 2 } | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:3000/api/generate -Method Post -Body $body -ContentType 'application/json'
```

**Security / secrets**
- The app requires a valid Google session cookie for the ImageFX calls. Do NOT commit cookies or paste them into commit diffs.
- When adding integrations, prefer reading the cookie from `CookieContext` or the API body — the current pattern expects an explicit cookie value sent to server-side handlers.

**Common edits pattern**
- Add features by extending `Prompt` (for request shape) and call paths through `ImageFX`. Keep network logic inside `src/lib/core` classes rather than scattering fetch calls in API routes.
- When changing headers or request shapes, update `Constants.ts` / `Prompt.toString()` and ensure `src/pages/api/generate.ts` and tests (if any) match the changes.

**Quick references for reviewers / PRs**
- Verify new features don't leak cookies into client logs or commit history.
- Ensure image payloads are still returned as base64 data URLs when changing output format.
- Maintain existing error-wrapping pattern (domain errors) so the UI can present human-friendly messages.

If anything in these instructions is unclear or you want additional examples (e.g., typical changes to `Prompt` or how to mock `Account.refreshSession` in tests), tell me which area to expand.
