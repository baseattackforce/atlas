# Synergy readable-source copy

## Scope and provenance

This directory is a separate readable-source copy of the following Synergy files:

| Original | Readable copy |
| --- | --- |
| `loader.js` | `loader.js` |
| `main.js` | `main.js` |

The source baseline was commit `86b8c39d774cc5e8d2b40235ef78e65b6c43d112`.
The original files were not replaced or edited. Baseline SHA-256 values are:

| File | SHA-256 |
| --- | --- |
| `loader.js` | `51811307481E4A39E82ECABB5304A9FEE1542F4B73D6D86CC338840E20717C94` |
| `main.js` | `7EDCB395E8151CCD68FC51A90C2965A29607450D92AD1BFC74C1123EE1B66A9D` |
| `main.html` | `CBFAEF9F80E3C76569D2BA12B9F3F843C78B07C5BDF0A98C511383D814757CDC` |

Historical read-only naming references inspected: `101ddd63:loader.js` and
`bcf4f17:main.js`. They were not substituted into the current source.

## Transformation method

`tools/transform-synergy.js` parses classic browser scripts using Babel and
regenerates them. It never evaluates a target script. The only transformations
are AST-local and semantics-preserving:

- decode Unicode-escaped string spellings without changing their string values;
- fold literal-only arithmetic and bitwise operations;
- fold the exact empty-array boolean idioms;
- decode a literal `.split("").reverse().join("")` chain;
- replace computed properties with dot properties only for valid identifiers;
- remove an `_0x*` binding only when it has no reads and all writes are
  standalone pure assignments; top-level `var` is retained, while a
  function-local `var` is eligible only when its function has neither direct
  `eval` nor `with`;
- apply eight scope-aware descriptive local renames in `loader.js` only.
- rename remaining private `_0x*` bindings in eval/with-free lexical scopes to
  neutral role names such as `elementN`, `itemsN`, `optionsN`, `callbackN`, and
  `localValueN`. Program-scope names are retained.

No statements were reordered. No URLs, selectors, storage keys, protocol
arrays, HTML/CSS strings, extension payloads, public global names, or `main.html`
were edited intentionally.

## Transformation counts

| Pass | loader.js | main.js |
| --- | ---: | ---: |
| Unicode spellings decoded | 98 | 670 |
| Empty-array booleans folded | 0 | 150 |
| Literal reverse chains decoded | 18 | 272 |
| Literal arithmetic / XOR folds (to fixed point) | 80 | 1,119 |
| Safe member-property normalization | 213 | 1,605 |
| Proven unread local bindings removed | 9 | 146 |
| Associated pure writes removed | 9 | 146 |
| Scope-aware loader renames | 8 | 0 |
| Scope-aware private-local renames | 0 | 349 |

The remaining `_0x*` identifiers (4 in `loader.js`, 66 in `main.js`) are
program-scope declarations. They were not renamed or removed because a classic
script can expose them to outside callers. Retaining them is safer than changing
the global contract.

## Runtime contract retained

The loader retains the bootstrap globals and timing-sensitive behavior around
`window.devMode`, `window.swPath`, `window.assetsBase`, `window.getAsset`,
`window.wispServer`, `window.WispPing`, `window.transport`, `window.controller`,
and `window.shadowRoot`. It retains service-worker registration, Wisp probing,
transport creation, Scramjet configuration, closed-shadow-root mounting, and
the `Document` query bridge.

The main script remains a classic script; named UI functions remain at script
scope. `main.html` was intentionally left unchanged.

## Tooling

The isolated Babel dependencies and the reproducible transformer live under
`tools/`; they are not part of the Synergy application dependency graph. Run
the transformer with Node after setting `NODE_PATH` to `tools/node_modules`.
Do not rebuild the application as part of this workflow.

`tools/runtime-harness/` contains read-only local differential harnesses for
the loader and main UI startup. They serve the original and readable scripts
under one localhost origin, stub only unavailable external bootstrap
dependencies, and compare observable traces and startup DOM contracts.

## Local readable runtime

`tools/runtime-harness/app.html` is a separate localhost host for the readable
copies. It serves `loader.js` and `main.js` from this directory, while using the
repository's unchanged Jet/curl assets. Its `sw.js` is the production-compatible
service worker copied verbatim from the read-only public `opiumbest/svg`
repository (`d40bdeaaacad7248ab404e66877a09f0a002063a`), which supplies the Jet
service-worker runtime absent from the local Synergy checkout.

Run `tools/runtime-harness/server.py` with Python, then open
`http://127.0.0.1:8765/app.html`. No build step is required.

This readable source targets equivalent observable behavior, not byte-for-byte
identity. See `validation-report.md` for checks run and runtime-validation
limitations.
