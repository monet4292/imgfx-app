## 1. Implementation
- [x] 1.1 Create MusicFx service/hook to call POST `v1:soundDemo` (prompt, generationCount 1-2, 30s, loop false, model DEFAULT) and handle Blob/JSON response.
- [x] 1.2 Add Next.js API shim route that receives prompt + cookie, calls the service, returns metadata + safe URLs (object URL or short-lived base64).
- [x] 1.3 Update UI: prompt form + clip count selector, Generate button, loading state, render clips with Play/Download and model/duration.
- [x] 1.4 Send `general.submitBatchLog` after each call (success/failure) without logging tokens.
- [x] 1.5 Error handling: clear messaging for missing cookie 401, credit/rate-limit 429, timeout 60s; cleanup Blobs to avoid leaks.

## 2. Quality
- [ ] 2.1 Manual QA: 2 different prompts, verify 2 clips returned, playback OK, downloadable.
- [x] 2.2 `npm run lint` passes.

## 3. Docs
- [ ] 3.1 Update `docs/plan/musicfx-create-music-plan.md` if scope differs.
- [ ] 3.2 Add cookie/curl guidance to docs/testing if needed.
