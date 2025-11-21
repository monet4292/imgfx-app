# Change: Integrate MusicFX for music generation

## Why
Extend ImageFX to generate music from prompts via MusicFX, enabling playback and optional history.

## What Changes
- Add API shim calling MusicFX `v1:soundDemo` to produce 1–2 clips (30s each).
- Add UI form for prompts and playback/download of results.
- Log events via `general.submitBatchLog` for usage tracking.

## Impact
- Affected specs: `specs/music-generation`
- Affected code: new MusicFX API route, MusicFx client/service, UI form + player, history entry for music clips.
