# Atlas upstream integration — November 9, 2026

Target: tongsherbet/storage@f6f11c468dcbb7cc0628a5e7d072aaee20b7ed62, compared against the October 28 port baseline 050d21c0d66b641c420bb03bc7fe5965cd26b696. Review branch only; this is not a production-readiness claim.

Includes tab navigation/history/restoration/audio/unloading, Movies/TV discovery/library/player, AI tool-event/retry/edit/screenshare changes, shortcut editing, catalog freshness, and updated curl/worker code. Atlas theme, DuckDuckGo default, UTF-8 Base64url codec, bounded AI reconnection, scoped data clearing and lazy games SDK are retained. AI reasoning remains a non-expandable status; prompt context, chemistry restriction and domain-only response replacement are preserved, including content split across chunks/tool steps. The imported worker's missing error-response return is corrected. Cloaking helpers escape embedded URLs and reject non-HTTP(S) destinations.

Excluded: Cobalt, Roblox placeholder/integration, upstream ads/tracking/lockout, font obfuscation and seasonal design. Desktop is the target; tablet layout is secondary, phone support is outside scope.

Verification: source/owned smoke checks cover tabs, persistence, game/catalog navigation, settings, bookmarks, safe rendering, streamed AI/tool events and restrictions. Actual browser tests passed AI streaming/Markdown, proxied IANA browsing, bookmark editing, tab restore, catalog loading and 2048 play/keyboard input. Movies search/details passed, but Night of the Living Dead and Big Buck Bunny did not obtain playable external sources. Cloud status reports unavailable; its release toggle stays hidden. Real movie/cloud playback is not verified. No Synergy account rules or production database changes are part of this port.
