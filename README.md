# Atlas

Atlas application assets maintained in `baseattackforce/atlas`, loaded by Synergy's authenticated, same-origin launcher. This functional port derives from `tongsherbet/storage` revision `050d21c0d66b641c420bb03bc7fe5965cd26b696` and retains Atlas's theme and Synergy integration. The source and runtime remain attributed to their upstream contributors; design inspiration is credited to GUST in the application.

## Application and runtime

- `loader.js`, `main.html`, `main.js`: application bootstrap and features.
- `markdown.js`: local escaped/sanitized Markdown rendering with no external rendering dependency.
- `atlas-tobacco.css`: Atlas's retained theme and compatibility fixes for the imported feature DOM.
- `ugs.json`, `ckv.json`, `404.html`: application catalogs and fallback page.
- `url-codec.js`: UTF-8 Base64url codec with legacy percent-link decoding. It must remain self-contained and must not be obfuscated into a closure: Jet serializes these functions into frame/worker contexts.
- `sj/*`: the matching Jet runtime copied from the exact upstream revision above, including its WebAssembly asset. This runtime uses `$jetController` and must remain coordinated with the loader and Synergy worker.
- `curl/*`, `pox/*`: transport modules from that same upstream revision.
- Legacy `jet/*` is retained for compatibility/reference. The updated loader requests `sj/*`; it does not mix the legacy `$scramjetController` runtime with the current application.

The imported AI, Lumin and Stratus features rely on upstream live services. Static assets hosted here do not implement those backends. The port omits upstream advertising/lockout scripts, upstream analytics, device-bound encoding, and font/text obfuscation. Lumin loads on demand; cloud availability is checked when requested. Functional worker liveness and active socket/session keepalives remain enabled.

## Synergy integration

Before loading `loader.js`, the host sets:

```js
window.assetsBase = 'https://cdn.jsdelivr.net/gh/baseattackforce/atlas@<commit-sha>/';
window.atlasAppBase = new URL('./', location.href).href;
window.swPath = new URL('sw.js', location.href).pathname;
```

`assetsBase` resolves every application/runtime asset against one owned-repository revision. The loader's `@main` fallback is for development; production hosts must set an immutable commit pin. `atlasAppBase` and `swPath` remain the host's same-origin worker scope, never the CDN path. Synergy must update its local worker's `sj/jet.sw.js` import to the same commit. The loader accepts a host-provided `AtlasUrlCodec`, or loads this repository's codec when absent.

The HTML script sources are relative asset names. The loader explicitly resolves them against `assetsBase` before injecting them, so `markdown.js` and `main.js` do not accidentally come from the host's `/atlas/` folder. No account/device policy belongs in these public application assets; Synergy retains its auth gate.

## Verification and release

This preparation is source only. It does not deploy or change Synergy production. Syntax-check loader, main, Markdown and codec scripts, then run the Synergy app smoke suite against these files and a browser walkthrough with a test asset server providing CORS and correct JavaScript/WebAssembly MIME types. Exercise Home/Browse/Library/Sound/Settings/AI switching, bookmarks, model/history/attachment controls, Markdown, and worker upgrade before release.

After committing and reviewing these assets, use the resulting commit SHA in both Synergy's launcher and worker. Verify every pinned asset is available on the CDN before deploying Synergy.

`tools/transform-synergy.js` performs conservative AST source cleanup; `tools/verify-contracts.js` compares top-level function/global inventories before and after that cleanup. They are not a bundler, runtime-upgrade test, or deployment system.
