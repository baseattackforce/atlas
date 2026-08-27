# Validation report

## Static checks — passed

- Babel parsed both generated scripts in classic-script mode with async,
  dynamic-import, optional-chaining, destructuring, template-literal, and class
  syntax enabled.
- `node --check loader.js` passed.
- `node --check main.js` passed.
- `git diff --check` passed.
- The originals retained their baseline SHA-256 hashes listed in
  `DEOBFUSCATION.md`.
- `git status --short --branch` reported only the new `deobfuscated/` directory.

## Pattern comparison

| File | Unicode escapes | Literal reverse chains | Literal numeric XOR | `_0x*` identifiers |
| --- | ---: | ---: | ---: | ---: |
| Original loader.js | 2,514 | 18 | 68 | 22 |
| Readable loader.js | 0 | 0 | 0 | 4 |
| Original main.js | 19,221 | 272 | 857 | 1,609 |
| Readable main.js | 0 | 0 | 0 | 66 |

The remaining identifiers are program-scope bindings retained to preserve the
classic-script global contract. All private bindings in scopes without direct
`eval` or `with` have been either proven inert and removed or renamed through
Babel binding operations.

## Public contracts reviewed

The readable loader retains the bootstrap global assignments, asset paths,
service-worker registration path, Wisp protocol byte layout, dynamic imports,
and the ordering of UI mounting and inline-script execution. The generated
files were not executed during transformation.

`main.html` was scanned without modification. Its inline handler references
identified by a conservative attribute scan were `alert` and `toggleSettings`;
the latter remains a classic-script global in `main.js`.

An AST inventory comparison confirmed exact equality of both scripts' top-level
function declaration sets and direct `window` assignment sets. A second run of
the transformer was byte-identical for both generated scripts and reported zero
additional transformations, establishing a transformation fixed point.

## Read-only production baseline

The planned read-only startup capture for `https://opium.best/` could not be
completed: a fresh browser navigation failed before page execution with
`net::ERR_SSL_PROTOCOL_ERROR`. No production data was changed, no deployment
occurred, and no external payload or extension was executed.

Consequently, no browser differential run was possible. Dynamic flows relying
on the service worker, CDN, Wisp, WebRTC, cloud gaming, and third-party APIs
remain untested. The static transformations are deliberately conservative, but
this report does not claim a live behavioral comparison that was not performed.

## Local differential loader run — passed

A disposable localhost harness loaded the original and readable `loader.js`
files under the same browser environment. It stubbed only the unavailable
service-worker registration, transport module, Scramjet controller, and external
script loading; `main.html` was fetched from the original repository. The
normalized observations were exactly equal:

- Jet script-load order: `jet.core.js`, `jet.api.js`, `jet.utils.js`;
- service-worker registration path (`sw.js`) and update call;
- controller construction, prefix (`/~/`), and wait ordering;
- resolved `main.js` asset URL;
- global types for all bootstrap globals;
- controller path configuration; and
- shadow-root child count.

This does not replace a production run: real service-worker execution, Wisp
probing, network transport, and the full main-script UI flows remain externally
dependent and untested.

## Local differential main-startup run — passed

The companion harness then permitted each loader to load its matching
`main.js`. Its normalized observations were exactly equal for original and
readable variants:

- bootstrap and script-load event sequence;
- public UI function types: `toggleSettings`, `openGames`, `openEffects`, and
  `navigate`;
- presence of the search, settings, games, effects, bottom-navigation, and star
  canvas nodes in the closed-shadow-root UI; and
- shadow-root child count.

Both variants produced the same expected `ReferenceError` for `$scramjetUtils`,
because the harness intentionally replaces Jet script execution with a load
stub. This demonstrates equal behavior under that constrained environment; it
does not qualify the unexecuted Jet, Wisp, cloud-gaming, or third-party-network
paths as production-tested.

## Actual local readable-runtime startup — passed

After adding the public repository's real service worker to the separate local
host, the readable runtime booted normally at `http://127.0.0.1:8765/app.html`.
Visual inspection confirmed the rendered Opium home UI, stars, search box,
shortcuts, game control, and bottom navigation. The original Synergy checkout
remained unchanged; this host is separate from the repository runtime and no
build ran.

## Explicitly untouched assets

`main.html`, `404.html`, `ckv.json`, `ugs.json`, `curl/index.mjs`,
`pox/index.mjs`, and all `jet/*` assets—including `jet.wasm`—were untouched.

No build, deployment, commit, production modification, or replacement of the
original runtime files was performed.
