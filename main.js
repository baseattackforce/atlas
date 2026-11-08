// Functional port of tongsherbet/storage@050d21c0d66b641c420bb03bc7fe5965cd26b696, with Synergy's existing Atlas theme.
const sjEncode = e => new URL('./~/', location.href).pathname + controller.config.codec.encode(e), SHORTCUTS = [{
  "label": "YouTube",
  "url": "https://youtube.com/"
}, {
  "label": "TikTok",
  "url": "https://www.tiktok.com/foryou"
}, {
  "label": 'Geforce Now',
  "url": 'https://play.geforcenow.com/mall/'
}, {
  "label": 'Roblox',
  "faviconHost": "https://www.roblox.com/",
  "url": "https://nowgg.fun/apps/a/19900/b.html"
}, {
  "label": "Geometry Dash",
  "url": "https://webdashers.dev/",
  "faviconUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdw5uFI0cIdPEEfg8nXpx-UeHx2SRH5tG-e3OhSB0dfQ&s"
}, {
  "label": 'Kick',
  "url": 'https://kick.com/'
}, {
  "label": "Twitch",
  "url": "https://twitch.tv"
}, {
  "label": "Snapchat",
  "url": "https://www.snapchat.com/web"
}, {
  "label": 'Instagram',
  "url": "https://instagram.com"
}, {
  "label": "Discord",
  "url": "https://discord.com/app"
}, {
  "label": "Movies",
  "url": "https://zstream.mov/",
  "faviconUrl": "https://cdn-icons-png.flaticon.com/512/10351/10351880.png"
}, {
  "label": "Music",
  "url": "https://monochrome.tf/",
  "faviconUrl": "https://cdn-icons-png.flaticon.com/512/461/461146.png"
}];
const ra = [
    {
      name: 'Google',
      url: 'https://www.google.com/search?q='
    },
    {
      name: 'DuckDuckGo',
      url: 'https://duckduckgo.com/?q='
    },
    {
      name: 'Bing',
      url: 'https://www.bing.com/search?q='
    },
    {
      name: 'Brave',
      url: 'https://search.brave.com/search?q='
    },
    {
      name: 'Yahoo',
      url: 'https://search.yahoo.com/search?p='
    },
    {
      name: 'Startpage',
      url: 'https://www.startpage.com/sp/search?q='
    },
    {
      name: 'Ecosia',
      url: 'https://www.ecosia.org/search?q='
    },
    {
      name: 'Ask',
      url: 'https://www.ask.com/web?q='
    }
  ], isMobileDevice = !0, DEFAULT_TRANSPORT = isMobileDevice ? {
    name: 'libcurl',
    src: 'curl/index.mjs'
  } : {
    name: 'epoxy',
    src: 'pox/index.mjs'
  }, THEMES = [
    { name: 'None' },
    {
      name: 'Halloween',
      stars: '255,206,150'
    },
    {
      name: 'Christmas',
      stars: '214,230,255'
    }
  ], SETTINGS = {
    Appearance: {
      
      Stars: {
        type: 'toggle',
        default: !0,
        callback: e => {
          starsEnabled = e;
        }
      },
      'Shooting Stars': {
        type: 'toggle',
        default: !0,
        callback: e => {
          shootingStarsEnabled = e;
        }
      },
      'Prevent Close': {
        type: 'toggle',
        default: !0,
        callback: e => {
          preventCloseEnabled = e;
        }
      },
      'Title Changer': {
        type: 'toggle',
        default: !0,
        callback: (e, t) => {
          if (titleChangerEnabled = e, !t)
            if (e)
              document.hidden && (document.title = 'New Tab');
            else {
              try {
                clearTimeout(focusTimeout);
              } catch {
              }
              focusTimeout = null, document.title = 'atlas';
            }
        }
      }
    },
    Privacy: {
      'About:Blank Cloak': {
        type: 'toggle',
        default: !1,
        callback: (e, t) => {
          t || e && triggerCloak();
        }
      },
      'Clientsided Ad Block': {
        type: 'toggle',
        default: !0,
        callback: e => {
        }
      }
    },
    Prxy: {
      Transport: {
        type: 'dropdown',
        default: DEFAULT_TRANSPORT,
        options: [
          {
            name: 'libcurl',
            src: 'curl/index.mjs'
          },
          {
            name: 'epoxy',
            src: 'pox/index.mjs'
          }
        ],
        callback: async e => {
          try {
            if ((localStorage.TRNSPRT || 'curl/index.mjs') === e.src)
              return void (localStorage.TRNSPRT = e.src);
            localStorage.TRNSPRT = e.src;
            const {default: t} = await import(getAsset(e.src));
            transport = new t({ wisp: window.wlspServer }), await initTransport(transport), controller.setTransport(transport);
          } catch {
          }
        }
      },
      'Search Engine': {
        type: 'dropdown',
        default: {
          name: 'DuckDuckGo',
          url: 'https://duckduckgo.com/?q='
        },
        options: ra,
        callback: e => {
        }
      }
    },
    Advanced: {
      'Force Update/Clear Data': {
        type: 'button',
        label: 'Clear',
        action: clearAtlasData
      }
    }
  }, EXTENSIONS = [
    {
      name: 'Youtube Ad Blocker',
      domain: [
        'youtube.com',
        '*.youtube.com'
      ],
      code: '(function () {\n    \'use strict\';\n    if (window.__opmYtAdBlock) return;\n    window.__opmYtAdBlock = true;\n\n    var hideSelectors = [\'#masthead-ad\', \'ytd-rich-item-renderer.style-scope.ytd-rich-grid-row #content:has(.ytd-display-ad-renderer)\', \'.video-ads.ytp-ad-module\', \'tp-yt-paper-dialog:has(yt-mealbar-promo-renderer)\', \'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"]\', \'#related #player-ads\', \'#related ytd-ad-slot-renderer\', \'ytd-ad-slot-renderer\', \'yt-mealbar-promo-renderer\', \'ytd-popup-container:has(a[href="/premium"])\', \'ad-slot-renderer\', \'ytm-companion-ad-renderer\', \'#related #-ad-\'];\n\n    var style = document.createElement(\'style\');\n    style.textContent = hideSelectors.map(function (s) { return s + \'{display:none!important}\'; }).join(\' \');\n\n    var warningPending = false;\n\n    function removePremiumPopups() {\n        document.querySelectorAll(\'ytd-popup-container\').forEach(function (container) {\n            if (container.querySelector(\'a[href="/premium"]\')) container.remove();\n        });\n        var backdrops = document.querySelectorAll(\'tp-yt-iron-overlay-backdrop\');\n        for (var i = 0; i < backdrops.length; i++) {\n            if (backdrops[i].style.zIndex === \'2201\') {\n                backdrops[i].className = \'\';\n                backdrops[i].removeAttribute(\'opened\');\n                break;\n            }\n        }\n    }\n\n    function dismissAdblockWarning() {\n        if (warningPending) return;\n        var popupExists = document.getElementsByClassName(\'style-scope ytd-popup-container\').length > 0;\n        var dismissButton = document.getElementById(\'dismiss-button\');\n        var divider = document.getElementById(\'divider\');\n        if (!(popupExists && dismissButton && divider)) return;\n        warningPending = true;\n        setTimeout(function () {\n            dismissButton.click();\n            var playButton = document.getElementsByClassName(\'ytp-play-button ytp-button\')[0];\n            if (playButton) playButton.click();\n            setTimeout(function () { warningPending = false; }, 2000);\n        }, Math.random() * 3000);\n    }\n\n    function skipAd(video) {\n        var adIndicator = document.querySelector(\'.ytp-ad-skip-button, .ytp-skip-ad-button, .ytp-ad-skip-button-modern, .video-ads.ytp-ad-module .ytp-ad-player-overlay, .ytp-ad-button-icon\');\n        if (adIndicator && !window.location.href.includes(\'https://m.youtube.com/\') && isFinite(video.duration)) {\n            video.muted = true;\n            video.currentTime = video.duration - 0.1;\n        }\n    }\n\n    setInterval(function () {\n        if (document.readyState === \'loading\') return;\n        try {\n            if (!style.isConnected) (document.head || document.documentElement).appendChild(style);\n            removePremiumPopups();\n            dismissAdblockWarning();\n\n            var mainVideo = document.querySelector(\'video\');\n            if (mainVideo && mainVideo.currentTime <= 5 && mainVideo.paused) {\n                mainVideo.play().catch(function () {});\n            }\n            var adsVideo = document.querySelector(\'.ad-showing video\');\n            if (adsVideo) skipAd(adsVideo);\n        } catch (e) {}\n    }, 500);\n})();'
    },
    {
      name: 'GeForce NOW Ad Blocker',
      domain: [
        'geforcenow.com',
        '*.geforcenow.com'
      ],
      code: '(function() {\n Object.defineProperty(document, \'hidden\', { get: () => false });\n \n    function checkForVideo() {\n        const video = document.getElementById(\'preStreamVideo\');\n        if (video) {\n            video.style.width = \'0.1px\';\n            video.style.height = \'0.1px\';\n            video.muted = true;\n            const observer = new MutationObserver(() => {\n                if (!document.contains(video)) {\n                    observer.disconnect();\n                }\n            });\n            observer.observe(document.body, { childList: true, subtree: true });\n        }\n    }\n \n    const interval = setInterval(() => {\n        if (document.getElementById(\'preStreamVideo\')) {\n            clearInterval(interval);\n            checkForVideo();\n        }\n    }, 1000);\n})();'
    },
    {
      name: 'nowgg.fun fat fat',
      domain: '*.ip.nowgg.fun',
      code: 'window.alert=()=>{}',
      prompt: !1
    }
  ], _extApproved = new Set(), _extDismissed = new Set();
function _domainMatches(e, t) {
  if ('*' === e)
    return !0;
  if (e.startsWith('*.')) {
    const n = e.slice(1);
    return t === n.slice(1) || t.endsWith(n);
  }
  return t === e;
}
function _extMatchesDomain(e, t) {
  return (Array.isArray(e.domain) ? e.domain : [e.domain]).some(e => _domainMatches(e, t));
}
function _runExtension(e) {
  try {
    frame.element.contentWindow.eval(e?.code?.toString());
  } catch {
  }
}
function _showExtPrompt(e, t) {
  const n = '_ep' + t;
  if (document.getElementById(n))
    return;
  const a = document.createElement('div');
  a.id = n, a.className = 'ext-prompt';
  const o = document.createElement('div');
  o.className = 'ext-prompt-eyebrow', o.textContent = 'Extension available';
  const s = document.createElement('div');
  s.className = 'ext-prompt-name', s.textContent = e.name;
  const r = document.createElement('div');
  r.className = 'ext-prompt-question', r.textContent = 'Run it on this site?';
  const i = document.createElement('div');
  i.className = 'ext-prompt-btns';
  const c = document.createElement('button');
  c.className = 'ext-prompt-btn yes', c.textContent = 'Yes';
  const l = document.createElement('button');
  l.className = 'ext-prompt-btn no', l.textContent = 'No';
  const d = () => {
    a.classList.remove('open'), a.addEventListener('transitionend', () => a.remove(), { once: !0 }), setTimeout(() => a.remove(), 350);
  };
  c.onclick = () => {
    d(), _extApproved.add(t), _runExtension(e);
  }, l.onclick = () => {
    d(), _extDismissed.add(t);
  }, i.appendChild(c), i.appendChild(l), a.appendChild(o), a.appendChild(s), a.appendChild(r), a.appendChild(i), (shadowRoot || document.body).appendChild(a), requestAnimationFrame(() => a.classList.add('open'));
}
function _checkExtensions(e) {
  let t;
  try {
    t = new URL(e).hostname;
  } catch (e) {
    return;
  }
  t && EXTENSIONS.forEach((e, n) => {
    !1 !== e.enabled && _extMatchesDomain(e, t) && (_extApproved.has(n) || !1 === e.prompt ? _runExtension(e) : _extDismissed.has(n) || _showExtPrompt(e, n));
  });
}
let frame = null, starsEnabled = !0, shootingStarsEnabled = !0, preventCloseEnabled = !0, titleChangerEnabled = !0, STAR_RGB = '255,255,255';
var allowUnload = !1;
window.addEventListener('keydown', e => {
});
try {
  window.top.addEventListener('beforeunload', e => {
    !allowUnload && preventCloseEnabled && (e.preventDefault(), e.returnValue = '');
  });
} catch {
}
const saved = ((() => {
  try {
    return JSON.parse(localStorage.getItem('SETTINGS') || '{}');
  } catch (e) {
    return {};
  }
})());
function saveSettings() {
  const e = {};
  Object.entries(SETTINGS).forEach(([t, n]) => {
    e[t] = {}, Object.entries(n).forEach(([n, a]) => {
      a.auto && !a._set || (e[t][n] = void 0 !== a._value ? a._value : a.default);
    });
  }), localStorage.setItem('SETTINGS', JSON.stringify(e));
}
function cloakAboutBlank() {
  if (window.self !== window.top)
    return !0;
  const e = window.open('about:blank', '_blank');
  return !!e && (allowUnload = !0, e.document.open(), e.document.write(cloakWrapperHtml(window.location.href)), e.document.close(), location.replace('https://clever.com/'), setTimeout(() => {
    allowUnload = !1;
  }, 1000), !0);
}
Object.entries(SETTINGS).forEach(([e, t]) => {
  Object.entries(t).forEach(([t, n]) => {
    n._set = void 0 !== saved[e]?.[t], n._value = n._set ? saved[e][t] : n.default, n.callback && n.callback(n._value, !0);
  });
});
let cloakPending = !1;
function triggerCloak() {
  if (cloakAboutBlank())
    return;
  if (cloakPending)
    return;
  cloakPending = !0;
  const e = () => {
    cloakAboutBlank() && (document.removeEventListener('click', e, !0), document.removeEventListener('keydown', e, !0), document.removeEventListener('pointerdown', e, !0), cloakPending = !1);
  };
  document.addEventListener('click', e, !0), document.addEventListener('keydown', e, !0), document.addEventListener('pointerdown', e, !0);
}
function cloakWrapperHtml(e) {
  const t = !!SETTINGS.Appearance['Title Changer']._value;
  return `<!DOCTYPE html>\n<html>\n<head>\n<meta charset="UTF-8" />\n<meta name="viewport" content="width=device-width, initial-scale=1.0" />\n<title>New Tab</title>\n<style>html,body{margin:0;padding:0;height:100vh;overflow:hidden}iframe{border:0}</style>\n</head>\n<body>\n<iframe id="cloakFrame" width="100%" height="100%" src="${ window.location.href }"></iframe>\n<script>\n(function () {\n    var originalUrl = ${ JSON.stringify(e) };\n    var titleChangerOnNow = ${ t };\n    function applyTitle() {\n        document.title = (!titleChangerOnNow || document.hidden) ? 'New Tab' : 'Atlas';\n    }\n    document.addEventListener('visibilitychange', applyTitle);\n    applyTitle();\n    window.addEventListener('storage', function (e) {\n        if (e.key !== 'SETTINGS') return;\n        var s; try { s = JSON.parse(localStorage.getItem('SETTINGS') || '{}'); } catch (err) { s = {}; }\n        titleChangerOnNow = !!(s.Appearance && s.Appearance['Title Changer']);\n        applyTitle();\n        if (!(s.Privacy && s.Privacy['About:Blank Cloak'])) {\n            try { document.getElementById('cloakFrame').contentWindow.allowUnload = true; } catch (e) {}\n            window.location.href = originalUrl;\n        }\n    });\n})();\n<\/script>\n</body>\n</html>`;
}
window.self === window.top && SETTINGS.Privacy['About:Blank Cloak']._value && triggerCloak();
document.getElementById('tagline')?.remove();
let _oDBPromise = null, _oMigratePromise = null;
const grid = document.getElementById('shortcuts');
let _bookmarks = [];
function _makeShortcutAccessible(element, label) {
  element.setAttribute('role', 'button');
  element.setAttribute('tabindex', '0');
  element.setAttribute('aria-label', label);
  element.addEventListener('keydown', event => {
    if (event.target === element && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault(); element.click();
    }
  });
}
function _renderShortcuts() {
  grid.innerHTML = '', SHORTCUTS.forEach(({
    label: e,
    url: t,
    faviconHost: n,
    faviconUrl: a,
    onclick: o
  }) => {
    const s = document.createElement('div');
    s.className = 'shortcut';
    _makeShortcutAccessible(s, e);
    const r = document.createElement('img');
    r.className = 'shortcut-icon', r.alt = '', r.loading = 'lazy', r.decoding = 'async', r.src = sjEncode(a || 'https://www.google.com/s2/favicons?domain=' + new URL(n || t).hostname + '&sz=128'), r.onerror = () => {
      r.removeAttribute('src');
    };
    const i = document.createElement('span');
    i.className = 'shortcut-title';
    i.textContent = e;
    const number = document.createElement('span'), domain = document.createElement('span');
    number.className = 'shortcut-number'; number.textContent = String(grid.children.length + 1).padStart(2, '0');
    domain.className = 'shortcut-domain'; domain.textContent = t ? new URL(t).hostname.replace(/^www\./, '') : 'Atlas';
    s.append(number, i, domain); s.onclick = o ? () => o() : () => navigate(t); grid.appendChild(s);
  }), _bookmarks.forEach(e => {
    const t = document.createElement('div');
    t.className = 'shortcut';
    _makeShortcutAccessible(t, e.label);
    const n = document.createElement('img');
    n.className = 'shortcut-icon', n.alt = '', n.loading = 'lazy', n.decoding = 'async', n.src = e.faviconUrl, n.onerror = () => {
      n.removeAttribute('src');
    };
    const a = document.createElement('span');
    a.className = 'shortcut-title'; a.textContent = e.label;
    const number = document.createElement('span');
    number.className = 'shortcut-number'; number.textContent = String(grid.children.length + 1).padStart(2, '0');
    const o = document.createElement('button');
    o.className = 'shortcut-delete', o.type = 'button', o.title = 'Remove bookmark', o.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>', o.onclick = async t => {
      t.stopPropagation(), await _bookmarksReady, _bookmarks = _bookmarks.filter(t => t.id !== e.id), _renderShortcuts(), _updateBookmarkIcon(document.getElementById('addrInput').value.trim()), _deleteBookmark(e.id);
    }, t.appendChild(number), t.appendChild(a), t.appendChild(o), t.onclick = () => navigate(e.url), grid.appendChild(t);
  });
  const count = SHORTCUTS.length + _bookmarks.length;
  grid.style.gridTemplateRows = `repeat(${Math.ceil(count / 2)}, minmax(38px, 1fr))`;
  const countLabel = document.getElementById('atlasDestinationCount');
  if (countLabel) countLabel.textContent = `All ${count}`;
}
_renderShortcuts();
const _bookmarksReady = _loadAllBookmarks().then(e => {
    _bookmarks = e, _renderShortcuts(), _updateBookmarkIcon(document.getElementById('addrInput').value.trim());
  }), sidebar = document.getElementById('settingsSidebar'), tabsEl = document.getElementById('settingsTabs'), panelsEl = document.getElementById('settingsPanels'), categories = Object.keys(SETTINGS), sectionEls = [];
function setActive(e) {
  sidebar.querySelectorAll('.sidebar-item').forEach(t => t.classList.toggle('active', t.dataset.cat === e)), tabsEl.querySelectorAll('.tab-item').forEach(t => t.classList.toggle('active', t.dataset.cat === e));
  sectionEls.forEach(section => section.classList.toggle('active', section.dataset.section === e));
}
function scrollToCategory(e) {
  setActive(e);
  panelsEl.scrollTop = 0;
}
categories.forEach((e, t) => {
  const n = document.createElement('div');
  n.className = 'sidebar-item' + (0 === t ? ' active' : ''), n.textContent = e, n.dataset.cat = e, n.onclick = () => scrollToCategory(e), sidebar.appendChild(n);
  const a = document.createElement('button');
  a.className = 'tab-item' + (0 === t ? ' active' : ''), a.textContent = e, a.dataset.cat = e, a.onclick = () => scrollToCategory(e), tabsEl.appendChild(a);
  const o = document.createElement('div');
  o.className = 'settings-panel-section', o.dataset.section = e, sectionEls.push(o);
  const s = document.createElement('div');
  s.className = 'category-label', s.textContent = e, o.appendChild(s);
  const r = document.createElement('div');
  r.className = 'category-rows', Object.entries(SETTINGS[e]).forEach(([e, t]) => {
    const n = document.createElement('div');
    n.className = 'setting-row';
    const a = document.createElement('span');
    if (a.className = 'setting-label', a.textContent = e, n.appendChild(a), 'toggle' === t.type) {
      const e = document.createElement('button');
      e.className = 'toggle' + (t._value ? ' on' : ''), e.onclick = () => {
        e.classList.toggle('on'), t._value = e.classList.contains('on'), t.callback(t._value), saveSettings();
      }, n.appendChild(e);
    } else if ('input' === t.type) {
      const a = document.createElement('input');
      a.className = 'setting-input', a.placeholder = e, a.value = t._value || '', a.onchange = () => {
        t._value = a.value, t.callback(a.value), saveSettings();
      }, n.appendChild(a);
    } else if ('button' === t.type) {
      const e = document.createElement('button');
      e.className = 'setting-action-btn', e.textContent = t.label, e.onclick = () => t.action(), n.appendChild(e);
    } else if ('dropdown' === t.type) {
      const e = document.createElement('select');
      e.className = 'setting-select', t.options.forEach(n => {
        const a = document.createElement('option');
        a.textContent = n.name, a.value = JSON.stringify(n), n.name === t._value?.name && (a.selected = !0), e.appendChild(a);
      }), e.onchange = () => {
        t._value = JSON.parse(e.value), t._set = !0, t.callback(t._value), saveSettings();
      }, n.appendChild(e);
    }
    r.appendChild(n);
  }), o.appendChild(r), panelsEl.appendChild(o);
});
const spacer = document.createElement('div');
setActive(categories[0]);
function setVh() {
  document.documentElement.style.setProperty('--vh', 0.01 * window.innerHeight + 'px');
}
spacer.className = 'settings-spacer', panelsEl.appendChild(spacer), setVh(), window.addEventListener('resize', setVh);
let canvas = document.getElementById('stars'), ctx = canvas.getContext('2d'), W, H;
function resize() {
  W = canvas.width = window.innerWidth, H = canvas.height = window.innerHeight;
}
resize(), window.addEventListener('resize', resize);
const starObjs = Array.from({ length: 180 }, () => {
  const e = 0.28 * Math.random() + 0.05;
  return {
    x: Math.random(),
    y: Math.random(),
    r: 0.85 * Math.random() + 0.2,
    base: e,
    alpha: e,
    blinking: Math.random() < 0.3,
    blinkPeak: 0,
    blinkDir: 1,
    blinkSpeed: 0.012 + 0.022 * Math.random(),
    pauseMs: 6000 * Math.random()
  };
});
let shoots = [];
const homeStateEls = [
  'panel',
  'gamesScreen',
  'gamePlayer',
  'effectsScreen'
].map(e => document.getElementById(e));
let _starsResumeAt = 0;
function starsShouldRun() {
  return !document.hidden && document.hasFocus() && isOpiumMenu(!0) && performance.now() >= _starsResumeAt;
}
const OPIUM_EXTERNAL_SCREENS = [
    'panel',
    'gamePlayer'
  ], OPIUM_HOME_ONLY_SCREENS = [
    'gamesScreen',
    'effectsScreen',
    'aiScreen'
  ];
function isOpiumMenu(e = !1) {
  return !(e ? [
    ...OPIUM_EXTERNAL_SCREENS,
    ...OPIUM_HOME_ONLY_SCREENS
  ] : OPIUM_EXTERNAL_SCREENS).some(e => document.getElementById(e)?.classList.contains('open'));
}
globalThis.isOpiumMenu = isOpiumMenu;
const navActiveMap = [
  [
    'gamesScreen',
    'navGames'
  ],
  [
    'effectsScreen',
    'navEffects'
  ],
  [
    'settingsScreen',
    'navSettings'
  ],
  [
    'aiScreen',
    'navAI'
  ]
];
function updateNavActive() {
  navActiveMap.forEach(([e, t]) => {
    const n = document.getElementById(e), a = document.getElementById(t);
    n && a && a.classList.toggle('active', n.classList.contains('open'));
  });

  window.updateAtlasChromeState?.();
}
updateNavActive();
let starsRafPending = !1, last = 0, starsGen = 0, starsActive = null;
function stopStars() {
  starsGen++, starsRafPending = !1, last = 0, shoots = [], W && H && ctx.clearRect(0, 0, W, H);
}
function startStars() {
  if (starsRafPending)
    return;
  starsRafPending = !0;
  const e = starsGen;
  requestAnimationFrame(t => doFrame(t, e));
}
function updateStarsActive() {
  const e = starsShouldRun();
  e !== starsActive && (starsActive = e, e ? (startStars(), shootTimer || scheduleShoot()) : stopStars());
}
function spawnShoot() {
  const e = Math.random() * W * 1.4 - 0.2 * W, t = Math.random() * H * 0.5, n = Math.PI / 180 * (12 + 22 * Math.random()), a = 7 + 8 * Math.random();
  shoots.push({
    x: e,
    y: t,
    vx: Math.cos(n) * a,
    vy: Math.sin(n) * a,
    len: 70 + 100 * Math.random(),
    life: 1,
    decay: 0.016 + 0.014 * Math.random()
  });
}
let nextShootAt = 0, shootTimer = null;
function scheduleShoot() {
  if (shootTimer = null, !starsShouldRun())
    return;
  const e = Date.now();
  shootingStarsEnabled && e >= nextShootAt && (spawnShoot(), nextShootAt = e + 500 + 800 * Math.random()), shootTimer = setTimeout(scheduleShoot, 500 + 800 * Math.random());
}
document.addEventListener('visibilitychange', updateStarsActive), window.addEventListener('blur', updateStarsActive), window.addEventListener('focus', updateStarsActive);
const screenClassObserver = new MutationObserver(() => {
    updateNavActive(), updateStarsActive();
  }), settingsScreenEl = document.getElementById('settingsScreen');
[
  ...homeStateEls,
  settingsScreenEl,
  document.getElementById('aiScreen')
].forEach(e => {
  e && screenClassObserver.observe(e, {
    attributes: !0,
    attributeFilter: ['class']
  });
}), setInterval(updateStarsActive, 1000);
const STARS_MAX_DT = 50;
function doFrame(e, t) {
  if (t !== starsGen)
    return;
  if (!starsRafPending || !starsShouldRun())
    return void stopStars();
  if (!last)
    return last = e, void requestAnimationFrame(e => doFrame(e, t));
  const n = e - last;
  if (n < 33)
    return void requestAnimationFrame(e => doFrame(e, t));
  last = e;
  const a = Math.min(n, STARS_MAX_DT);
  ctx.clearRect(0, 0, W, H), starsEnabled && starObjs.forEach(e => {
    e.blinking ? (e.blinkPeak += e.blinkDir * e.blinkSpeed, e.blinkPeak >= 1 && (e.blinkPeak = 1, e.blinkDir = -1), e.blinkPeak <= 0 ? (e.blinkPeak = 0, e.blinkDir = 1, e.blinking = !1, e.alpha = e.base, e.pauseMs = 1500 + 5000 * Math.random()) : e.alpha = e.base + (0.92 - e.base) * Math.sin(e.blinkPeak * Math.PI)) : (e.pauseMs -= a, e.pauseMs <= 0 && (e.blinking = !0)), ctx.beginPath(), ctx.arc(e.x * W, e.y * H, e.r, 0, 2 * Math.PI), ctx.fillStyle = `rgba(${ STAR_RGB },${ e.alpha.toFixed(3) })`, ctx.fill();
  }), shootingStarsEnabled && (shoots = shoots.filter(e => e.life > 0), shoots.forEach(e => {
    const t = e.x - e.vx * (e.len / 10), n = e.y - e.vy * (e.len / 10), a = ctx.createLinearGradient(t, n, e.x, e.y);
    a.addColorStop(0, `rgba(${ STAR_RGB },0)`), a.addColorStop(1, `rgba(${ STAR_RGB },${ (0.85 * e.life).toFixed(3) })`), ctx.beginPath(), ctx.moveTo(t, n), ctx.lineTo(e.x, e.y), ctx.strokeStyle = a, ctx.lineWidth = 1.1, ctx.stroke(), e.x += e.vx, e.y += e.vy, e.life -= e.decay;
  })), requestAnimationFrame(e => doFrame(e, t));
}
function getSearchEngine() {
  return SETTINGS.Prxy?.['Search Engine']?._value?.url || 'https://duckduckgo.com/?q=';
}
function resolveUrl(e) {
  return e ? e.startsWith('http://') || e.startsWith('https://') ? e : e.includes('.') && !e.includes(' ') ? 'https://' + e : getSearchEngine() + encodeURIComponent(e) : null;
}
function updateLockIcon(e) {
  const t = document.getElementById('lockIcon');
  t && t.classList.toggle('secure', 'string' == typeof e && e.startsWith('https://'));
}
function _showAdsNotice() {}
function _showBlockerPicker(e) {
  if (document.getElementById('_blockerPicker'))
    return;
  const t = document.createElement('div');
  t.id = '_blockerPicker', t.className = 'notice-overlay';
  const n = document.createElement('div');
  n.className = 'notice-modal', n.setAttribute('role', 'dialog'), n.setAttribute('aria-labelledby', '_blockerPickerTitle');
  const a = document.createElement('div');
  a.className = 'notice-title', a.id = '_blockerPickerTitle', a.textContent = 'Select your blocker', n.appendChild(a);
  const o = () => {
      document.removeEventListener('keydown', s, !0), t.classList.remove('open'), t.addEventListener('transitionend', () => t.remove(), { once: !0 }), setTimeout(() => t.remove(), 350);
    }, s = e => {
      'Escape' === e.key && o();
    }, r = document.createElement('div');
  r.style.cssText = 'display:flex;flex-direction:column;gap:10px;margin-top:14px;width:100%';
  for (const [t, n] of Object.entries(e)) {
    const e = document.createElement('button');
    e.type = 'button', e.textContent = t;
    const a = 'rgba(127,127,127,.15)', s = 'rgba(127,127,127,.3)';
    e.style.cssText = 'box-sizing:border-box;width:100%;padding:10px 14px;border-radius:10px;border:1px solid rgba(127,127,127,.35);color:inherit;font:inherit;font-weight:600;text-align:center;cursor:pointer;transition:background .15s;background:' + a, e.onmouseenter = () => {
      e.style.background = s;
    }, e.onmouseleave = () => {
      e.style.background = a;
    }, e.onclick = () => {
      o(), window.open(n, '_blank');
    }, r.appendChild(e);
  }
  n.appendChild(r);
  const i = document.createElement('div');
  i.style.display = 'flex', i.style.justifyContent = 'flex-end', i.style.marginTop = '12px';
  const c = document.createElement('button');
  c.type = 'button', c.textContent = 'Close', c.style.cssText = 'background:none;border:0;padding:2px 4px;font:inherit;font-size:12px;color:inherit;opacity:.6;cursor:pointer', c.onclick = o, i.appendChild(c), n.appendChild(i), t.appendChild(n), t.addEventListener('click', e => {
    e.target === t && o();
  }), document.addEventListener('keydown', s, !0), (shadowRoot || document.body).appendChild(t), requestAnimationFrame(() => t.classList.add('open'));
}
// The retained Atlas chrome is a tab bar: only the selected feature may cover
// the viewport. Keep loaded browser/game data, but close peer feature panels.
function _activateAtlasScreen(id) {
  if (id !== 'gamesScreen' && document.getElementById('gamesScreen')?.classList.contains('open')) closeGames();
  if (id !== 'effectsScreen' && document.getElementById('effectsScreen')?.classList.contains('open')) closeEffects();
  if (id !== 'aiScreen' && document.getElementById('aiScreen')?.classList.contains('open')) closeAI();
  for (const peer of ['panel', 'settingsScreen']) {
    if (peer !== id) document.getElementById(peer)?.classList.remove('open');
  }
  document.getElementById('bottomNav')?.classList.toggle('hidden', id === 'panel');
}
function navigate(e) {
  const t = resolveUrl(e || document.getElementById('searchInput').value.trim());
  t && (_activateAtlasScreen('panel'), document.getElementById('panel').classList.add('open'), document.getElementById('addrInput').value = t, updateLockIcon(t), _updateBookmarkIcon(t), startFrameLoading(), frame.go(t), collapseSearch());
}
updateStarsActive(), 'complete' === document.readyState ? _showAdsNotice() : window.addEventListener('load', _showAdsNotice, { once: !0 });
const searchWrap = document.getElementById('searchWrap'), searchInput = document.getElementById('searchInput'), acBox = document.getElementById('autocomplete');
let acSelected = -1, acItems = [], acTimer = null;
function expandSearch() {
  searchWrap.classList.add('expanded');
}
function collapseSearch() {
  clearTimeout(acTimer), cancelAutocompletes(), searchWrap.classList.remove('expanded'), searchWrap.classList.remove('has-ac'), acBox.classList.remove('has-items'), acBox.innerHTML = '', acItems = [], acSelected = -1;
}
searchInput.addEventListener('focus', expandSearch), (shadowRoot || document).addEventListener('click', e => {
  searchWrap.contains(e.target) || collapseSearch();
});
let acSeq = 0, acAbort = null;
function cancelAutocompletes() {
  acSeq++, acAbort && acAbort.abort(), acAbort = null;
}
async function fetchAutocompletes(e) {
  if (cancelAutocompletes(), !e)
    return acBox.innerHTML = '', acBox.classList.remove('has-items'), void searchWrap.classList.remove('has-ac');
  const t = acSeq, n = new AbortController();
  acAbort = n;
  try {
    let a;
    try {
      const t = await fetch(sjEncode(`https://suggestqueries.google.com/complete/search?output=toolbar&hl=en&q=${ encodeURIComponent(e) }`), { signal: n.signal });
      if (a = [...new DOMParser().parseFromString(await t.text(), 'application/xml').querySelectorAll('suggestion')].slice(0, 8).map(e => e.getAttribute('data')), !a.length)
        throw new Error('empty');
    } catch (t) {
      if (n.signal.aborted)
        throw t;
      const o = await fetch(sjEncode(`https://duckduckgo.com/ac/?kl=wt-wt&q=${ encodeURIComponent(e) }`), { signal: n.signal });
      a = (await o.json()).slice(0, 8).map(e => e.phrase);
    }
    if (t !== acSeq)
      return;
    renderSuggestions(a);
  } catch (e) {
    if (t !== acSeq)
      return;
    acBox.innerHTML = '', acBox.classList.remove('has-items'), searchWrap.classList.remove('has-ac');
  }
}
function renderSuggestions(e) {
  if (acBox.innerHTML = '', acItems = e, acSelected = -1, !e.length)
    return acBox.classList.remove('has-items'), void searchWrap.classList.remove('has-ac');
  e.forEach(e => {
    const t = document.createElement('div');
    t.className = 'ac-item';
    const n = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    n.setAttribute('viewBox', '0 0 24 24');
    const a = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    a.setAttribute('cx', '11'), a.setAttribute('cy', '11'), a.setAttribute('r', '8');
    const o = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    o.setAttribute('d', 'm21 21-4.35-4.35'), n.appendChild(a), n.appendChild(o), t.appendChild(n), t.appendChild(document.createTextNode(e)), t.onmousedown = t => {
      t.preventDefault(), searchInput.value = e, navigate(e);
    }, acBox.appendChild(t);
  }), acBox.classList.add('has-items'), searchWrap.classList.add('has-ac');
}
searchInput.addEventListener('input', () => {
  clearTimeout(acTimer), acSelected = -1, acTimer = setTimeout(() => fetchAutocompletes(searchInput.value.trim()), 180);
}), searchInput.addEventListener('keydown', e => {
  const t = acBox.querySelectorAll('.ac-item');
  'ArrowDown' === e.key ? (e.preventDefault(), acSelected = Math.min(acSelected + 1, t.length - 1), t.forEach((e, t) => e.classList.toggle('selected', t === acSelected)), acSelected >= 0 && (searchInput.value = acItems[acSelected])) : 'ArrowUp' === e.key ? (e.preventDefault(), acSelected = Math.max(acSelected - 1, -1), t.forEach((e, t) => e.classList.toggle('selected', t === acSelected)), acSelected >= 0 && (searchInput.value = acItems[acSelected])) : 'Escape' === e.key ? collapseSearch() : 'Enter' === e.key && navigate();
});
let homeClickCount = 0, homeResetTimer = null, gameCloseClickCount = 0, gameCloseResetTimer = null;
function resetGameCloseConfirm() {
  gameCloseClickCount = 0, clearTimeout(gameCloseResetTimer);
  const e = document.getElementById('gamePlayerClose'), t = document.getElementById('gamePlayerCloseWrap'), n = document.getElementById('gameCloseCountdown');
  e && e.classList.remove('confirm'), t && t.classList.remove('confirming'), n && (n.classList.add('no-anim'), n.offsetHeight, n.classList.remove('no-anim'));
}
function _armOrConfirmClose(e) {
  if (gameCloseClickCount++, 1 === gameCloseClickCount) {
    const e = document.getElementById('gamePlayerClose'), t = document.getElementById('gamePlayerCloseWrap');
    e && e.classList.add('confirm'), t && t.classList.add('confirming'), gameCloseResetTimer = setTimeout(resetGameCloseConfirm, 5000);
  } else
    resetGameCloseConfirm(), e();
}
function handleGamePlayerClose() {
  _armOrConfirmClose(closeGamePlayer);
}
function resetHomeConfirm() {
  homeClickCount = 0, clearTimeout(homeResetTimer);
  const e = document.getElementById('homeBtn'), t = document.getElementById('homeBtnWrap'), n = document.getElementById('homeCountdown');
  e.classList.remove('confirm'), t.classList.remove('confirming'), n.classList.add('no-anim'), n.offsetHeight, n.classList.remove('no-anim');
}
function handleHome() {
  if (homeClickCount++, 1 === homeClickCount) {
    const e = document.getElementById('homeBtn'), t = document.getElementById('homeBtnWrap');
    e.classList.add('confirm'), t.classList.add('confirming'), homeResetTimer = setTimeout(resetHomeConfirm, 5000);
  } else
    resetHomeConfirm(), closePanel();
}
function closePanel() {
  document.getElementById('panel').classList.remove('open'), document.getElementById('bottomNav').classList.remove('hidden'), document.getElementById('addrInput').value = '', updateLockIcon(null), _updateBookmarkIcon(null);
  try {
    frame.element.src = 'about:blank';
  } catch {
  }
  stopFrameLoading(), document.fullscreenElement && document.exitFullscreen();
}
let frameLoading = !1, frameLoadingCleanup = null;
function _runFrameLoadingCleanup() {
  if (!frameLoadingCleanup)
    return;
  const e = frameLoadingCleanup;
  frameLoadingCleanup = null, e();
}
function startFrameLoading() {
  _runFrameLoadingCleanup(), frameLoading = !0, document.getElementById('reloadBtn').classList.add('loading');
}
function stopFrameLoading() {
  frameLoading = !1, _runFrameLoadingCleanup(), document.getElementById('reloadBtn').classList.remove('loading');
}
function stepFrameHistory(e) {
  if (frame)
    try {
      const t = frame.element.contentWindow, n = t && t.navigation;
      if (n && (e < 0 ? !1 === n.canGoBack : !1 === n.canGoForward))
        return;
      startFrameLoading();
      const a = () => stopFrameLoading();
      t && (t.addEventListener('popstate', a, { once: !0 }), t.addEventListener('hashchange', a, { once: !0 }));
      const o = setTimeout(stopFrameLoading, 10000);
      frameLoadingCleanup = () => {
        clearTimeout(o), t && (t.removeEventListener('popstate', a), t.removeEventListener('hashchange', a));
      }, e < 0 ? frame.back() : frame.forward();
    } catch (e) {
      stopFrameLoading();
    }
}
function goBack() {
  stepFrameHistory(-1);
}
function goForward() {
  stepFrameHistory(1);
}
function reload() {
  if (frameLoading) {
    try {
      frame.element.contentWindow.stop();
    } catch (e) {
    }
    stopFrameLoading();
  } else
    try {
      startFrameLoading(), frame.reload();
    } catch (e) {
      stopFrameLoading();
    }
}
document.getElementById('addrInput').addEventListener('keydown', e => {
  'Enter' === e.key && navigate(e.target.value.trim());
});
const _GENIE = {
  openMs: 460,
  closeMs: 320,
  open: [
    [
      0,
      0,
      0
    ],
    [
      0.3,
      0.14,
      0.5
    ],
    [
      0.55,
      0.55,
      1.5
    ],
    [
      0.8,
      0.93,
      0.9
    ],
    [
      1,
      1,
      0
    ]
  ],
  steps: 18,
  rows: 9,
  capPts: 8,
  tilt: -34,
  persp: 900,
  probeFrames: 8,
  slowMs: 30
};
function _curve(e) {
  return t => {
    if (t <= 0)
      return e[0][1];
    if (t >= 1)
      return e[e.length - 1][1];
    let n = 0;
    for (; n < e.length - 2 && t > e[n + 1][0];)
      n++;
    const [a, o, s] = e[n], [r, i, c] = e[n + 1], l = r - a, d = (t - a) / l, u = d * d, m = u * d;
    return (2 * m - 3 * u + 1) * o + (m - 2 * u + d) * l * s + (-2 * m + 3 * u) * i + (m - u) * l * c;
  };
}
const _genieOpenCurve = _curve(_GENIE.open), _genieEase = {
    open: _genieOpenCurve,
    close: e => 1 - _genieOpenCurve(1 - e)
  }, _genieState = new WeakMap(), _glerp = (e, t, n) => e + (t - e) * n, _gss = (e, t, n) => {
    const a = Math.min(1, Math.max(0, (n - e) / (t - e)));
    return a * a * (3 - 2 * a);
  }, _genieLs = (e, t) => {
    try {
      if (void 0 === t)
        return localStorage.getItem(e);
      localStorage.setItem(e, t);
    } catch (e) {
    }
    return null;
  };
function _genieIsLite() {
  const e = _genieLs('GENIE');
  return 'lite' === e || 'full' !== e && ('1' === _genieLs('GENIE_LITE') || (navigator.hardwareConcurrency || 4) <= 2);
}
const _genieOpacity = (e, t) => (t ? _gss(0, 0.05, e) : _gss(0.02, 0.12, e)).toFixed(3);
function _genieFrameFull(e, t, n) {
  const {
      W: a,
      H: o,
      ox: s,
      oy: r,
      w0: i,
      h0: c
    } = t, l = Math.pow(_gss(0, 1, e), 1.35), d = _gss(0.15, 1, e), u = _gss(0.5, 1, e), m = _gss(0.45, 1, e), h = 1 - _gss(0.05, 0.55, e), p = _glerp(s - i, 0, d), g = _glerp(s + i, a, d), _ = _glerp(r - c, 0, l), f = _glerp(r + 6, o, m), y = Math.max(1, g - p), v = Math.max(1, f - _), E = (p + g) / 2, S = y / 2, w = _glerp(0.9 * i, a / 2, u), C = _glerp(s, a / 2, u), b = h * Math.min(S, 0.45 * v), k = _ + b, I = (e, t) => ((e - p) / y * 100).toFixed(1) + '% ' + ((t - _) / v * 100).toFixed(1) + '%', M = [];
  for (let e = 0; e <= _GENIE.capPts; e++) {
    const t = e / _GENIE.capPts, n = 2 * t - 1;
    M.push(I(p + t * y, _ + b * (1 - Math.sqrt(Math.max(0, 1 - n * n)))));
  }
  const L = _GENIE.rows, A = (e, t) => {
      const n = e / L, a = n * n * (3 - 2 * n), o = _glerp(S, w, a), s = _glerp(E, C, a);
      return I(s + t * o, k + n * (f - k));
    };
  for (let e = 0; e <= L; e++)
    M.push(A(e, 1));
  for (let e = L; e >= 0; e--)
    M.push(A(e, -1));
  return {
    transform: 'translate(' + p.toFixed(1) + 'px, ' + _.toFixed(1) + 'px) scale(' + (y / a).toFixed(4) + ', ' + (v / o).toFixed(4) + ')',
    clipPath: 'polygon(' + M.join(', ') + ')',
    opacity: _genieOpacity(e, n)
  };
}
function _genieFrameLite(e, t, n) {
  const {
      W: a,
      H: o,
      w0: s,
      h0: r
    } = t, i = Math.pow(_gss(0, 1, e), 1.35), c = _gss(0.15, 1, e), l = Math.min(1, 2 * s / a), d = Math.min(1, (r + 6) / o), u = _GENIE.tilt * Math.sin(Math.PI * e);
  return {
    transform: 'perspective(' + _GENIE.persp + 'px) rotateX(' + u.toFixed(2) + 'deg) scale(' + (l + (1 - l) * c).toFixed(4) + ', ' + (d + (1 - d) * i).toFixed(4) + ')',
    opacity: _genieOpacity(e, n)
  };
}
const _genieTint = e => (0.85 * (1 - _gss(0.05, 0.9, e))).toFixed(3);
function _genieProbe(e, t, n, a) {
  let o = 0, s = 0, r = 0;
  const i = c => {
    if (_genieState.get(e) === a)
      if (o++, 3 === o && (s = c), o >= 3 + _GENIE.probeFrames) {
        r = c;
        (r - s) / _GENIE.probeFrames > _GENIE.slowMs && (_genieLs('GENIE_LITE', '1'), _genie(e, t, n));
      } else
        requestAnimationFrame(i);
  };
  requestAnimationFrame(i);
}
function _genie(e, t, n) { /* Retain Atlas's existing transitions instead of importing upstream animation effects. */ }
function toggleSettings() {
  const e = document.getElementById('settingsScreen'), t = !e.classList.contains('open');
  if (t) _activateAtlasScreen('settingsScreen');
  e.classList.toggle('open', t), _genie(e.querySelector('.settings-inner'), 'navSettings', t);
}
const fsEnter = '<path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/>', fsExit = '<path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3"/>', bmOutline = '<path d="M7.84 4.1a.178.178 0 0 1 .32 0l.634 1.285a.18.18 0 0 0 .134.098l1.42.206c.145.021.204.2.098.303L9.42 6.993a.18.18 0 0 0-.051.158l.242 1.414a.178.178 0 0 1-.258.187l-1.27-.668a.18.18 0 0 0-.165 0l-1.27.668a.178.178 0 0 1-.257-.187l.242-1.414a.18.18 0 0 0-.05-.158l-1.03-1.001a.178.178 0 0 1 .098-.303l1.42-.206a.18.18 0 0 0 .134-.098z"/><path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z"/>', bmFilled = '<path fill-rule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5M8.16 4.1a.178.178 0 0 0-.32 0l-.634 1.285a.18.18 0 0 1-.134.098l-1.42.206a.178.178 0 0 0-.098.303L6.58 6.993c.042.041.061.1.051.158L6.39 8.565a.178.178 0 0 0 .258.187l1.27-.668a.18.18 0 0 1 .165 0l1.27.668a.178.178 0 0 0 .257-.187L9.368 7.15a.18.18 0 0 1 .05-.158l1.028-1.001a.178.178 0 0 0-.098-.303l-1.42-.206a.18.18 0 0 1-.134-.098z"/>';
function _updateBookmarkIcon(e) {
  const t = document.getElementById('bookmarkIcon'), n = document.getElementById('bookmarkBtn');
  if (!t || !n)
    return;
  const a = !!e && _bookmarks.some(t => t.id === e);
  t.innerHTML = a ? bmFilled : bmOutline, n.title = a ? 'Remove bookmark' : 'Bookmark this page';
}
async function toggleBookmark() {
  const e = document.getElementById('addrInput').value.trim();
  if (!e)
    return;
  await _bookmarksReady;
  if (_bookmarks.find(t => t.id === e))
    return _bookmarks = _bookmarks.filter(t => t.id !== e), _deleteBookmark(e), _updateBookmarkIcon(e), void _renderShortcuts();
  let t = '';
  try {
    t = new URL(e).hostname;
  } catch (e) {
  }
  let n = t;
  try {
    n = frame.element.contentDocument.title || t;
  } catch (e) {
  }
  const a = {
    id: e,
    url: e,
    label: n || e,
    faviconUrl: sjEncode('https://www.google.com/s2/favicons?domain=' + t + '&sz=128'),
    bookmark: !0,
    ts: Date.now()
  };
  _bookmarks.push(a), _saveBookmark(a), _updateBookmarkIcon(e), _renderShortcuts();
}
function toggleFullscreen() {
  const e = document.getElementById('frame');
  document.fullscreenElement ? document.exitFullscreen() : e.requestFullscreen();
}
document.addEventListener('fullscreenchange', () => {
  document.getElementById('fsIcon').innerHTML = document.fullscreenElement ? fsExit : fsEnter;
}), frame = controller.createFrame(document.getElementById('frame'), {
  plugins: [
    new $jetUtils.HttpCachePlugin(),
    new $jetUtils.UrlWatcherPlugin(e => {
      document.getElementById('addrInput').value = e, updateLockIcon(e), _updateBookmarkIcon(e), _checkExtensions(e);
    })
  ]
}), controller.id = 'OPM', controller.rpc.id = 'tabchannel-OPM', controller.prefix = controller.config.prefix, frame.prefix = controller.prefix, frame.fetchHandler.context = frame.context, frame.fetchHandler.context.hooks = { rewriter: frame.fetchHandler.hooks.rewriter }, controller.setupMessagePort(), frame.element.addEventListener('load', stopFrameLoading);
const link = document.querySelector('link[rel~=\'icon\']') || document.createElement('link');
link.rel = 'icon', link.href = 'data:,', document.head.appendChild(link);
let focusTimeout = null;
document.addEventListener('visibilitychange', e => {
  if (titleChangerEnabled)
    if (document.hidden)
      document.title = 'New Tab';
    else {
      try {
        clearInterval(focusTimeout);
      } catch {
      }
      focusTimeout = null, document.title = 'atlas';
    }
});
let _effectsVolume = 1, _currentAudio = null, _effectsSearchTimer = null, _effectsLoaded = !1, _effectsPage = 1, _effectsKeyword = null, _effectsLoading = !1, _effectsExhausted = !1, _effectsAll = [], _effectsLoadGen = 0, _effectsScrollTop = 0;
function _makeGridVirtualizer(e, t, n, a, o) {
  const s = document.getElementById(e), r = document.getElementById(t), i = document.getElementById(n), c = 2;
  let l = [], d = 0, u = 0, m = 0, h = 0, p = 0, g = 0, _ = !1;
  function f() {
    const e = getComputedStyle(i), t = e.gridTemplateColumns.split(' ').filter(e => e && '0px' !== e);
    d = Math.max(1, t.length), m = parseFloat(e.rowGap) || 0, h = parseFloat(getComputedStyle(r).paddingTop) || 0;
    const n = i.firstElementChild;
    if (n) {
      const e = parseFloat(getComputedStyle(n).height) || n.getBoundingClientRect().height;
      e > 0 && (u = e + m);
    }
  }
  function y() {
    if (u > 0 && d > 0)
      return;
    if (f(), u > 0)
      return;
    if (!l.length)
      return;
    i.textContent = '', i.style.top = h + 'px';
    const e = Math.min(l.length, d);
    for (let t = 0; t < e; t++)
      i.appendChild(a(l[t], t));
    p = 0, g = e, f();
  }
  function v() {
    if (!l.length || s.classList.contains('flow'))
      return;
    if (y(), !u)
      return;
    const e = Math.ceil(l.length / d), t = Math.max(0, e * u - m), n = t + 'px';
    r.style.height !== n && (r.style.height = n);
    const _ = s.scrollTop, f = s.clientHeight || 1;
    let v = Math.floor((_ - h) / u) - c;
    v < 0 && (v = 0);
    let E = Math.ceil((_ - h + f) / u) + c;
    E > e && (E = e), E <= v && (E = Math.min(e, v + 1));
    const S = h + v * u + 'px';
    i.style.top !== S && (i.style.top = S);
    const w = v * d, C = Math.min(l.length, E * d);
    w === p && C === g || function (e, t) {
      if (e >= g || t <= p) {
        i.textContent = '';
        for (let n = e; n < t; n++)
          i.appendChild(a(l[n], n));
        return p = e, void (g = t);
      }
      const n = Math.max(p, e), o = Math.min(g, t);
      for (let e = p; e < n; e++)
        i.firstElementChild?.remove();
      for (let e = o; e < g; e++)
        i.lastElementChild?.remove();
      for (let t = n - 1; t >= e; t--)
        i.prepend(a(l[t], t));
      for (let e = o; e < t; e++)
        i.appendChild(a(l[e], e));
      p = e, g = t;
    }(w, C), o && _ + f >= h + t - f && o();
  }
  return s.addEventListener('scroll', function () {
    _ || (_ = !0, requestAnimationFrame(() => {
      _ = !1, v();
    }));
  }, { passive: !0 }), window.addEventListener('resize', () => {
    if (!l.length || s.classList.contains('flow'))
      return;
    if (!i.firstElementChild)
      return u = 0, void (d = 0);
    const e = u > 0 ? Math.floor(Math.max(0, s.scrollTop - h) / u) * d : 0;
    u = 0, d = 0, i.textContent = '', p = 0, g = 0, y(), u > 0 && (s.scrollTop = h + Math.floor(e / d) * u), v();
  }), {
    setItems(e) {
      l = e || [], g > l.length && (i.textContent = '', p = 0, g = 0), v();
    },
    restore(e) {
      if (!l.length)
        return;
      if (y(), !u)
        return;
      const t = Math.ceil(l.length / d), n = Math.max(0, t * u - m);
      r.style.height = n + 'px';
      const a = Math.max(0, 2 * h + n - s.clientHeight);
      s.scrollTop = Math.min(e || 0, a), v();
    },
    clear() {
      i.textContent = '', p = 0, g = 0;
    },
    reset() {
      l = [], i.textContent = '', r.style.height = '', i.style.top = '', u = 0, d = 0, p = 0, g = 0;
    },
    enterFlow() {
      s.classList.add('flow'), i.style.top = '', r.style.height = '';
    },
    exitFlow() {
      s.classList.remove('flow');
    },
    isMounted: () => !s.classList.contains('flow') && !!i.firstElementChild,
    scrollTop: () => s.scrollTop
  };
}
async function _getMyinstantsEffects(e = 1, t = null) {
  const n = t ? `https://www.myinstants.com/en/search/?name=${ encodeURIComponent(t) }&page=${ e }` : `https://www.myinstants.com/en/categories/sound%20effects/us/?page=${ e }`, a = sjEncode(n), o = await fetch(a), s = await o.text(), r = new DOMParser().parseFromString(s, 'text/html').querySelectorAll('.instant'), i = [];
  return r.forEach(e => {
    const t = e.querySelector('.instant-link'), n = e.querySelector('.small-button');
    if (!t || !n)
      return;
    const a = t.textContent.trim(), o = n.getAttribute('onclick'), s = o?.match(/play\(['"]([^'"]+)['"]/);
    if (!s)
      return;
    const r = s[1], c = sjEncode(`https://www.myinstants.com${ r }`);
    i.push({
      title: a,
      src: c
    });
  }), i;
}
const _sblSrc = e => sjEncode(e.startsWith('http') ? e : 'https://soundbuttonslab.com' + e), _sblIo = '?$io=' + encodeURIComponent('https://soundbuttonslab.com');
async function _getSoundButtonsLabEffects(e = 1, t = null) {
  const n = t ? `/api/v1/search-sound-button?q=${ encodeURIComponent(t) }&page=${ e }` : `/api/v1/get-home-page-trending-soundboard-buttons?page=${ e }`, a = await fetch(sjEncode('https://soundbuttonslab.com' + n) + _sblIo);
  if (!a.ok)
    throw new Error(`HTTP ${ a.status } for ${ n }`);
  const o = await a.json();
  return t ? o.results.map(e => ({
    title: e.title,
    src: _sblSrc(e.file)
  })) : o.results.data.map(e => ({
    title: e.name,
    src: _sblSrc(e.audio)
  }));
}
async function getEffects(e = 1, t = null) {
  const [n, a] = await Promise.all([
    _getMyinstantsEffects(e, t).catch(() => []),
    _getSoundButtonsLabEffects(e, t).catch(() => [])
  ]);
  return [
    ...n,
    ...a
  ];
}
const _effectsVirt = _makeGridVirtualizer('effectsGridWrap', 'effectsGridSizer', 'effectsGrid', e => _buildEffectButton(e.title, e.src), () => _loadEffectsPage());
function openEffects() {
  _activateAtlasScreen('effectsScreen');
  const e = document.getElementById('effectsScreen'), t = e.classList.contains('open');
  e.classList.add('open'), t || _genie(e, 'navEffects', !0), _effectsLoaded ? _effectsVirt.isMounted() || (_renderEffectsList(), _effectsVirt.restore(_effectsScrollTop)) : _effectsReload(null);
}
function closeEffects() {
  const e = document.getElementById('effectsScreen'), t = e.classList.contains('open');
  _effectsScrollTop = _effectsVirt.scrollTop(), e.classList.remove('open'), t && _genie(e, 'navEffects', !1), setTimeout(() => {
    e.classList.contains('open') || (_effectsLoadGen++, _effectsLoading = !1, _effectsVirt.clear());
  }, 520);
}
function _renderEffectSkeletons(e, t) {
  e.innerHTML = '';
  for (let n = 0; n < t; n++) {
    const t = document.createElement('div');
    t.className = 'effect-btn skeleton', e.appendChild(t);
  }
}
function _fillingEffectSkeletonCount(e) {
  return Math.max(1, Math.floor((e.clientWidth + 8) / 108)) * Math.max(1, Math.ceil(1.6 * e.clientHeight / 108));
}
function _effectsReload(e) {
  _effectsPage = 1, _effectsKeyword = e || null, _effectsLoading = !1, _effectsExhausted = !1, _effectsAll = [], _effectsLoadGen++, _effectsScrollTop = 0, _effectsVirt.reset(), _effectsVirt.enterFlow();
  const t = document.getElementById('effectsGridWrap');
  _renderEffectSkeletons(document.getElementById('effectsGrid'), _fillingEffectSkeletonCount(t)), t.scrollTop = 0, _loadEffectsPage();
}
function _renderEffectsList() {
  _effectsAll.length && (_effectsVirt.exitFlow(), _effectsVirt.setItems(_effectsAll));
}
function _buildDownloadIcon() {
  const e = 'http://www.w3.org/2000/svg', t = document.createElementNS(e, 'svg');
  t.setAttribute('viewBox', '0 0 24 24');
  const n = document.createElementNS(e, 'path');
  n.setAttribute('d', 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4');
  const a = document.createElementNS(e, 'polyline');
  a.setAttribute('points', '7 10 12 15 17 10');
  const o = document.createElementNS(e, 'line');
  return o.setAttribute('x1', '12'), o.setAttribute('y1', '15'), o.setAttribute('x2', '12'), o.setAttribute('y2', '3'), t.appendChild(n), t.appendChild(a), t.appendChild(o), t;
}
async function _downloadEffect(e, t) {
  const n = (e || 'sound-effect').replace(/[\\/:*?"<>|]+/g, '').trim() || 'sound-effect';
  try {
    const e = await fetch(t), a = await e.blob(), o = URL.createObjectURL(a), s = document.createElement('a');
    s.href = o, s.download = n + '.mp3', document.body.appendChild(s), s.click(), s.remove(), setTimeout(() => URL.revokeObjectURL(o), 1000);
  } catch (e) {
    window.open(t, '_blank');
  }
}
function _buildEffectButton(e, t) {
  const n = 'http://www.w3.org/2000/svg', a = document.createElement('button');
  a.className = 'effect-btn';
  const o = document.createElementNS(n, 'svg');
  o.setAttribute('viewBox', '0 0 24 24');
  const s = document.createElementNS(n, 'polygon');
  s.setAttribute('points', '11 5 6 9 2 9 2 15 6 15 11 19 11 5');
  const r = document.createElementNS(n, 'path');
  r.setAttribute('d', 'M15.54 8.46a5 5 0 0 1 0 7.07');
  const i = document.createElementNS(n, 'path');
  i.setAttribute('d', 'M19.07 4.93a10 10 0 0 1 0 14.14'), o.appendChild(s), o.appendChild(r), o.appendChild(i);
  const c = document.createElement('span');
  c.className = 'effect-title'; c.textContent = e;
  const l = e.length, d = l <= 6 ? 14 : l <= 12 ? 12 : l <= 20 ? 11 : l <= 30 ? 10 : 9;
  c.style.fontSize = d + 'px';
  const u = document.createElement('div');
  u.setAttribute('role', 'button'); u.setAttribute('tabindex', '0');
  u.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); event.stopPropagation(); _downloadEffect(e, t);
    }
  });
  return u.className = 'effect-download effect-action', u.title = 'Download mp3', u.setAttribute('aria-label', 'Download mp3'), u.appendChild(_buildDownloadIcon()), u.onclick = n => {
    n.stopPropagation(), _downloadEffect(e, t);
  }, a.appendChild(o), a.appendChild(c), a.appendChild(u), a.onclick = () => _playEffect(a, t), _currentAudio && _currentAudio._effectSrc === t && a.classList.add('playing'), a;
}
async function _loadEffectsPage() {
  if (_effectsLoading || _effectsExhausted)
    return;
  _effectsLoading = !0;
  const e = _effectsLoadGen, t = document.getElementById('effectsGrid');
  try {
    const n = await getEffects(_effectsPage, _effectsKeyword);
    if (e !== _effectsLoadGen)
      return void (_effectsLoading = !1);
    if (!n.length)
      return _effectsExhausted = !0, 1 === _effectsPage && (_effectsVirt.enterFlow(), t.innerHTML = '<div class="effects-loading">error loading, refresh and try again</div>'), void (_effectsLoading = !1);
    _effectsAll.push(...n), _effectsPage++, _effectsLoaded = !0, _effectsLoading = !1, _renderEffectsList();
  } catch (n) {
    if (e !== _effectsLoadGen)
      return void (_effectsLoading = !1);
    1 === _effectsPage && (_effectsVirt.enterFlow(), t.innerHTML = '<div class="effects-loading">failed to load</div>'), _effectsLoading = !1;
  }
}
function _clearPlayingBtns() {
  document.querySelectorAll('.effect-btn.playing').forEach(e => e.classList.remove('playing'));
}
function _playEffect(e, t) {
  if (_currentAudio) {
    const e = _currentAudio._effectSrc === t;
    if (_currentAudio.pause(), _currentAudio.currentTime = 0, _currentAudio = null, _clearPlayingBtns(), e)
      return;
  }
  const n = new Audio(t);
  n.volume = _effectsVolume, n._effectSrc = t, n.play().catch(() => {
  }), e.classList.add('playing'), _currentAudio = n, n.onended = () => {
    _currentAudio === n && (_currentAudio = null, _clearPlayingBtns());
  };
}
function _updateVolumeTrack() {
  const e = document.getElementById('volumeSlider'), t = 100 * parseFloat(e.value);
  e.style.background = `linear-gradient(to right, var(--accent) ${ t }%, rgba(255,255,255,0.12) ${ t }%)`;
}
_updateVolumeTrack(), document.getElementById('volumeSlider').addEventListener('input', function () {
  _effectsVolume = parseFloat(this.value), _currentAudio && (_currentAudio.volume = _effectsVolume), _updateVolumeTrack();
}), document.getElementById('effectsSearch').addEventListener('input', function () {
  clearTimeout(_effectsSearchTimer);
  const e = this.value.trim();
  _effectsSearchTimer = setTimeout(() => _effectsReload(e || null), 350);
});
let _luminReady = !1, _luminInitPromise = null, _gamesLoaded = !1, _gamesKeyword = null, _gamesSearchTimer = null, _gamesLoadGen = 0, _gamesScrollTop = 0;
const _gamesImgCache = new WeakMap(), GAMES_CACHE_TTL = 86400000;
function _migrateOldDBs(e) {
  return localStorage.getItem('O_MIGRATED') ? Promise.resolve() : _oMigratePromise || (_oMigratePromise = ((async () => {
    try {
      const t = await new Promise((e, t) => {
          const n = indexedDB.open('oCache', 1);
          n.onupgradeneeded = () => {
            n.result.createObjectStore('cache');
          }, n.onsuccess = () => e(n.result), n.onerror = () => t(n.error);
        }), n = await new Promise((e, n) => {
          const a = t.transaction('cache', 'readonly'), o = a.objectStore('cache'), s = o.getAllKeys(), r = o.getAll();
          a.oncomplete = () => e({
            keys: s.result,
            vals: r.result
          }), a.onerror = () => n(a.error);
        });
      t.close();
      const a = await new Promise((e, t) => {
          const n = indexedDB.open('oAiChats', 1);
          n.onupgradeneeded = () => {
            n.result.createObjectStore('chats', { keyPath: 'id' });
          }, n.onsuccess = () => e(n.result), n.onerror = () => t(n.error);
        }), o = await new Promise((e, t) => {
          const n = a.transaction('chats', 'readonly').objectStore('chats').getAll();
          n.onsuccess = () => e(n.result || []), n.onerror = () => t(n.error);
        });
      a.close(), (n.keys.length || o.length) && await new Promise((t, a) => {
        const s = e.transaction([
          'cache',
          'chats'
        ], 'readwrite');
        n.keys.forEach((e, t) => s.objectStore('cache').put(n.vals[t], e)), o.forEach(e => s.objectStore('chats').put(e)), s.oncomplete = t, s.onerror = () => a(s.error);
      }), await Promise.all([
        'oCache',
        'oAiChats'
      ].map(e => new Promise(t => {
        const n = indexedDB.deleteDatabase(e);
        n.onsuccess = n.onerror = n.onblocked = t;
      }))), localStorage.setItem('O_MIGRATED', '1');
    } catch (e) {
      console.error('[O] migration failed:', e);
    }
  })()), _oMigratePromise);
}
function _oDB() {
  return _oDBPromise || (_oDBPromise = new Promise((e, t) => {
    const n = indexedDB.open('O', 2);
    n.onupgradeneeded = () => {
      const e = n.result;
      e.objectStoreNames.contains('cache') || e.createObjectStore('cache'), e.objectStoreNames.contains('chats') || e.createObjectStore('chats', { keyPath: 'id' }), e.objectStoreNames.contains('bookmarks') || e.createObjectStore('bookmarks', { keyPath: 'id' });
    }, n.onsuccess = () => {
      const t = n.result;
      _migrateOldDBs(t).then(() => e(t));
    }, n.onerror = () => {
      _oDBPromise = null, t(n.error);
    };
  }), _oDBPromise);
}
async function _loadGamesCacheEntry(e, t) {
  try {
    const n = await _oDB(), a = await new Promise((t, a) => {
        const o = n.transaction('cache', 'readonly').objectStore('cache').get(e);
        o.onsuccess = () => t(o.result), o.onerror = () => a(o.error);
      });
    return a && t(a.games) ? Date.now() - a.ts > GAMES_CACHE_TTL ? null : a.games : null;
  } catch (t) {
    return console.error('[O] cache load failed:', e, t), null;
  }
}
async function _saveGamesCacheEntry(e, t) {
  try {
    const n = await _oDB();
    await new Promise((a, o) => {
      const s = n.transaction('cache', 'readwrite');
      s.objectStore('cache').put({
        ts: Date.now(),
        games: t
      }, e), s.oncomplete = a, s.onerror = () => o(s.error);
    });
  } catch (t) {
    console.error('[O] cache save failed:', e, t);
  }
}
async function _loadAllBookmarks() {
  try {
    const e = await _oDB(), t = await new Promise((t, n) => {
        const a = e.transaction('bookmarks', 'readonly').objectStore('bookmarks').getAll();
        a.onsuccess = () => t(a.result || []), a.onerror = () => n(a.error);
      });
    return t.sort((e, t) => (e.ts || 0) - (t.ts || 0)), t;
  } catch (e) {
    return console.error('[O] bookmarks load failed:', e), [];
  }
}
async function _getBookmark(e) {
  try {
    const t = await _oDB();
    return await new Promise((n, a) => {
      const o = t.transaction('bookmarks', 'readonly').objectStore('bookmarks').get(e);
      o.onsuccess = () => n(o.result || null), o.onerror = () => a(o.error);
    });
  } catch (t) {
    return console.error('[O] bookmark lookup failed:', e, t), null;
  }
}
async function _saveBookmark(e) {
  try {
    const t = await _oDB();
    await new Promise((n, a) => {
      const o = t.transaction('bookmarks', 'readwrite');
      o.objectStore('bookmarks').put(e), o.oncomplete = n, o.onerror = () => a(o.error);
    });
  } catch (t) {
    console.error('[O] bookmark save failed:', e.id, t);
  }
}
async function _deleteBookmark(e) {
  try {
    const t = await _oDB();
    await new Promise((n, a) => {
      const o = t.transaction('bookmarks', 'readwrite');
      o.objectStore('bookmarks').delete(e), o.oncomplete = n, o.onerror = () => a(o.error);
    });
  } catch (t) {
    console.error('[O] bookmark delete failed:', e, t);
  }
}
function _repoUrl(repo) { return 'https://cdn.jsdelivr.net/gh/' + repo + '/'; }
window._repoUrl = _repoUrl;
const LUMIN_BLOCKED = /a\.luminsdk\.com/i, P = Array.prototype.push, A = Function.prototype.apply, hit = e => 'string' == typeof e && e.length < 256 && LUMIN_BLOCKED.test(e);
function _luminPush(e) {
  if (1 === arguments.length)
    return hit(e) ? this.length : P.call(this, e);
  for (let e = 0; e < arguments.length; e++)
    if (hit(arguments[e]))
      return A.call(P, this, Array.prototype.filter.call(arguments, e => !hit(e)));
  return A.call(P, this, arguments);
}
let _luminHooked = 0;
function _withLuminHook(e) {
  0 == _luminHooked++ && (Array.prototype.push = _luminPush);
  const t = () => {
    0 == --_luminHooked && Array.prototype.push === _luminPush && (Array.prototype.push = P);
  };
  let n;
  try {
    n = Promise.resolve(e());
  } catch (e) {
    n = Promise.reject(e);
  }
  return n.then(t, t), n;
}
let _luminScriptPromise = null;
function _initLumin() {
  if (_luminReady) return Promise.resolve();
  if (!_luminScriptPromise) _luminScriptPromise = _withLuminHook(() => loadScript(getBase() + '/lmnsdk.js'));
  return _luminInitPromise || (_luminInitPromise = _luminScriptPromise.then(() => _withLuminHook(() => Lumin.init({ headless: !0 }))).then(() => {
    _luminReady = !0;
  }).catch(error => {
    _luminInitPromise = null; _luminScriptPromise = null;
    throw error;
  }), _luminInitPromise);
}
const GNM = {
    index: _repoUrl('freebuisness/assets') + 'zones.json',
    html: _repoUrl('freebuisness/html'),
    covers: _repoUrl('freebuisness/covers')
  }, GMSHELF = {
    seraph: {
      index: _repoUrl('gmshelf/seraph') + 'seraph.json',
      base: _repoUrl('gmshelf/seraph').replace(/\/$/, '')
    }
  }, OPMSOURCES = {
    ugs: { index: getAsset('ugs.json') },
    ckv: { index: getAsset('ckv.json') }
  }, _gamesState = {
    all: null,
    fetchPromise: null,
    matches: null
  };
function _normalizeGameName(e) {
  return e.toLowerCase().replace(/[^a-z0-9]+/g, '');
}
function _filterByName(e, t) {
  if (!t)
    return e;
  const n = _normalizeGameName(t);
  return n ? e.filter(e => e._norm && e._norm.includes(n)) : e;
}
async function _fetchAllLuminGames() {
  await _initLumin();
  const e = [];
  let t = 1, n = 1;
  do {
    const a = await Lumin.getGames({
      page: t,
      limit: 99999
    });
    (a.games || []).forEach(t => e.push({
      source: 'lumin',
      name: t.name,
      id: t.id,
      image_token: t.image_token
    })), n = a.pages || 1, t++;
  } while (t <= n);
  return e;
}
async function _fetchAllGnmGames() {
  return (await (await fetch(GNM.index)).json()).filter(e => e.url && e.url.startsWith('{HTML_URL}') && e.cover && !e.name.startsWith('[!]')).map(e => ({
    source: 'gn-math',
    name: e.name,
    url: e.url,
    cover: e.cover,
    _html: GNM.html,
    _covers: GNM.covers
  }));
}
function _gmshelfCoverCandidates(e, t) {
  const n = t.replace(/\/[^/]*$/, '').split('/').pop(), a = t.split('/').pop().replace(/\.[^.]*$/, ''), o = [
      'jpg',
      'png',
      'webp',
      'jpeg'
    ], s = new Set();
  return [
    n,
    a
  ].forEach(e => o.forEach(t => s.add(`${ e }.${ t }`))), [...s].map(t => `${ e }/covers/${ t }`);
}
async function _fetchGmshelfGames(e) {
  const {
      index: t,
      base: n
    } = GMSHELF[e], a = await fetch(t), o = await a.json();
  return (Array.isArray(o) ? o : o.games || []).filter(e => e.url && e.name).map(t => ({
    source: e,
    name: t.name,
    url: n + t.url,
    cover: _gmshelfCoverCandidates(n, t.url)
  }));
}
function _tileCover(e) {
  let t = 0;
  for (const n of e || '?')
    t = 31 * t + n.charCodeAt(0) >>> 0;
  const n = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="hsl(${ t % 360 },55%,38%)"/><text x="100" y="128" font-size="72" text-anchor="middle" fill="#fff" font-family="sans-serif">${ (e || '?').trim().charAt(0).toUpperCase() }</text></svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(n);
}
async function _fetchNewGames(e) {
  const {index: t} = OPMSOURCES[e], n = await fetch(t), a = await n.json();
  return (Array.isArray(a) ? a : a.games || []).filter(e => e && e.name && e.author && e.file).map(t => ({
    source: e,
    name: t.name,
    url: _repoUrl(t.author) + t.file,
    cover: t.cover_author ? _repoUrl(t.cover_author) + t.cover_file : _tileCover(t.name)
  }));
}
function _finalizeGamesCatalog(e) {
  e.forEach(e => {
    if (e._norm = _normalizeGameName(e.name), e.displayName = e.name, 'gn-math' === e.source)
      e.displayName = `${ e.name } (gn-math)`;
    else if ('seraph' === e.source)
      e.displayName = `${ e.name } (seraph)`;
    else if ('ugs' === e.source)
      e.displayName = `${ e.name } (ugs)`;
    else if ('ckv' === e.source)
      e.displayName = `${ e.name } (ckv)`;
    else if ('lumin' === e.source) {
      const t = e.id && e.id.includes('/') ? e.id.split('/')[0] : e.source;
      e.displayName = `${ e.name } (${ t })`;
    }
  });
  const t = new Intl.Collator(void 0, { sensitivity: 'base' });
  return e.sort((e, n) => t.compare(e.displayName, n.displayName)), e;
}
async function _ensureGamesCatalog() {
  _gamesState.all || (_gamesState.fetchPromise || (_gamesState.fetchPromise = ((async () => {
    const e = await _loadGamesCacheEntry('games-v2', e => e && 'object' == typeof e);
    let t = !1, n = !1, a = !1, o = !1;
    const [s, r, i, c, l] = await Promise.all([
        _fetchAllLuminGames().catch(() => []),
        e && Array.isArray(e.gnm) ? e.gnm : _fetchAllGnmGames().catch(() => (t = !0, [])),
        e && Array.isArray(e.seraph) ? e.seraph : _fetchGmshelfGames('seraph').catch(() => (n = !0, [])),
        e && Array.isArray(e.ugs) ? e.ugs : _fetchNewGames('ugs').catch(() => (a = !0, [])),
        e && Array.isArray(e.ckv) ? e.ckv : _fetchNewGames('ckv').catch(() => (o = !0, []))
      ]), d = { ...e || {} };
    t || (d.gnm = r), n || (d.seraph = i), a || (d.ugs = c), o || (d.ckv = l), Object.keys(d).length > 0 && await _saveGamesCacheEntry('games-v2', d);
    const u = new Set(), m = [
        ...s.filter(e => !u.has(e.id) && (u.add(e.id), !0)),
        ...r,
        ...i,
        ...c,
        ...l
      ];
    _gamesState.all = _finalizeGamesCatalog(m);
  })()), _gamesState.fetchPromise.catch(() => {
    _gamesState.fetchPromise = null;
  })), await _gamesState.fetchPromise), _gamesState.matches = _filterByName(_gamesState.all, _gamesKeyword);
}
function _gameCardImg(e, t) {
  const n = Array.isArray(e) ? e.slice() : [e];
  if (!n.length) {
    const e = document.createElement('div');
    return e.className = 'game-card-placeholder', e;
  }
  const a = document.createElement('img');
  a.className = 'game-card-img', a.alt = t, a.loading = 'lazy', a.decoding = 'async';
  const o = () => {
    if (!n.length) {
      const e = document.createElement('div');
      return e.className = 'game-card-placeholder', void a.replaceWith(e);
    }
    a.src = n.shift();
  };
  return a.onerror = o, o(), a;
}
function _buildGameCard(e) {
  const t = document.createElement('button');
  t.className = 'game-card';
  const n = _gamesImgCache.get(e);
  if (n)
    t.appendChild(_gameCardImg(n, e.displayName));
  else {
    const n = document.createElement('div');
    n.className = 'game-card-placeholder', t.appendChild(n);
    const a = _gamesLoadGen;
    _resolveGameImgSrc(e).then(t => {
      t && a === _gamesLoadGen && n.isConnected && n.replaceWith(_gameCardImg(t, e.displayName));
    }).catch(() => {
    });
  }
  const a = document.createElement('div');
  a.className = 'game-card-name';
  const o = document.createElement('span');
  o.textContent = e.name || e.displayName;
  const source = document.createElement('span'), action = document.createElement('span');
  source.className = 'game-card-source'; source.textContent = e.source;
  action.className = 'game-card-action'; action.textContent = 'Play';
  a.appendChild(o); t.append(a, source, action); t.onclick = _gameCardOnClick(e); return t;
}
async function _resolveGameImgSrc(e) {
  if (_gamesImgCache.has(e))
    return _gamesImgCache.get(e);
  const t = 'lumin' === e.source ? await Lumin.getImageUrl(e.image_token).catch(() => null) : 'cloud' === e.source ? sjEncode(e.cover) : Array.isArray(e.cover) ? e.cover : e.cover.replace('{COVER_URL}', e._covers);
  return t && _gamesImgCache.set(e, t), t;
}
function _gameCardOnClick(e) {
  if ('lumin' === e.source)
    return () => openGamePlayer(e.id);
  const t = 'gn-math' === e.source ? e._html + '/' + e.url.replace('{HTML_URL}/', '') : e.url;
  return () => openDirectGame(e.source, e.name, t);
}
const _gamesVirt = _makeGridVirtualizer('gamesGridWrap', 'gamesGridSizer', 'gamesGrid', e => _buildGameCard(e));
function _updateGamesCount() {
  document.getElementById('gamesCount').textContent = _gamesState.matches ? _gamesState.matches.length.toLocaleString() + ' Total' : '';
}
function _renderGameSkeletons(e, t) {
  e.innerHTML = '';
  for (let n = 0; n < t; n++) {
    const t = document.createElement('div');
    t.className = 'game-card skeleton';
    const n = document.createElement('div');
    n.className = 'game-card-placeholder', t.appendChild(n), e.appendChild(t);
  }
}
function _fillingSkeletonCount(e) {
  return Math.max(1, Math.floor((e.clientWidth + 8) / 163)) * Math.max(1, Math.ceil(1.6 * e.clientHeight / 135.1875));
}
function _renderGamesList() {
  const e = document.getElementById('gamesGrid');
  _updateGamesCount();
  const t = _gamesState.matches;
  if (!t || !t.length)
    return _gamesVirt.reset(), _gamesVirt.enterFlow(), void (e.innerHTML = '<div class="games-loading">no results</div>');
  document.getElementById('gamesScreen').classList.contains('open') && (_gamesVirt.exitFlow(), _gamesVirt.setItems(t));
}
async function _loadFilteredGames(e, t, n, a) {
  const o = a.getList();
  if (o)
    return _gamesVirt.exitFlow(), _gamesState.matches = _filterByName(o, _gamesKeyword), void _renderGamesList();
  _gamesVirt.enterFlow(), _renderGameSkeletons(t, _fillingSkeletonCount(n)), document.getElementById('gamesCount').textContent = '';
  try {
    await a.ensureLoaded();
  } catch (n) {
    return void (e === _gamesLoadGen && (_gamesVirt.enterFlow(), t.innerHTML = `<div class="games-loading">${ a.errorMsg }</div>`));
  }
  e === _gamesLoadGen && (a.onLoaded?.(), _gamesState.matches = _filterByName(a.getList(), _gamesKeyword), _renderGamesList());
}
async function _gamesReload(e) {
  _gamesKeyword = e || null;
  const t = ++_gamesLoadGen;
  _gamesScrollTop = 0;
  const n = document.getElementById('gamesGrid'), a = document.getElementById('gamesGridWrap');
  return _gamesVirt.reset(), a.scrollTop = 0, _loadFilteredGames(t, n, a, _cloudEnabled ? {
    getList: () => _cloudGames.length ? _cloudGames : null,
    ensureLoaded: async () => {
      _cloudGames = await loadCloudGames();
    },
    errorMsg: 'failed to load cloud games'
  } : {
    getList: () => _gamesState.all,
    ensureLoaded: _ensureGamesCatalog,
    errorMsg: 'failed to load',
    onLoaded: () => {
      _gamesLoaded = !0;
    }
  });
}
function openGames() {
  _activateAtlasScreen('gamesScreen');
  const e = document.getElementById('gamesScreen'), t = e.classList.contains('open');
  e.classList.add('open'), t || _genie(e, 'navGames', !0), _gamesLoaded ? _gamesVirt.isMounted() || (_renderGamesList(), _gamesVirt.restore(_gamesScrollTop)) : _gamesReload(null);
}
function closeGames() {
  const e = document.getElementById('gamesScreen'), t = e.classList.contains('open');
  _gamesScrollTop = _gamesVirt.scrollTop(), e.classList.remove('open'), t && _genie(e, 'navGames', !1), setTimeout(() => {
    e.classList.contains('open') || _gamesVirt.clear();
  }, 520);
}
let _gamePlayerGen = 0, _skipNextGameAdBlockInject = !1, _gamepadDetectionInterval = null;
function _startGamepadDetection() {
  if (_gamepadDetectionInterval)
    return;
  const e = () => {
    const e = navigator.getGamepads ? navigator.getGamepads() : [];
    let t = !1;
    for (let n = 0; n < e.length; n++)
      if (e[n] && e[n].connected) {
        t = !0;
        break;
      }
    const n = document.getElementById('gamePlayerController');
    n && n.classList.toggle('hidden', !t);
  };
  e(), _gamepadDetectionInterval = setInterval(e, 1000);
}
function _stopGamepadDetection() {
  _gamepadDetectionInterval && (clearInterval(_gamepadDetectionInterval), _gamepadDetectionInterval = null);
  const e = document.getElementById('gamePlayerController');
  e && e.classList.add('hidden');
}
function _openGamePlayerShell(e) {
  _gamePlayerGen++;
  const t = _gamePlayerGen, n = document.getElementById('gamePlayer'), a = document.getElementById('gameFrame'), o = document.getElementById('gamePlayerLoading'), s = document.getElementById('gamePlayerId');
  return _cloudSession && teardownCloud(!0), document.getElementById('cloudVideoWrap').classList.remove('visible'), _exitStaleFullscreen(_cloudSession ? document.getElementById('cloudVideoWrap') : a), s.textContent = e, a.classList.remove('visible'), a.src = 'about:blank', o.classList.remove('hidden'), o.textContent = 'loading\u2026', n.classList.add('open'), _startGamepadDetection(), {
    gf: a,
    loading: o,
    gen: t
  };
}
function _dirOf(e) {
  const t = new URL(e);
  return t.search = '', t.hash = '', t.pathname = t.pathname.substring(0, t.pathname.lastIndexOf('/') + 1), t.toString();
}
function _withBaseHref(e, t) {
  return /<base[^>]*>/i.test(e) ? e : /<head[^>]*>/i.test(e) ? e.replace(/<head([^>]*)>/i, `<head$1><base href="${ t }">`) : /<html[^>]*>/i.test(e) ? e.replace(/<html([^>]*)>/i, `<html$1><head><base href="${ t }"></head>`) : `<base href="${ t }">` + e;
}
function _gameAdBlockInit() {}
function _ADBLOCKIT(html) { return html; }
function _injectGameAdBlock() {}
function _unwrapModuleContent(e) {
  const t = e.match(/<Content[^>]*>\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*<\/Content>/i);
  if (t)
    return t[1];
  if (/^\s*<Module>/i.test(e)) {
    const t = e.search(/<!doctype html|<html/i);
    if (-1 !== t)
      return e.slice(t);
  }
  return e;
}
async function openDirectGame(e, t, n) {
  const {
    gf: a,
    loading: o,
    gen: s
  } = _openGamePlayerShell(`${ e }/${ t }`);
  try {
    const e = await fetch(n), t = _unwrapModuleContent(await e.text());
    if (s !== _gamePlayerGen)
      return;
    a.onload = () => {
      s === _gamePlayerGen && (o.classList.add('hidden'), a.classList.add('visible'));
    };
    const r = a.contentDocument;
    r.open(), _skipNextGameAdBlockInject = !0, r.write(_ADBLOCKIT(_withBaseHref(t, _dirOf(n)))), r.close();
  } catch (e) {
    s === _gamePlayerGen && (o.textContent = 'failed to load');
  }
}
function openIframeGame(e, t) {
  const {
    gf: n,
    loading: a,
    gen: o
  } = _openGamePlayerShell(e);
  n.onload = () => {
    o === _gamePlayerGen && (a.classList.add('hidden'), n.classList.add('visible'));
  }, n.src = t;
}
async function openGamePlayer(e) {
  const {
    gf: t,
    loading: n,
    gen: a
  } = _openGamePlayerShell(e);
  try {
    await _initLumin();
    const {url: o} = await Lumin.getGameUrl(e), s = await fetch(o), r = await s.text();
    if (a !== _gamePlayerGen)
      return;
    t.onload = () => {
      a === _gamePlayerGen && (n.classList.add('hidden'), t.classList.add('visible'));
    };
    const i = t.contentDocument;
    i.open(), _skipNextGameAdBlockInject = !0, i.write(_ADBLOCKIT(_withBaseHref(r, _dirOf(o)))), i.close();
  } catch (e) {
    a === _gamePlayerGen && (n.textContent = 'failed to load');
  }
}
function closeGamePlayer() {
  resetGameCloseConfirm(), _cloudEndedActive = !1, _cloudStarting = !1, _cancelCloudRetry(), _stopGamepadDetection();
  const e = document.getElementById('gamePlayer'), t = document.getElementById('gameFrame'), n = document.getElementById('cloudVideoWrap'), a = document.getElementById('gamePlayerLoading');
  e.classList.remove('open'), t.src = 'about:blank', t.classList.remove('visible'), n.classList.remove('visible'), a.classList.remove('hidden'), a.textContent = 'loading\u2026', document.getElementById('gamePlayerId').textContent = '', document.getElementById('gamePlayerTimeLeft').textContent = '';
  try {
    Lumin.endGame();
  } catch (e) {
  }
  _cloudEnabled && !_cloudSession && (_gamesState.matches = _filterByName(_cloudGames, _gamesKeyword), _updateGamesCount(), _gamesVirt.setItems(_gamesState.matches));
}
function _exitStaleFullscreen(e) {
  document.fullscreenElement && document.fullscreenElement !== e && document.exitFullscreen().catch(() => {
  });
}
function toggleGameFullscreen() {
  const e = _cloudSession ? document.getElementById('cloudVideoWrap') : document.getElementById('gameFrame');
  document.fullscreenElement ? document.exitFullscreen() : e.requestFullscreen();
}
function _lockCloudKeyboard() {
  try {
    navigator.keyboard?.lock?.();
  } catch {
  }
}
function _unlockCloudKeyboard() {
  try {
    navigator.keyboard?.unlock?.();
  } catch {
  }
}
function toggleControllerMapper() {
  const e = document.getElementById('controllerMapperModal'), t = document.getElementById('cloudVideoWrap');
  e.classList.contains('open') ? closeControllerMapper() : (e.classList.add('open'), t && t.classList.remove('visible'), updateMapperUI());
}
function closeControllerMapper() {
  stopRemapping();
  document.getElementById('controllerMapperModal')?.classList.remove('open');
  if (_cloudSession) document.getElementById('cloudVideoWrap')?.classList.add('visible');
}
function updateMapperUI() {
  const e = document.getElementById('leftStickToggle'), t = document.getElementById('rightStickToggle');
  e && (e.textContent = controllerMap.leftStick), t && (t.textContent = controllerMap.rightStick), document.querySelectorAll('.button-map').forEach(e => {
    const t = parseInt(e.dataset.button), n = controllerMap.buttons[t], a = e.querySelector('.key-display');
    if (!a)
      return;
    let o = null;
    'MOUSE_LEFT' === n ? o = 'Mouse Left' : 'MOUSE_RIGHT' === n ? o = 'Mouse Right' : 'MOUSE_MIDDLE' === n ? o = 'Mouse Middle' : n && n.name && (o = n.name), a.textContent = o || '-', e.classList.toggle('mapped', !!o), e.classList.toggle('unmapped', !o);
    e.setAttribute('role', 'button'); e.setAttribute('tabindex', '0');
    e.setAttribute('aria-label', `${e.querySelector('.cm-name')?.textContent || 'Controller button'}: ${o || 'unmapped'}. Press Enter to remap.`);
  });
}
document.getElementById('gameFrame').addEventListener('load', function () {
  _skipNextGameAdBlockInject ? _skipNextGameAdBlockInject = !1 : _injectGameAdBlock(this);
}), document.addEventListener('fullscreenchange', function () {
  const e = document.getElementById('gamePlayerFsIcon');
  e && (e.innerHTML = document.fullscreenElement ? '<path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3"/>' : '<path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/>'), _cloudSession && (document.fullscreenElement ? _lockCloudKeyboard() : _unlockCloudKeyboard());
}, !0);
const _uiRoot = 'undefined' != typeof shadowRoot && shadowRoot || document;
_uiRoot.addEventListener('click', e => {
  const t = e.target?.closest?.('.cm-trash');
  if (t)
    return e.preventDefault(), e.stopPropagation(), void clearMapping(t.closest('.button-map'));
  const n = e.target?.closest?.('.button-map');
  n && startRemapping(n);
});
let remappingButton = null, remappingCleanup = null;
_uiRoot.addEventListener('keydown', event => {
  const row = event.target?.closest?.('.button-map');
  if (!row || event.target?.closest?.('.cm-trash') || remappingButton) return;
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault(); event.stopPropagation(); startRemapping(row);
  }
});
const _CAP = { capture: !0 }, _KEY_LABELS = {
    ' ': 'Space',
    ArrowUp: '\u2191',
    ArrowDown: '\u2193',
    ArrowLeft: '\u2190',
    ArrowRight: '\u2192',
    Escape: 'Esc',
    Control: 'Ctrl',
    ContextMenu: 'Menu'
  }, _MOUSE_NAMES = {
    0: 'MOUSE_LEFT',
    1: 'MOUSE_MIDDLE',
    2: 'MOUSE_RIGHT'
  }, _keyLabel = e => _KEY_LABELS[e.key] || (1 === e.key.length ? e.key.toUpperCase() : e.key), _kill = e => {
    e.preventDefault(), e.stopImmediatePropagation();
  }, _swallowNext = (e, t) => {
    const n = a => {
      t && !t(a) || (_kill(a), window.removeEventListener(e, n, _CAP));
    };
    window.addEventListener(e, n, _CAP), setTimeout(() => window.removeEventListener(e, n, _CAP), 1000);
  };
function stopRemapping() {
  remappingCleanup && remappingCleanup(), remappingCleanup = null, remappingButton && remappingButton.classList.remove('remapping'), remappingButton = null, updateMapperUI();
}
function assignMapping(e, t) {
  const n = parseInt(e.dataset.button), a = controllerMap.buttons[n], o = a && 'object' == typeof a && a.label || `Button ${ n }`;
  controllerMap.buttons[n] = 'string' == typeof t ? t : {
    ...t,
    label: o
  }, saveControllerMap(), stopRemapping();
}
function clearMapping(e) {
  e && (controllerMap.buttons[parseInt(e.dataset.button)] = null, saveControllerMap(), stopRemapping());
}
function startRemapping(e) {
  if (remappingButton === e)
    return;
  stopRemapping(), remappingButton = e, e.classList.add('remapping');
  const t = e.querySelector('.key-display');
  t && (t.textContent = '...');
  const n = t => {
      if (_kill(t), t.repeat)
        return;
      const n = t.keyCode || t.which;
      _swallowNext('keyup', e => (e.keyCode || e.which) === n), assignMapping(e, {
        key: n,
        name: _keyLabel(t)
      });
    }, a = t => {
      if (t.target?.closest?.('.cm-trash'))
        return;
      if (t.target?.closest?.('.button-map') !== e)
        return void stopRemapping();
      const n = _MOUSE_NAMES[t.button];
      n && (_kill(t), _swallowNext('mouseup'), _swallowNext('click'), 2 === t.button && _swallowNext('contextmenu'), assignMapping(e, n));
    };
  window.addEventListener('keydown', n, _CAP), _uiRoot.addEventListener('mousedown', a, _CAP), remappingCleanup = () => {
    window.removeEventListener('keydown', n, _CAP), _uiRoot.removeEventListener('mousedown', a, _CAP);
  };
}
function toggleStickMode(e) {
  'left' === e ? controllerMap.leftStick = 'WASD' === controllerMap.leftStick ? 'MOUSE' : 'WASD' : controllerMap.rightStick = 'WASD' === controllerMap.rightStick ? 'MOUSE' : 'WASD', saveControllerMap(), updateMapperUI();
}
function resetControllerMap() {
  confirm('Reset all controller mappings to defaults?') && (controllerMap = JSON.parse(JSON.stringify(DEFAULT_CONTROLLER_MAP)), saveControllerMap(), updateMapperUI());
}
document.getElementById('gamesSearch').addEventListener('input', function () {
  clearTimeout(_gamesSearchTimer);
  const e = this.value.trim();
  _gamesSearchTimer = setTimeout(() => _gamesReload(e || null), 350);
});
let _cloudEnabled = !1, _cloudGames = [], _cloudSession = null, _cloudPc = null, _cloudDc = null, _cloudWs = null, _cloudTimers = [], _cloudInputActive = !1, _cloudInputHandlers = null, _cloudStarting = !1, _cloudJitterHandlers = null, _cloudEndedActive = !1, _cloudPendingCandidates = [], _cloudMicStreamPromise = null, _cloudRelay = null, _cloudRetry = null;
const DEFAULT_CONTROLLER_MAP = {
  buttons: {
    0: {
      key: 32,
      name: 'Space',
      label: 'Jump/Interact'
    },
    1: {
      key: 69,
      name: 'E',
      label: 'Use/Interact'
    },
    2: {
      key: 82,
      name: 'R',
      label: 'Reload'
    },
    3: {
      key: 70,
      name: 'F',
      label: 'Action'
    },
    4: {
      key: 81,
      name: 'Q',
      label: 'Ability/Lean Left'
    },
    5: {
      key: 69,
      name: 'E',
      label: 'Ability/Lean Right'
    },
    6: {
      key: 16,
      name: 'Shift',
      label: 'Sprint/Aim'
    },
    7: 'MOUSE_LEFT',
    8: {
      key: 27,
      name: 'Escape',
      label: 'Menu'
    },
    9: {
      key: 13,
      name: 'Enter',
      label: 'Pause'
    },
    10: {
      key: 86,
      name: 'V',
      label: 'Melee'
    },
    11: {
      key: 71,
      name: 'G',
      label: 'Grenade'
    },
    12: {
      key: 38,
      name: '\u2191',
      label: 'Up'
    },
    13: {
      key: 40,
      name: '\u2193',
      label: 'Down'
    },
    14: {
      key: 37,
      name: '\u2190',
      label: 'Left'
    },
    15: {
      key: 39,
      name: '\u2192',
      label: 'Right'
    }
  },
  leftStick: 'WASD',
  rightStick: 'MOUSE'
};
let controllerMap = ((() => {
  try {
    const e = localStorage.getItem('CTRLLERMAP');
    return e ? JSON.parse(e) : JSON.parse(JSON.stringify(DEFAULT_CONTROLLER_MAP));
  } catch {
    return JSON.parse(JSON.stringify(DEFAULT_CONTROLLER_MAP));
  }
})());
const saveControllerMap = () => {
  try {
    localStorage.setItem('CTRLLERMAP', JSON.stringify(controllerMap));
  } catch {
  }
};
function getBase() {
  if (window.atlasServiceBase) return window.atlasServiceBase;
  let e;
  return e = window.devMode ? window.serverList?.[0] || 'cdn.vipersfutbol.com' : window.wlspServer?.includes('://') ? window.wlspServer.split('://')[1].split('/')[0] : 'cdn.vipersfutbol.com', e.includes('://') ? e.replace('/wi/', '') : `https://${ e }`;
}
async function stratusApi(e, t = 'GET', n, a = 10000) {
  const o = `${ getBase() }/stratus`, s = new AbortController(), r = a && setTimeout(() => s.abort(), a);
  try {
    const a = await fetch(`${ o }/${ e }`, {
        method: t,
        headers: n ? { 'content-type': 'application/json' } : void 0,
        body: n ? JSON.stringify(n) : void 0,
        credentials: 'include',
        signal: s.signal
      }), r = await a.json().catch(() => ({}));
    return a.ok || r.error || (r.error = `HTTP ${ a.status }`), r._http = a.status, r;
  } finally {
    clearTimeout(r);
  }
}
function _stratusPeek(e) {
  return stratusApi(e, 'GET', void 0, 4000).catch(() => ({}));
}
async function _createCloudSession(e, t) {
  const n = Array.from(crypto.getRandomValues(new Uint8Array(16)), e => e.toString(16).padStart(2, '0')).join('');
  let a = null;
  for (let o = 0; o < 3; o++) {
    o && await new Promise(e => setTimeout(e, 350 * 2 ** (o - 1) * (0.5 + Math.random() / 2)));
    try {
      a = await stratusApi('session', 'POST', {
        game_key: e,
        relay: t,
        client_key: n
      }, 20000);
    } catch {
      continue;
    }
    if (!a.retryable && a._http < 500 && (a.uuid || a.error))
      return a;
  }
  return a?.error ? a : { error: 'could not create a session, try again' };
}
function _stratusWsUrl(e, t) {
  const n = new URL(`${ getBase() }/stratus`);
  return ('https:' === n.protocol ? 'wss://' : 'ws://') + n.host + n.pathname.replace(/\/$/, '') + `/${ e }/${ t }`;
}
function setCloudPhase(e, t, n) {
  document.getElementById('cloudPhase').textContent = e, document.getElementById('cloudPhaseDetail').textContent = t || '', document.getElementById('cloudSpinner').classList.toggle('hidden', !n);
}
function _quitCloudSession(e) {
  e && fetch(`${ getBase() }/stratus/session/${ e }/quit`, {
    credentials: 'include',
    method: 'POST',
    keepalive: !0
  }).catch(() => {
  });
}
function teardownCloud(e) {
  if (e && _cloudSession && _quitCloudSession(_cloudSession.uuid), _cloudInputActive = !1, _cloudStarting = !1, _unlockCloudKeyboard(), _cloudInputHandlers) {
    const {
      mouseMoveHandler: e,
      mouseButtonHandler: t,
      contextMenuHandler: n,
      wheelHandler: a,
      videoClickHandler: o,
      keyDownHandler: s,
      keyUpHandler: r,
      video: i,
      pointerLockChangeHandler: c,
      relockHint: l,
      invalidateRect: d,
      gamepadState: u
    } = _cloudInputHandlers;
    document.removeEventListener('mousemove', e), document.removeEventListener('mousedown', t), document.removeEventListener('mouseup', t), document.removeEventListener('contextmenu', n), document.removeEventListener('wheel', a), i.removeEventListener('click', o), document.removeEventListener('keydown', s, !0), document.removeEventListener('keyup', r, !0), document.removeEventListener('pointerlockchange', c), window.removeEventListener('resize', d), l.removeEventListener('click', o), l.classList.remove('visible'), u && u.pollInterval && (clearInterval(u.pollInterval), u.pollInterval = null, u.connected.clear()), _cloudInputHandlers = null;
  }
  if (_cloudJitterHandlers) {
    const {
      video: e,
      bumpJitterTarget: t
    } = _cloudJitterHandlers;
    e.removeEventListener('waiting', t), e.removeEventListener('stalled', t), _cloudJitterHandlers = null;
  }
  _cloudTimers.forEach(e => {
    clearInterval(e), clearTimeout(e);
  }), _cloudTimers = [], _cloudRelay && (_cloudRelay(), _cloudRelay = null), _cancelCloudRetry();
  try {
    _cloudDc && _cloudDc.close();
  } catch {
  }
  try {
    _cloudPc && _cloudPc.close();
  } catch {
  }
  try {
    _cloudWs && _cloudWs.close();
  } catch {
  }
  _cloudDc = null, _cloudPc = null, _cloudWs = null, _cloudSession = null, _cloudPendingCandidates = [], document.exitPointerLock?.();
  const t = document.getElementById('cloudVideo');
  t && (t.srcObject = null), _cloudMicStreamPromise && _cloudMicStreamPromise.then(e => {
    e && e.getTracks().forEach(e => e.stop());
  }).catch(() => {
  }), _cloudMicStreamPromise = null;
}
window.getBase = getBase;
let _cloudGamesFetchPromise = null;
async function loadCloudGames() {
  const e = await _loadGamesCacheEntry('cloudGames', Array.isArray);
  return e || (_cloudGamesFetchPromise || (_cloudGamesFetchPromise = ((async () => {
    const e = await stratusApi('games');
    if (e.error)
      throw new Error(e.error);
    const t = (e.games || []).map(e => ({
      source: 'cloud',
      name: e.name,
      key: e.key,
      cover: e.cover || e.image,
      displayName: e.name,
      _norm: _normalizeGameName(e.name)
    }));
    return await _saveGamesCacheEntry('cloudGames', t), t;
  })()), _cloudGamesFetchPromise.catch(() => {
    _cloudGamesFetchPromise = null;
  })), _cloudGamesFetchPromise);
}
function toggleCloudGames() {
  _cloudEnabled = !_cloudEnabled, document.getElementById('cloudToggle').classList.toggle('on', _cloudEnabled), _gamesReload(_gamesKeyword);
}
const _POOL_DOWN_MSG = 'cloud games are temporarily unavailable, try again later';
function _poolDown(e) {
  return !!e?.pool?.health?.down;
}
async function _checkCloudPool() {
  const status = await _stratusPeek('status');
  const unavailable = !status.pool || _poolDown(status);
  const toggle = document.getElementById('cloudToggle');
  toggle.title = unavailable ? 'Cloud games are temporarily unavailable. Click to retry.' : 'Cloud games';
  toggle.setAttribute('aria-label', toggle.title);
  if (unavailable && _cloudEnabled) toggleCloudGames();
  return !unavailable;
}
async function startCloudGame(e, t, n) {
  if (_cloudStarting)
    return;
  resetGameCloseConfirm(), teardownCloud(!0), _cloudStarting = !0, _gamePlayerGen++;
  const a = document.getElementById('gamePlayer'), o = document.getElementById('gameFrame'), s = document.getElementById('cloudVideoWrap'), r = document.getElementById('cloudVideo'), i = document.getElementById('cloudOverlay'), c = document.getElementById('gamePlayerLoading');
  document.getElementById('gamePlayerId').textContent = `cloud/${ t }`, document.getElementById('gamePlayerTimeLeft').textContent = '', _exitStaleFullscreen(s), o.classList.remove('visible'), o.src = 'about:blank', c.classList.add('hidden'), s.classList.add('visible'), r.srcObject = null, r.muted = !0, i.classList.remove('hidden'), a.classList.add('open');
  try {
    if (void 0 === n && (setCloudPhase('checking', 'testing your connection', !0), n = await _cloudWantsRelay(), !_cloudStarting))
      return;
    if (n && !_hasWebCodecs()) {
      if (_webrtcBlocked())
        throw new Error('webrtc is blocked and this browser has no webcodecs for the relay');
      n = !1;
    }
    _cloudMicStreamPromise = n ? null : navigator.mediaDevices.getUserMedia({ audio: !0 }).catch(() => null);
    const a = await _stratusPeek('status');
    if (_poolDown(a))
      throw new Error(_POOL_DOWN_MSG);
    if (setCloudPhase('requesting game', `${ a.pool?.idle || 0 } idle accounts`, !0), n) {
      const n = await _stratusPeek('relay/status');
      if (!1 === n.ok)
        return _cloudSlotsBusy({ retry_after: n.retryAfter }, e, t);
    }
    const o = await _createCloudSession(e, n);
    if ('POOL_EXHAUSTED' === o.code && o.pool_down)
      throw new Error(_POOL_DOWN_MSG);
    if (o.error)
      throw o.uuid && _quitCloudSession(o.uuid), new Error(o.error);
    if (_cloudSession = {
        uuid: o.uuid,
        state: o.state,
        gameKey: e,
        gameName: t,
        relay: n,
        deadlineAt: null
      }, 'queued' === o.state) {
      for (setCloudPhase('queued', `position #${ o.queue_pos ?? '?' }`, !1); _cloudSession && _cloudSession.uuid === o.uuid && (await new Promise(e => _cloudTimers.push(setTimeout(e, 2000))), _cloudSession && _cloudSession.uuid === o.uuid);) {
        const e = await stratusApi(`session/${ _cloudSession.uuid }`);
        if (e.error)
          throw new Error(e.error);
        if ('finished_queue' === e.state)
          break;
        setCloudPhase('queued', `position #${ e.queue_pos ?? '?' }`, !1);
      }
      if (!_cloudSession || _cloudSession.uuid !== o.uuid)
        return;
    }
    setCloudPhase('starting', 'booting instance', !0);
    const s = await stratusApi(`session/${ _cloudSession.uuid }/start`, 'POST', {});
    if (s.error)
      throw new Error(s.error);
    _cloudSession.deadlineAt = Date.now() + 1000 * s.max_seconds, _cloudSession.signalingWs = s.signaling_ws, _cloudSession.iceServers = s.ice_servers, _saveIceServers(s.ice_servers), _cloudSession.relay = !!s.relay, s.relay ? await startCloudRelay() : await connectCloudSignaling(s.signaling_ws, s.ice_servers);
    const r = setInterval(() => {
      if (!_cloudSession || !_cloudSession.deadlineAt)
        return;
      const e = Math.max(0, Math.round((_cloudSession.deadlineAt - Date.now()) / 1000));
      document.getElementById('gamePlayerTimeLeft').textContent = `${ Math.floor(e / 60) }:${ String(e % 60).padStart(2, '0') }`;
    }, 500);
    _cloudTimers.push(r);
  } catch (e) {
    _cloudSession && _quitCloudSession(_cloudSession.uuid), _cloudSession = null, setCloudPhase('error', e.message, !1), _cloudStarting = !1;
  }
}
document.getElementById('cloudToggle').addEventListener('click', async () => {
  if (_cloudEnabled || await _checkCloudPool()) {
    toggleCloudGames();
    if (_cloudEnabled) _cloudWantsRelay();
  } else {
    alert(_POOL_DOWN_MSG);
  }
});
const SOCKET_RECONNECT_DELAY_MS = 2000, SOCKET_RECONNECT_MAX_TRIES = 2;
function connectCloudSignaling(e, t, n) {
  return new Promise((a, o) => {
    const s = new WebSocket(_stratusWsUrl('signal', e.split('/').pop()));
    _cloudWs = s, s.onopen = () => {
      _cloudWs === s && (n || setCloudPhase('starting', 'signal connected, waiting for instance', !0), _flushPendingCandidates());
    }, s.onerror = () => {
      _cloudWs !== s || n || o(new Error('signaling failed'));
    }, s.onclose = () => {
      _cloudWs === s && (_cloudWs = null, _cloudSession && _cloudPc ? attemptCloudReconnect() : n || o(new Error('signaling closed')));
    }, s.onmessage = async e => {
      if (_cloudWs !== s)
        return;
      let n;
      try {
        n = JSON.parse(e.data);
      } catch {
        return;
      }
      switch (n.type) {
      case 'game_ready':
        _cloudPc || (setCloudPhase('connecting', 'negotiating webrtc', !0), await createCloudPeer(t)), a();
        break;
      case 'rtc_answer':
        try {
          await _cloudPc.setRemoteDescription(new RTCSessionDescription(n.sdp));
        } catch {
        }
        break;
      case 'rtc_candidate':
        try {
          await _cloudPc.addIceCandidate(new RTCIceCandidate(n.candidate));
        } catch {
        }
        break;
      case 'ping':
        1 === s.readyState && s.send(JSON.stringify({ type: 'ping' }));
        break;
      case 'time_left':
        _cloudSession && 'number' == typeof n.time_left && (_cloudSession.deadlineAt = Date.now() + 1000 * n.time_left);
        break;
      case 'game_cap':
        showCloudEndedScreen('time is up', n.message);
        break;
      case 'game_ended':
        showCloudEndedScreen('session ended', n.message);
      }
    };
  });
}
function attemptCloudReconnect() {
  const e = _cloudSession;
  if (!e || e.reconnecting)
    return;
  e.reconnecting = !0, e.reconnectTries = 0;
  let t = !1;
  document.getElementById('cloudOverlay').classList.remove('hidden');
  const n = document.getElementById('cloudRelockHint');
  n && n.classList.remove('visible'), setCloudPhase('reconnecting', 'signal lost, retrying\u2026', !0);
  const a = () => {
    if (!_cloudSession || _cloudSession !== e || t)
      return;
    e.reconnectTries++, connectCloudSignaling(e.signalingWs, e.iceServers, !0).then(() => {
      !t && _cloudSession && _cloudSession === e && (t = !0, e.reconnecting = !1, _cloudPc && 'connected' === _cloudPc.connectionState ? document.getElementById('cloudOverlay').classList.add('hidden') : setCloudPhase('connecting', 'reconnected, restoring stream\u2026', !0));
    }).catch(() => {
    });
    const n = setTimeout(() => {
      if (!t && _cloudSession && _cloudSession === e) {
        if (e.reconnectTries >= SOCKET_RECONNECT_MAX_TRIES)
          return t = !0, void showCloudEndedScreen('session ended', 'lost connection to the game server');
        try {
          _cloudWs && _cloudWs.close();
        } catch {
        }
        _cloudWs = null, a();
      }
    }, SOCKET_RECONNECT_DELAY_MS);
    _cloudTimers.push(n);
  };
  a();
}
function showCloudEndedScreen(e, t) {
  if (!_cloudSession)
    return;
  teardownCloud(!0), _cloudEndedActive = !0;
  const n = document.getElementById('cloudVideoWrap'), a = document.getElementById('cloudOverlay');
  n.classList.add('visible'), a.classList.remove('hidden'), setCloudPhase(e, t || '', !1);
}
function cloudSigSend(e) {
  _cloudWs && 1 === _cloudWs.readyState ? _cloudWs.send(JSON.stringify(e)) : 'rtc_candidate' === e.type && _cloudPendingCandidates.push(e);
}
function _flushPendingCandidates() {
  if (!_cloudPendingCandidates.length)
    return;
  const e = _cloudPendingCandidates;
  _cloudPendingCandidates = [], e.forEach(e => cloudSigSend(e));
}
async function createCloudPeer(e) {
  const t = document.getElementById('cloudVideo');
  _cloudPc = new RTCPeerConnection({
    iceServers: e,
    bundlePolicy: 'max-bundle',
    rtcpMuxPolicy: 'require',
    iceCandidatePoolSize: 4
  }), _cloudPc.addTransceiver('audio', { direction: 'recvonly' });
  const n = _cloudPc.addTransceiver('video', { direction: 'recvonly' });
  try {
    const e = RTCRtpReceiver.getCapabilities?.('video');
    if (e?.codecs?.length && n.setCodecPreferences) {
      const t = e.codecs.filter(e => /h264/i.test(e.mimeType)), a = e.codecs.filter(e => /av1/i.test(e.mimeType)), o = e.codecs.filter(e => !/h264|av1/i.test(e.mimeType));
      let s = !1;
      try {
        if (a.length && navigator.mediaCapabilities?.decodingInfo) {
          const e = await navigator.mediaCapabilities.decodingInfo({
            type: 'webrtc',
            video: {
              contentType: 'video/AV1',
              width: 1920,
              height: 1080,
              bitrate: 4000000,
              framerate: 30
            }
          });
          s = !(!e.powerEfficient || !e.smooth);
        }
      } catch {
      }
      n.setCodecPreferences(s ? [
        ...a,
        ...t,
        ...o
      ] : [
        ...t,
        ...a,
        ...o
      ]);
    }
  } catch {
  }
  _cloudDc = _cloudPc.createDataChannel('JYSDK', {
    id: 1,
    ordered: !1,
    maxRetransmits: 0,
    priority: 'high'
  }), _cloudDc.onopen = () => {
  };
  const a = _cloudPc, o = _cloudDc;
  o.onclose = () => {
    _cloudDc === o && _cloudSession && showCloudEndedScreen('session ended', 'lost the input channel');
  }, o.onerror = () => {
    _cloudDc === o && _cloudSession && showCloudEndedScreen('session ended', 'input channel error');
  };
  let s = 0, r = null, i = null, c = null;
  const l = () => {
      for (const e of [
          r,
          i
        ])
        if (e) {
          try {
            'jitterBufferTarget' in e && (e.jitterBufferTarget = s);
          } catch {
          }
          try {
            'playoutDelayHint' in e && (e.playoutDelayHint = s / 1000);
          } catch {
          }
        }
    }, d = () => {
      c && (clearTimeout(c), c = null), s = Math.min(200, s + 40), l(), c = setTimeout(() => {
        s = Math.max(0, s - 40), l();
      }, 15000), _cloudTimers.push(c);
    };
  t.addEventListener('waiting', d), t.addEventListener('stalled', d);
  let u = null, m = null;
  const h = setInterval(async () => {
    if (!_cloudPc || _cloudPc !== a)
      return;
    let e;
    try {
      e = await a.getStats();
    } catch {
      return;
    }
    let t = null, n = null, o = null, s = null;
    e.forEach(e => {
      'candidate-pair' === e.type && 'succeeded' === e.state && 'number' == typeof e.currentRoundTripTime && (t = 1000 * e.currentRoundTripTime), 'inbound-rtp' === e.type && 'video' === e.kind && ('number' == typeof e.jitter && (n = 1000 * e.jitter), 'number' == typeof e.packetsLost && (o = e.packetsLost), 'number' == typeof e.freezeCount && (s = e.freezeCount));
    });
    const r = null !== o && null !== u ? o - u : 0;
    u = o, m = s;
    (null !== t && t > 150 || null !== n && n > 40 || r > 0) && d();
  }, 3000);
  _cloudTimers.push(h), _cloudJitterHandlers = {
    video: t,
    bumpJitterTarget: d
  }, _cloudPc.ontrack = e => {
    t.srcObject || (t.srcObject = new MediaStream()), t.srcObject.addTrack(e.track), 'video' === e.track.kind ? (r = e.receiver, l()) : 'audio' === e.track.kind && (i = e.receiver, l());
  }, _cloudPc.onicecandidate = e => {
    e.candidate && cloudSigSend({
      type: 'rtc_candidate',
      candidate: e.candidate.toJSON()
    });
  };
  let p = null;
  const g = () => {
    p && (clearTimeout(p), p = null);
  };
  const connectionDeadline = setTimeout(() => {
    if (_cloudPc !== a || a.connectionState === 'connected') return;
    if (!_cloudInputActive && _cloudWebrtcFailed()) return;
    showCloudEndedScreen('connection timed out', 'The stream could not connect. Please try again.');
  }, 25000);
  _cloudTimers.push(connectionDeadline);
  a.onconnectionstatechange = () => {
    if (_cloudPc !== a)
      return;
    const e = a.connectionState;
    if ('connected' === e)
      return clearTimeout(connectionDeadline), g(), t.muted = !1, t.play().catch(() => {
      }), void _cloudLive();
    if ('disconnected' !== e) {
      if ([
          'failed',
          'closed'
        ].includes(e)) {
        if (g(), !_cloudInputActive && _cloudWebrtcFailed())
          return;
        showCloudEndedScreen('session ended', 'lost connection to the stream');
      }
    } else
      p || (p = setTimeout(() => {
        _cloudPc === a && 'disconnected' === a.connectionState && endCloudGame();
      }, 6000), _cloudTimers.push(p));
  };
  try {
    const e = _cloudMicStreamPromise && await _cloudMicStreamPromise;
    if (e) {
      const t = e.getAudioTracks()[0];
      _cloudPc.addTrack(t);
    }
  } catch {
  }
  const _ = await _cloudPc.createOffer();
  await _cloudPc.setLocalDescription(_), cloudSigSend({
    type: 'rtc_offer',
    sdp: _.sdp
  }), _cloudTimers.push(setTimeout(() => {
    _cloudPc !== a || _cloudInputActive || _cloudWebrtcFailed();
  }, 45000));
}
function _hasWebCodecs() {
  return !(!window.VideoDecoder || !window.AudioDecoder);
}
function _webrtcBlocked() {
  try {
    return new RTCPeerConnection().close(), !1;
  } catch {
    return !0;
  }
}
function _cloudLive() {
  document.getElementById('cloudOverlay').classList.add('hidden'), _cloudInputActive = !0, _cloudStarting = !1, setupCloudInput(), document.fullscreenElement && _lockCloudKeyboard();
}
function _saveIceServers(e) {
  if (e?.length)
    try {
      localStorage.setItem('CLOUD_ICE', JSON.stringify({
        t: Date.now(),
        s: e
      }));
    } catch {
    }
}
function _knownIceServers() {
  if (window.STRATUS_ICE_SERVERS?.length)
    return window.STRATUS_ICE_SERVERS;
  try {
    const e = JSON.parse(localStorage.getItem('CLOUD_ICE'));
    if (e?.s?.length && Date.now() - e.t < 604800000)
      return e.s;
  } catch {
  }
  return null;
}
function _relayLoopback(e, t) {
  return new Promise(n => {
    let a, o, s = !1;
    const r = e => {
        if (!s) {
          s = !0, clearTimeout(i);
          try {
            a.close(), o.close();
          } catch {
          }
          n(e);
        }
      }, i = setTimeout(() => r({ ok: !1 }), t);
    try {
      const t = {
        iceServers: e,
        iceTransportPolicy: 'relay'
      };
      a = new RTCPeerConnection(t), o = new RTCPeerConnection(t);
    } catch (e) {
      return r({
        ok: !1,
        error: e
      });
    }
    a.onicecandidate = e => e.candidate && o.addIceCandidate(e.candidate).catch(() => {
    }), o.onicecandidate = e => e.candidate && a.addIceCandidate(e.candidate).catch(() => {
    }), a.oniceconnectionstatechange = () => {
      const e = a.iceConnectionState;
      'connected' === e || 'completed' === e ? r({ ok: !0 }) : 'failed' === e && r({ ok: !1 });
    }, a.createDataChannel('probe'), a.createOffer().then(e => a.setLocalDescription(e)).then(() => o.setRemoteDescription(a.localDescription)).then(() => o.createAnswer()).then(e => o.setLocalDescription(e)).then(() => a.setRemoteDescription(o.localDescription)).catch(e => r({
      ok: !1,
      error: e
    }));
  });
}
async function _relayPathWorks(e) {
  for (let t = 0; t < 2; t++) {
    t && await new Promise(e => setTimeout(e, 600));
    const n = await _relayLoopback(e, 9000);
    if (n.ok)
      return !0;
    if (n.error)
      return null;
  }
  return !1;
}
let _cloudRelayVerdict = null;
function _cloudWantsRelay() {
  if (_webrtcBlocked())
    return Promise.resolve(!0);
  const e = _knownIceServers();
  return e ? ((!_cloudRelayVerdict || Date.now() - _cloudRelayVerdict.at > 600000) && (_cloudRelayVerdict = {
    at: Date.now(),
    p: _relayPathWorks(e).then(e => !0 !== e)
  }), _cloudRelayVerdict.p) : Promise.resolve(!1);
}
function _cloudWebrtcFailed() {
  const e = _cloudSession;
  if (!e || e.relay || !_hasWebCodecs())
    return !1;
  const {
    gameKey: t,
    gameName: n
  } = e;
  _cloudRelayVerdict = {
    at: Date.now(),
    p: Promise.resolve(!0)
  }, showCloudEndedScreen('webrtc is blocked', 'this network blocks it. click to play through the relay instead');
  const a = document.getElementById('cloudOverlay');
  return a.onclick = () => {
    a.onclick = null, startCloudGame(t, n, !0);
  }, _cloudRetry = () => {
    a.onclick = null;
  }, !0;
}
function _cloudSlotsBusy(e, t, n) {
  teardownCloud(!0), document.getElementById('cloudVideoWrap').classList.add('visible');
  const a = document.getElementById('cloudOverlay');
  a.classList.remove('hidden');
  const o = Math.max(1, Math.min(1140, Math.round(e.retry_after) || 30)), s = Date.now() + 1000 * o, r = e.message || `Your WebRTC is blocked/disabled. The serverside transport slots are exhausted, please come back in about ${ o } seconds`, i = () => {
      const e = Math.ceil((s - Date.now()) / 1000);
      if (e > 0)
        return setCloudPhase(`slots busy, retry in ${ e }s`, r, !1);
      clearInterval(c), setCloudPhase('click to retry', r, !1), a.onclick = () => {
        a.onclick = null, startCloudGame(t, n, !0);
      };
    }, c = setInterval(i, 1000);
  _cloudRetry = () => {
    clearInterval(c), a.onclick = null;
  }, i();
}
function _cancelCloudRetry() {
  _cloudRetry && _cloudRetry(), _cloudRetry = null;
}
function _cloudOpen() {
  return _cloudRelay ? 1 === _cloudWs?.readyState : 'open' === _cloudDc?.readyState;
}
function _cloudSend(e) {
  try {
    if (!_cloudOpen())
      return;
    if (!_cloudRelay)
      return _cloudDc.send(e);
    const t = new Uint8Array(e.byteLength + 1);
    t[0] = 16, t.set(new Uint8Array(e), 1), _cloudWs.send(t);
  } catch {
  }
}
function startCloudRelay() {
  const {
      uuid: e,
      gameKey: t,
      gameName: n
    } = _cloudSession, a = document.getElementById('cloudVideo'), o = document.createElement('canvas');
  o.id = 'cloudCanvas', o.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:contain', a.style.display = 'none', a.after(o);
  const s = o.getContext('2d', {
      desynchronized: !0,
      alpha: !1
    }), r = 60000, i = 700000, c = [], l = [], d = {
      decoded: 0,
      drawn: 0,
      dropped: 0,
      errors: 0
    };
  let u, m, h, p, g, _ = !0, f = !1, y = !1, v = null, E = 0, S = 0, w = 0;
  const C = e => {
      1 === u?.readyState && u.send(JSON.stringify(e));
    }, b = () => C({ type: 'relay_keyframe_request' }), k = (e, a, o) => 'RELAY_SLOTS_EXHAUSTED' === e || 'RELAY_DENIED' === e ? _cloudSlotsBusy({
      message: a,
      retry_after: o
    }, t, n) : showCloudEndedScreen('TIME_UP' === e ? 'time is up' : 'session ended', a);
  function I() {
    m = new VideoDecoder({
      output: e => {
        d.decoded++, c.length >= 30 && (c.shift().close(), d.dropped++), c.push(e);
      },
      error: () => {
        d.errors++, _ = !0, I(), b();
      }
    }), m.configure(h), l.splice(0).forEach(M);
  }
  function M(e) {
    if ('configured' !== m?.state)
      return void (l.push(e) > 90 && l.shift());
    const t = 'key' === e.type;
    if (!_ || t) {
      if (m.decodeQueueSize > 30)
        return _ = !0, d.dropped++, void b();
      try {
        m.decode(e), t && (_ = !1);
      } catch {
        d.errors++, _ = !0, b();
      }
    }
  }
  function L() {
    if (!v)
      return null;
    const e = v.pts + 1000 * (performance.now() - v.at), t = g ? S - g.currentTime : 0;
    if ('running' === g?.state && t > 0.02 && t < 0.25) {
      const n = Math.max(-100000, Math.min(100000, w - 1000000 * t - e));
      E += 0.05 * (n - E);
    } else
      E *= 0.9;
    return e + E;
  }
  function A() {
    if (y)
      return;
    requestAnimationFrame(A);
    const e = L();
    if (null == e)
      return;
    const t = [];
    for (; c.length && c[0].timestamp <= e - r;)
      t.push(c.shift());
    if (!t.length)
      return;
    const n = t.pop();
    t.forEach(e => {
      e.close(), d.dropped++;
    }), e - n.timestamp > i && (d.dropped += c.length, c.splice(0).forEach(e => e.close()), b()), o.width !== n.displayWidth && (o.width = n.displayWidth, o.height = n.displayHeight), s.drawImage(n, 0, 0), n.close(), d.drawn++, f || (f = !0, _cloudLive());
  }
  async function x(e) {
    const t = e.video || {}, n = e.audio || {};
    if (!t.codec)
      return k('DECODER_UNSUPPORTED', 'the relay did not report a video codec');
    const a = {
      codec: t.codec,
      optimizeForLatency: !0
    };
    t.avcc && !t.annexb && (a.description = Uint8Array.from(atob(t.avcc), e => e.charCodeAt(0)));
    for (const e of [
        'prefer-hardware',
        'no-preference'
      ]) {
      const t = {
        ...a,
        hardwareAcceleration: e
      };
      if ((await VideoDecoder.isConfigSupported(t).catch(() => null))?.supported) {
        h = t;
        break;
      }
    }
    if (!y) {
      if (!h)
        return k('DECODER_UNSUPPORTED', 'this browser cannot decode the relay video');
      I();
      try {
        o = n.sampleRate || 48000, s = n.channels || 2, g = new (window.AudioContext || window.webkitAudioContext)({
          sampleRate: o,
          latencyHint: 'interactive'
        }), g.resume().catch(() => {
        }), p = new AudioDecoder({
          output: e => {
            try {
              let t = S - g.currentTime;
              if (t <= 0 && (S = g.currentTime + 0.02, t = 0.02), t > 0.5)
                return;
              const n = g.createBuffer(2, e.numberOfFrames, o);
              for (let t = 0; t < 2; t++)
                e.copyTo(n.getChannelData(t), {
                  planeIndex: Math.min(t, e.numberOfChannels - 1),
                  format: 'f32-planar'
                });
              const a = g.createBufferSource();
              a.buffer = n, a.connect(g.destination), a.start(S), S += n.duration, w = e.timestamp + 1000000 * n.duration;
            } finally {
              e.close();
            }
          },
          error: () => d.errors++
        }), p.configure({
          codec: 'opus',
          sampleRate: o,
          numberOfChannels: s
        });
      } catch {
      }
      var o, s;
      C({ type: 'relay_client_ready' }), A();
    }
  }
  function T() {
    const e = L();
    C({
      type: 'relay_stat',
      decoded: d.decoded,
      drawn: d.drawn,
      dropped: d.dropped,
      queue: c.length,
      buffer_ms: g ? Math.round(1000 * Math.max(0, S - g.currentTime)) : 0,
      hidden: document.hidden,
      clock_us: null == e ? null : Math.round(e),
      delay_us: r,
      decode_errors: d.errors
    });
  }
  function B() {
    'visible' !== document.visibilityState || y || (g?.resume().catch(() => {
    }), c.splice(0).forEach(e => e.close()), v = null, E = 0, _ = !0, b(), T());
  }
  return _cloudRelay = () => {
    y = !0, document.removeEventListener('visibilitychange', B), [
      m,
      p,
      g
    ].forEach(e => {
      try {
        e?.close();
      } catch {
      }
    }), c.splice(0).forEach(e => e.close()), o.remove(), a.style.display = '';
  }, _cloudTimers.push(setInterval(T, 2000)), document.addEventListener('visibilitychange', B), new Promise((t, n) => {
    u = _cloudWs = new WebSocket(_stratusWsUrl('relay', e)), u.binaryType = 'arraybuffer', u.onopen = () => {
      setCloudPhase('connecting', 'waiting for the relay stream', !0), t();
    }, u.onerror = () => {
      1 !== u.readyState && (teardownCloud(!0), n(new Error('relay socket error')));
    }, u.onclose = () => {
      _cloudWs === u && showCloudEndedScreen('session ended', 'lost the relay connection');
    }, u.onmessage = e => {
      if (_cloudWs !== u)
        return;
      if ('string' != typeof e.data)
        return function (e) {
          const t = new Uint8Array(e);
          if (t.length < 12 || 1 !== t[0] && 2 !== t[0])
            return;
          const n = Number(new DataView(e).getBigUint64(2)), a = t.subarray(12);
          if (2 !== t[0])
            v ??= {
              pts: n,
              at: performance.now()
            }, M(new EncodedVideoChunk({
              type: 1 & t[1] ? 'key' : 'delta',
              timestamp: n,
              data: a
            }));
          else
            try {
              p?.decode(new EncodedAudioChunk({
                type: 'key',
                timestamp: n,
                duration: 20000,
                data: a
              }));
            } catch {
              d.errors++;
            }
        }(e.data);
      let t;
      try {
        t = JSON.parse(e.data);
      } catch {
        return;
      }
      switch (t.type) {
      case 'relay_ready':
        x(t).catch(() => k('DECODER_UNSUPPORTED', 'could not start the relay stream'));
        break;
      case 'relay_ended':
        k(t.code || 'RELAY_ENDED', t.message, t.retry_after);
        break;
      case 'relay_denied':
        k(t.code || 'RELAY_SLOTS_EXHAUSTED', t.message, t.retry_after);
        break;
      case 'game_cap':
        k('TIME_UP', t.message);
        break;
      case 'game_ended':
        k('SESSION_ENDED', t.message);
      }
    };
  });
}
function setupCloudInput() {
  if (_cloudInputHandlers)
    return;
  const e = document.getElementById(_cloudRelay ? 'cloudCanvas' : 'cloudVideo');
  let t = 0, n = 0, a = 0, o = 0, s = 0;
  const r = new Set();
  let i = 0, c = 0;
  const l = {
    connected: new Map(),
    pollInterval: null,
    deadzone: 0.15
  };
  let d = null;
  const u = () => {
      if (!d) {
        const t = e.getBoundingClientRect(), n = e.videoWidth || e.width || 16, a = e.videoHeight || e.height || 9, o = Math.min(t.width / n, t.height / a), s = n * o, r = a * o;
        d = {
          left: t.left + (t.width - s) / 2,
          top: t.top + (t.height - r) / 2,
          width: s,
          height: r
        };
      }
      return d;
    }, m = () => {
      d = null;
    };
  window.addEventListener('resize', m);
  const h = _cloudSend, p = (e = 0, a = 0, o = 0, r = 2) => {
      if (!_cloudOpen())
        return;
      2 === r && (c = performance.now()), e = Math.max(-127, Math.min(127, e)), a = Math.max(-127, Math.min(127, a));
      const i = u(), l = Math.floor((t - i.left) / i.width * 10000), d = Math.floor((n - i.top) / i.height * 10000), m = new ArrayBuffer(12), p = new DataView(m);
      p.setUint8(0, 1), p.setUint8(1, 11), p.setUint8(2, r), p.setUint8(3, 8), p.setUint16(4, Math.max(0, Math.min(10000, l))), p.setUint16(6, Math.max(0, Math.min(10000, d))), p.setInt8(8, e), p.setInt8(9, a), p.setUint8(10, s), p.setInt8(11, o), h(m);
    }, g = (e, t, n = 1) => {
      1 === n && (i = performance.now()), t ? r.add(e) : r.delete(e);
      const a = new ArrayBuffer(24), o = new DataView(a);
      o.setUint8(0, 1), o.setUint8(2, n), o.setUint8(3, 1), o.setUint16(4, e), o.setUint8(6, t ? 1 : 0);
      let s = 7;
      for (const t of r)
        t !== e && t > 0 && t < 255 && s < 21 && (o.setUint16(s, t), s += 2, o.setUint8(s, 1), s++);
      o.setUint8(s++, 255), o.setUint8(1, s - 1), h(a.slice(0, s));
    }, _ = [
      32,
      69,
      82,
      70,
      81,
      67,
      16,
      17,
      27,
      13,
      86,
      71,
      38,
      40,
      37,
      39
    ], f = (e, t) => Math.abs(e) < t ? 0 : e, y = (e, t) => {
      if (!_cloudOpen() || !_cloudInputActive)
        return;
      const n = l.connected.get(e) || {
        buttons: [],
        axes: []
      };
      t.buttons.forEach((e, t) => {
        const a = e.pressed || e.value > 0.5;
        if (a !== (n.buttons[t] || !1)) {
          const e = controllerMap.buttons[t];
          if (null === e)
            return;
          const n = 'MOUSE_LEFT' === e ? 1 : 'MOUSE_RIGHT' === e ? 2 : 'MOUSE_MIDDLE' === e ? 4 : 0;
          n ? (a ? s |= n : s &= ~n, p(0, 0, 0)) : e && e.key ? g(e.key, a) : void 0 === e && t < _.length && g(_[t], a);
        }
      });
      const a = f(t.axes[0] || 0, l.deadzone), o = f(t.axes[1] || 0, l.deadzone), r = f(t.axes[2] || 0, l.deadzone), i = f(t.axes[3] || 0, l.deadzone), c = f(n.axes[0] || 0, l.deadzone), d = f(n.axes[1] || 0, l.deadzone);
      if ('WASD' === controllerMap.leftStick)
        Math.sign(a) !== Math.sign(c) && (c < 0 && g(65, !1), c > 0 && g(68, !1), a < 0 && g(65, !0), a > 0 && g(68, !0)), Math.sign(o) !== Math.sign(d) && (d < 0 && g(87, !1), d > 0 && g(83, !1), o < 0 && g(87, !0), o > 0 && g(83, !0));
      else if ('MOUSE' === controllerMap.leftStick && (0 !== a || 0 !== o)) {
        const e = 15, t = Math.round(a * e), n = Math.round(o * e);
        p(t, n, 0);
      }
      if ('MOUSE' === controllerMap.rightStick) {
        if (0 !== r || 0 !== i) {
          const e = 15, t = Math.round(r * e), n = Math.round(i * e);
          p(t, n, 0);
        }
      } else if ('WASD' === controllerMap.rightStick) {
        const e = f(n.axes[2] || 0, l.deadzone), t = f(n.axes[3] || 0, l.deadzone);
        Math.sign(r) !== Math.sign(e) && (e < 0 && g(65, !1), e > 0 && g(68, !1), r < 0 && g(65, !0), r > 0 && g(68, !0)), Math.sign(i) !== Math.sign(t) && (t < 0 && g(87, !1), t > 0 && g(83, !1), i < 0 && g(87, !0), i > 0 && g(83, !0));
      }
      l.connected.set(e, {
        buttons: t.buttons.map(e => e.pressed || e.value > 0.5),
        axes: [...t.axes]
      });
    };
  l.pollInterval = setInterval(() => {
    if (!_cloudInputActive)
      return;
    const e = navigator.getGamepads ? navigator.getGamepads() : [];
    let t = !1;
    for (let n = 0; n < e.length; n++) {
      const a = e[n];
      if (a && a.connected)
        t = !0, y(n, a);
      else if (l.connected.has(n)) {
        l.connected.get(n).buttons.forEach((e, t) => {
          e && t < _.length && g(_[t], !1);
        }), g(87, !1), g(65, !1), g(83, !1), g(68, !1), l.connected.delete(n);
      }
    }
    const n = document.getElementById('gamePlayerController');
    n && n.classList.toggle('hidden', !t);
  }, 16), _cloudRelay && (_cloudTimers.push(setInterval(() => {
    if (!_cloudInputActive)
      return;
    const e = performance.now();
    e - c < 48 && p(0, 0, 0, 7), e - i < 48 && g([...r][0] || 0, r.size > 0, 6);
  }, 16)), _cloudTimers.push(setInterval(() => {
    c && p(0, 0, 0, 7);
  }, 20000)));
  const v = s => {
      if (!_cloudInputActive)
        return;
      const r = s.movementX || 0, i = s.movementY || 0;
      if (document.pointerLockElement === e) {
        const e = u();
        a = Math.max(0, Math.min(e.width, a + r)), o = Math.max(0, Math.min(e.height, o + i)), t = e.left + a, n = e.top + o;
      } else
        t = s.clientX, n = s.clientY;
      p(r, i, 0);
    }, E = e => {
      _cloudInputActive && (s = e.buttons, p(0, 0, 0));
    }, S = e => {
      _cloudInputActive && e.preventDefault();
    }, w = e => {
      _cloudInputActive && (e.preventDefault(), p(0, 0, e.deltaY > 0 ? -1 : 1));
    }, C = document.getElementById('cloudRelockHint'), b = () => {
      C.classList.remove('visible'), ((() => {
        if (!_cloudDc && !_cloudRelay)
          return;
        if (document.pointerLockElement === e)
          return;
        m();
        const s = u();
        a = s.width / 2, o = s.height / 2, t = s.left + a, n = s.top + o, e.requestPointerLock?.();
      })());
    };
  let k = !1;
  const I = () => {
    if (_cloudInputActive)
      if (document.pointerLockElement === e)
        k = !0, C.classList.remove('visible');
      else if (k) {
        const e = !document.getElementById('cloudOverlay').classList.contains('hidden');
        C.classList.toggle('visible', !e);
      }
  };
  document.addEventListener('pointerlockchange', I), C.addEventListener('click', b);
  const M = e => t => {
      _cloudInputActive && (t.preventDefault(), t.stopPropagation(), e && t.repeat || g(t.keyCode, e));
    }, L = M(!0), A = M(!1);
  document.addEventListener('mousemove', v), document.addEventListener('mousedown', E), document.addEventListener('mouseup', E), document.addEventListener('contextmenu', S), document.addEventListener('wheel', w, { passive: !1 }), e.addEventListener('click', b), document.addEventListener('keydown', L, { capture: !0 }), document.addEventListener('keyup', A, { capture: !0 }), _cloudInputHandlers = {
    mouseMoveHandler: v,
    mouseButtonHandler: E,
    contextMenuHandler: S,
    wheelHandler: w,
    videoClickHandler: b,
    keyDownHandler: L,
    keyUpHandler: A,
    video: e,
    invalidateRect: m,
    pointerLockChangeHandler: I,
    relockHint: C,
    gamepadState: l
  };
}
function endCloudGame() {
  if (!_cloudSession)
    return;
  teardownCloud(!0), _cloudEndedActive = !1;
  const e = document.getElementById('cloudVideoWrap'), t = document.getElementById('gamePlayerLoading');
  e.classList.remove('visible'), t.classList.remove('hidden'), t.textContent = 'loading\u2026', document.getElementById('gamePlayerTimeLeft').textContent = '', setCloudPhase('idle', '', !1);
}
const originalHandleGamePlayerClose = handleGamePlayerClose;
handleGamePlayerClose = function () {
  if (_cloudEndedActive)
    return _cloudEndedActive = !1, void closeGamePlayer();
  _cloudSession ? _armOrConfirmClose(() => {
    endCloudGame(), closeGamePlayer();
  }) : originalHandleGamePlayerClose();
}, window.addEventListener('beforeunload', () => {
  _cloudSession && _quitCloudSession(_cloudSession.uuid);
}), document.addEventListener('visibilitychange', () => {
  _cloudSession && document.hidden && _cloudWs && 1 === _cloudWs.readyState && _cloudWs.send(JSON.stringify({ type: 'ping' }));
});
const originalGameCardOnClick = _gameCardOnClick;
_gameCardOnClick = function (e) {
  return 'cloud' === e.source ? () => startCloudGame(e.key, e.name) : originalGameCardOnClick(e);
}, ((() => {
  const e = document.getElementById('pingDisplay');
  e && (window.devMode ? e.textContent = 'ping: DEVELOPER' : window.WlspIsBackup ? e.textContent = 'ping: BACKUP' : e.textContent = 'number' == typeof window.WlspPing ? `ping: ${ window.WlspPing }ms` : 'ping: --');
  const t = document.getElementById('baseDisplay');
  if (t)
    try {
      t.textContent = `base: ${ new URL(window.assetsBase).hostname }`;
    } catch {
      window.devMode ? t.textContent = 'base: DEVELOPER' : t.textContent = 'base: --';
    }
})());
const AI_WS_PATH = '/ai';
let _aiWs = null, _aiWsReady = !1, _aiModelsGrouped = {}, _aiSelectedModel = null, _aiWebSearchEnabled = !1, _aiChats = [], _aiCurrentChatId = null, _aiStreaming = !1, _aiHandlersBound = !1, _aiReadOnly = !1;
const AI_CHAT_TTL_MS = 126000000;
let _streamShell = null, _streamPlaceholder = null, _streamContent = '', _streamReasoning = '', _streamUsage = null, _streamStartedAt = 0, _streamFirstTokenAt = 0, _streamTitle = '', _streamMedia = null, _streamAsstId = null, _pendingUserMsg = null, _aiAttachedFile = null, _aiAttachedPreviewUrl = null, _pendingMediaResolve = null, _pendingDeleteChatId = null;
const SOLVE_QUESTION_PROMPT = 'Answer any questions on this page correctly; think step by step internally, give plain answers unless special input like graphing/formatting is needed (then briefly explain how to input it), and label multiple questions by number/letter (e.g., 1:, 2A:, 2B:).';
let _screenshareStream = null, _screenshareVideo = null, _screenshareChatId = null, _screenshareWin = null, _screenshareStreaming = !1, _screenshareContent = '', _screenshareReasoning = '', _screenshareAsstId = null, _screenshareUi = null, _pendingScreenshareUserMsg = null, _pendingScreenshareMediaResolve = null;
const AI_IMAGE_MIME_RE = /^image\/(png|jpeg|jpg|webp|gif)$/, AI_IMAGE_MAX_BYTES = 11534336, AI_MEDIA_CHUNK_CHARS = 800000;
let _idCounter = 0;
function _newId() {
  return 'm' + ++_idCounter + '_' + Math.random().toString(36).slice(2, 10);
}
async function _loadAllChats() {
  try {
    const e = await _oDB(), t = await new Promise((t, n) => {
        const a = e.transaction('chats', 'readonly').objectStore('chats').getAll();
        a.onsuccess = () => t(a.result || []), a.onerror = () => n(a.error);
      });
    return t.forEach(e => {
      e.messages.forEach(e => {
        if (e.media && e.media.blob)
          try {
            e.media.url = URL.createObjectURL(e.media.blob);
          } catch (e) {
          }
      });
    }), t.sort((e, t) => (t.updatedAt || 0) - (e.updatedAt || 0)), t;
  } catch (e) {
    return console.error('[O] chats load failed:', e), [];
  }
}
function _persistChat(e, t = !0) {
  e && (t && (e.updatedAt = Date.now()), _oDB().then(t => {
    t.transaction('chats', 'readwrite').objectStore('chats').put(e);
  }).catch(t => {
    console.error('[O] chat save failed:', e.id, t);
  }));
}
let _aiChatsLoadPromise = null;
let _aiRetryCount = 0;
let _aiRetryTimer = null;
function _ensureAIChatsLoaded() {
  return _aiChatsLoadPromise || (_aiChatsLoadPromise = _loadAllChats().then(e => {
    _aiChats = e, _renderRecents();
  }), _aiChatsLoadPromise);
}
function _aiWsUrl() {
  try {
    const e = new URL(getBase());
    return e.protocol = 'http:' === e.protocol ? 'ws:' : 'wss:', e.pathname = AI_WS_PATH, e.search = '', e.hash = '', e.toString();
  } catch (e) {
    return 'wss://cdn.vipersfutbol.com' + AI_WS_PATH;
  }
}
function openAI() {
  _activateAtlasScreen('aiScreen');
  _aiRetryCount = 0;
  const e = document.getElementById('aiScreen'), t = !!e && e.classList.contains('open');
  e && e.classList.add('open'), e && !t && _genie(e, 'navAI', !0), _ensureAIWs(), _ensureAIChatsLoaded(), setTimeout(() => _initAIInputHandlers(), 50);
}
function closeAI() {
  clearTimeout(_aiRetryTimer);
  const e = document.getElementById('aiScreen'), t = !!e && e.classList.contains('open');
  e && e.classList.remove('open'), t && _genie(e, 'navAI', !1);
}
function _ensureAIWs() {
  (!_aiWs || _aiWs.readyState !== WebSocket.CONNECTING && _aiWs.readyState !== WebSocket.OPEN) && _connectAI();
}
function _connectAI() {
  clearTimeout(_aiRetryTimer);
  const previous = _aiWs;
  _aiWs = null;
  try { previous?.close(); } catch {}
  _aiWsReady = false;
  _setAIStatus('connecting\u2026');
  let socket;
  try { socket = new WebSocket(_aiWsUrl()); }
  catch { _setAIStatus('AI is temporarily unavailable. Close and reopen AI to retry.'); return; }
  _aiWs = socket;
  const timeout = setTimeout(() => socket.close(), 10000);
  socket.onopen = () => {
    clearTimeout(timeout);
    if (_aiWs !== socket) return;
    _aiWsReady = true;
    _aiRetryCount = 0;
    _setAIStatus('');
  };
  socket.onmessage = event => { if (_aiWs === socket) _handleAIMessage(event.data); };
  socket.onclose = () => {
    clearTimeout(timeout);
    if (_aiWs !== socket) return;
    _aiWsReady = false;
    _aiWs = null;
    if (_aiStreaming) _onStreamError('connection lost');
    if (++_aiRetryCount <= 3 && document.getElementById('aiScreen').classList.contains('open')) {
      _setAIStatus('disconnected - reconnecting\u2026');
      _aiRetryTimer = setTimeout(_ensureAIWs, 2000 * _aiRetryCount);
    } else {
      _setAIStatus('AI is temporarily unavailable. Close and reopen AI to retry.');
    }
  };
  socket.onerror = () => _setAIStatus('connection error');
}
function _handleAIMessage(e) {
  let t;
  try {
    t = JSON.parse(e);
  } catch (e) {
    return;
  }
  if (!_screenshareStreaming || _screenshareChatId && t.conversationId !== _screenshareChatId || ![
      'message',
      'thinking',
      'content',
      'processing',
      'usage',
      'image',
      'video',
      'done',
      'error'
    ].includes(t.type))
    switch (t.type) {
    case 'toast':
      _toast(t.text || 'connected');
      break;
    case 'models':
      _aiModelsGrouped = t.models || {}, _renderModelSelect(_aiModelsGrouped);
      break;
    case 'newChat':
      _aiCurrentChatId = t.conversationId, _clearAIMessages(), _showAIWelcome(!0);
      break;
    case 'message':
      _onStreamStart(t);
      break;
    case 'thinking':
      _onStreamThinking(t.delta);
      break;
    case 'content':
      _onStreamContent(t.delta);
      break;
    case 'processing':
      _onStreamProcessing(t.text || '');
      break;
    case 'status':
      _setAIStatus(t.text || '');
      break;
    case 'usage':
      _streamUsage = t;
      break;
    case 'image':
      _onStreamMedia('image', t.url);
      break;
    case 'video':
      _onStreamMedia('video', t.url);
      break;
    case 'requestMediaId':
      _pendingScreenshareMediaResolve ? (_pendingScreenshareMediaResolve(t.mediaId), _pendingScreenshareMediaResolve = null) : _pendingMediaResolve && (_pendingMediaResolve(t.mediaId), _pendingMediaResolve = null);
      break;
    case 'done':
      _onStreamDone();
      break;
    case 'deleted':
      _onConversationDeleted(t.conversationId);
      break;
    case 'cancelled':
      _onStreamError(t.text || 'cancelled');
      break;
    case 'error':
      if (_pendingMediaResolve && (_pendingMediaResolve = null), 'not_found' === t.code && _pendingDeleteChatId) {
        const e = _pendingDeleteChatId;
        _pendingDeleteChatId = null, _onConversationDeleted(e);
        break;
      }
      if ('not_found' === t.code && _aiStreaming && _aiCurrentChatId) {
        const e = _aiCurrentChatId;
        _onStreamError('This chat expired, start a new chat to continue'), _markChatExpired(e);
        break;
      }
      _onStreamError(t.text || 'error');
      break;
    case 'ping':
      _aiWs && 1 === _aiWs.readyState && _aiWs.send(JSON.stringify({ type: 'pong' }));
    }
  else
    _handleScreenshareMessage(t);
}
function _setAIStatus(e) {
  const t = document.getElementById('aiStatus');
  t && (t.textContent = e, t.classList.toggle('show', !!e));
}
function _toast(e) {
  _setAIStatus(e), setTimeout(() => {
    const e = document.getElementById('aiStatus');
    e && (e.textContent = '');
  }, 2500);
}
function _showAIWelcome(e) {
  const t = document.getElementById('aiWelcome');
  t && t.classList.toggle('hidden', !e);
}
function _clearAIMessages() {
  const e = document.getElementById('aiMessages');
  e && (e.innerHTML = '');
}
function _closeModelPopup() {
  const e = document.getElementById('aiModelWrap');
  e && e.classList.remove('open');
}
function _selectModel(e) {
  _aiSelectedModel = e || null;
  const t = document.getElementById('aiModelLabel');
  t && (t.textContent = e || '');
  const n = document.getElementById('aiModelPopup');
  if (n && n.querySelectorAll('.ai-model-item').forEach(t => {
      t.classList.toggle('selected', t.dataset.modelId === e);
    }), _aiCurrentChatId) {
    const e = _getChat(_aiCurrentChatId);
    e.model = _aiSelectedModel, _persistChat(e, !1);
  }
}
function _renderModelSelect(e) {
  const t = document.getElementById('aiModelPopup');
  if (!t)
    return;
  t.innerHTML = '';
  const n = [
      'gpt',
      'gemma',
      'llama',
      'grok',
      'deepseek',
      'qwen',
      'kimi',
      'image',
      'video'
    ], a = e => {
      const t = n.indexOf(e);
      return -1 === t ? 99 : t;
    }, o = Object.keys(e).sort((e, t) => a(e) - a(t));
  let s = null;
  o.forEach(n => {
    const a = document.createElement('div');
    a.className = 'ai-model-group-label', a.textContent = n.toUpperCase(), t.appendChild(a), e[n].forEach(e => {
      const a = document.createElement('div');
      a.className = 'ai-model-item', a.textContent = e, a.dataset.modelId = e, a.onclick = () => {
        _selectModel(e), _closeModelPopup();
      };
      a.setAttribute('role', 'button'); a.tabIndex = 0;
      a.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); a.click(); }
        if (event.key === 'Escape') _closeModelPopup();
      });
      t.appendChild(a), s || 'image' === n || 'video' === n || (s = e);
    });
  });
  const r = _aiCurrentChatId ? _aiChats.find(e => e.id === _aiCurrentChatId) : null;
  r && r.model && (_aiSelectedModel = r.model), _aiSelectedModel || (_aiSelectedModel = s), _selectModel(_aiSelectedModel);
}
function _initModelDropdown() {
  const e = document.getElementById('aiModelWrap'), t = document.getElementById('aiModelTrigger');
  e && t && (t.onclick = t => {
    t.stopPropagation(), e.classList.toggle('open');
  }, document.addEventListener('click', t => {
    e.contains(t.target) || _closeModelPopup();
  }));
}
function _initAIInputHandlers() {
  if (_aiHandlersBound)
    return;
  _aiHandlersBound = !0, _initModelDropdown();
  const e = document.getElementById('aiInput'), t = document.getElementById('aiSendBtn'), n = () => {
      const n = e && e.value.trim().length > 0;
      t && t.classList.toggle('hidden', !(n || _aiAttachedFile));
    };
  e && (e.addEventListener('input', () => {
    n(), e.style.height = 'auto';
    const t = Math.min(e.scrollHeight, 110);
    e.style.height = t + 'px', e.style.overflowY = t >= 110 ? 'auto' : 'hidden';
  }), e.addEventListener('keydown', t => {
    'Enter' !== t.key || t.shiftKey || (t.preventDefault(), (e.value.trim() || _aiAttachedFile) && _sendMessage());
  })), t && (t.onclick = _sendMessage);
  const a = document.getElementById('aiNewChatBtn');
  a && (a.onclick = _newChat);
  const o = document.getElementById('aiExpiredNewChat');
  o && (o.onclick = _newChat);
  const s = document.getElementById('aiImageBtn'), r = document.getElementById('aiImageInput');
  s && r && (s.onclick = () => r.click(), r.addEventListener('change', () => {
    const e = r.files && r.files[0];
    r.value = '', e && (_setAttachedFile(e), n());
  }));
  const i = document.getElementById('aiAttachRemove');
  i && (i.onclick = () => {
    _setAttachedFile(null), n();
  });
  const c = document.getElementById('aiWebSearchBtn');
  c && (c.onclick = () => {
    _aiWebSearchEnabled = !_aiWebSearchEnabled, c.classList.toggle('active', _aiWebSearchEnabled);
  }), e && e.addEventListener('paste', e => {
    const t = e.clipboardData && e.clipboardData.items;
    if (t)
      for (const a of t)
        if ('file' === a.kind && AI_IMAGE_MIME_RE.test(a.type)) {
          const t = a.getAsFile();
          t && (e.preventDefault(), _setAttachedFile(t), n());
          break;
        }
  });
  const l = document.getElementById('aiScreenshareBtn');
  l && (l.onclick = _startScreenshare);
}
function _setAttachedFile(e) {
  _aiAttachedPreviewUrl && (URL.revokeObjectURL(_aiAttachedPreviewUrl), _aiAttachedPreviewUrl = null), _aiAttachedFile = null;
  const t = document.getElementById('aiAttachPreview'), n = document.getElementById('aiAttachThumb'), a = document.getElementById('aiAttachName');
  e ? AI_IMAGE_MIME_RE.test(e.type) ? e.size > AI_IMAGE_MAX_BYTES ? _toast('image too large (max 11MB)') : (_aiAttachedFile = e, _aiAttachedPreviewUrl = URL.createObjectURL(e), n && (n.src = _aiAttachedPreviewUrl), a && (a.textContent = e.name), t && t.classList.add('show')) : _toast('unsupported image type') : t && t.classList.remove('show');
}
function _newChat() {
  if (_aiStreaming)
    return;
  _aiCurrentChatId = null, _aiReadOnly = !1, _applyAIReadOnlyState(), _clearAIMessages(), _showAIWelcome(!0);
  _renderRecents(); _setAttachedFile(null);
  const e = document.getElementById('aiInput');
  e && (e.value = '', e.style.height = 'auto');
  const t = document.getElementById('aiSendBtn');
  t && t.classList.add('hidden'), _aiWsReady && _aiWs && _aiWs.send(JSON.stringify({ type: 'newChat' }));
}
// The upstream protocol exposes message content, not a documented system role.
// Keep application context on the wire; local transcripts retain the user's text.
function _atlasAiPrompt(text) {
  return 'Application context: You are Atlas AI, the assistant inside Atlas on Synergy. ' +
    'Use Atlas AI as your product name when introducing yourself. This identifies the application, not the underlying model or service provider.\n\nUser request:\n' + text;
}
const ATLAS_AI_RESTRICTION = "Sorry, I can't help with that. [restriction = chemistry]";
function _atlasBlockedPrompt(text) {
  const lookalikes = {'0':'o','1':'i','о':'o','ο':'o','р':'p','ρ':'p','і':'i','ι':'i','υ':'u','м':'m'};
  const normalized = String(text || '').normalize('NFKD').toLowerCase()
    .replace(/[\p{M}\p{Cf}]/gu, '')
    .replace(/[01оοрρіιυм]/gu, character => lookalikes[character]);
  // Separators may be spaces, punctuation or symbols, but not other letters.
  return /(?:^|[^\p{L}\p{N}_])o[\p{P}\p{Z}\p{S}\s_]*p[\p{P}\p{Z}\p{S}\s_]*i[\p{P}\p{Z}\p{S}\s_]*u[\p{P}\p{Z}\p{S}\s_]*m(?:s)?(?=$|[^\p{L}\p{N}_])/u.test(normalized);
}
// Responses remain verbatim. Product identity is supplied by prompt context.
function _atlasResponseText(text) { return String(text || ''); }
function _atlasRejectPrompt(text) {
  _showAIWelcome(false);
  const user = _renderUserMessage(_newId(), text);
  user.querySelector('.ai-message-actions')?.remove();
  const placeholder = _showThinkingIndicator();
  _aiStreaming = true;
  document.getElementById('aiInput').value = '';
  _setAttachedFile(null);
  const send = document.getElementById('aiSendBtn');
  if (send) { send.disabled = true; send.classList.add('hidden'); }
  setTimeout(() => {
    placeholder.remove();
    const shell = _createAssistantShell();
    shell.waitDiv.classList.add('hidden');
    shell.messageDiv.insertBefore(shell.textDiv, shell.actionsDiv);
    // Plain text preserves the literal bracketed restriction message.
    shell.textDiv.textContent = ATLAS_AI_RESTRICTION;
    document.getElementById('aiMessages').appendChild(shell.messageDiv);
    _aiStreaming = false;
    if (send) send.disabled = false;
    _scrollChatToBottom();
  }, 2000);
}
function _sendMessage() {
  const e = document.getElementById('aiInput'), t = (e.value || '').trim(), n = _aiAttachedFile;
  if (!t && !n || _aiStreaming || _screenshareStreaming || _aiReadOnly)
    return;
  if (_atlasBlockedPrompt(t)) return _atlasRejectPrompt(t);
  if (!_aiSelectedModel) return;
  if (!_aiWsReady || !_aiWs)
    return _setAIStatus('not connected'), void _ensureAIWs();
  _showAIWelcome(!1);
  const a = _newId(), o = n ? _aiAttachedPreviewUrl : null;
  _pendingUserMsg = {
    id: a,
    content: t,
    media: n ? {
      url: o,
      blob: n
    } : void 0
  }, _renderUserMessage(a, t, o), _streamPlaceholder = _showThinkingIndicator(), e.value = '', e.style.height = 'auto';
  const s = document.getElementById('aiSendBtn');
  if (s && (s.classList.add('hidden'), s.disabled = !0), _aiStreaming = !0, _streamMedia = null, n) {
    _aiAttachedFile = null, _aiAttachedPreviewUrl = null;
    const e = document.getElementById('aiAttachPreview');
    e && e.classList.remove('show'), _sendMediaMessage(n, t).catch(e => _onStreamError(e.message || 'upload failed'));
  } else
    _aiWs.send(JSON.stringify({
      type: 'sendMessage',
      conversationId: _aiCurrentChatId,
      content: _atlasAiPrompt(t),
      model: _aiSelectedModel,
      webSearch: _aiWebSearchEnabled
    }));
}
function _fileToBase64(e) {
  return new Promise((t, n) => {
    const a = new FileReader();
    a.onload = () => t(String(a.result).split(',')[1] || ''), a.onerror = () => n(new Error('could not read file')), a.readAsDataURL(e);
  });
}
async function _sendMediaMessage(e, t) {
  const n = await _fileToBase64(e), a = await new Promise((t, n) => {
      _pendingMediaResolve = t, _aiWs.send(JSON.stringify({
        type: 'mediaStart',
        model: _aiSelectedModel,
        mime: e.type,
        conversationId: _aiCurrentChatId || void 0
      })), setTimeout(() => {
        _pendingMediaResolve === t && (_pendingMediaResolve = null, n(new Error('upload timed out')));
      }, 15000);
    });
  for (let e = 0; e < n.length; e += AI_MEDIA_CHUNK_CHARS)
    _aiWs.send(JSON.stringify({
      type: 'mediaChunk',
      mediaId: a,
      chunk: n.slice(e, e + AI_MEDIA_CHUNK_CHARS)
    }));
  _aiWs.send(JSON.stringify({
    type: 'mediaDone',
    mediaId: a,
    prompt: _atlasAiPrompt(t),
    webSearch: _aiWebSearchEnabled
  }));
}
function _makeStreamRenderer(e) {
  let t = 0, n = 0;
  const a = () => {
    clearTimeout(t), t = 0;
    const a = performance.now();
    e(), n = performance.now() - a;
  };
  return {
    schedule() {
      t || (t = setTimeout(a, Math.max(40, 3 * n)));
    },
    flush: a,
    cancel() {
      clearTimeout(t), t = 0, n = 0;
    }
  };
}
const _streamRenderer = _makeStreamRenderer(() => {
  const e = _streamShell;
  e && (_streamContent && _renderMarkdown(e.textDiv, _streamContent), _scrollChatToBottom());
});
function _onStreamStart(e) {
  _streamRenderer.cancel(), _aiCurrentChatId = e.conversationId, _streamContent = '', _streamReasoning = '', _streamUsage = null, _streamMedia = null, _streamStartedAt = performance.now(), _streamFirstTokenAt = 0, _streamTitle = e.title || '', _streamAsstId = _newId();
  if (/^Application context:/i.test(_streamTitle)) _streamTitle = (_pendingUserMsg?.content || 'Image conversation').slice(0, 80);
  const t = _getChat(_aiCurrentChatId);
  if (t.lastMessageAt = Date.now(), t.title || (t.title = _streamTitle), e.model && (t.model = e.model), _pendingUserMsg) {
    const n = e.messageId || _pendingUserMsg.id;
    if (t.messages.push({
        id: n,
        role: 'user',
        content: _pendingUserMsg.content,
        media: _pendingUserMsg.media
      }), n !== _pendingUserMsg.id) {
      const e = document.querySelector(`[data-msg-id="${ _pendingUserMsg.id }"]`);
      e && (e.dataset.msgId = n);
    }
    _pendingUserMsg = null, _persistChat(t);
  }
  _streamPlaceholder && (_streamPlaceholder.remove(), _streamPlaceholder = null), _streamShell = _createAssistantShell(), _aiWebSearchEnabled && (_streamShell.statusDiv.classList.remove('hidden'), _streamShell.statusDiv.textContent = 'Searching the web\u2026');
  const n = document.getElementById('aiMessages');
  n && n.appendChild(_streamShell.messageDiv), _scrollChatToBottom();
}
function _onStreamThinking(e) {
  if (_streamShell && !_streamFirstTokenAt) _streamFirstTokenAt = performance.now();
}
function _onStreamContent(e) {
  if (!_streamShell)
    return;
  const t = !_streamContent;
  t && (_streamFirstTokenAt || (_streamFirstTokenAt = performance.now()), _streamShell.waitDiv.classList.add('hidden'), _streamShell.statusDiv.classList.add('hidden'), _streamShell.reasoningDetails.open = !1, _streamShell.reasoningLabel.textContent = 'Reasoning', _mountTextDiv(_streamShell)), _streamContent += e, t ? _streamRenderer.flush() : _streamRenderer.schedule();
}
function _onStreamProcessing(e) {
  _streamShell && (_streamShell.waitDiv.classList.add('hidden'), _streamShell.statusDiv.classList.remove('hidden'), _streamShell.statusDiv.textContent = e, _scrollChatToBottom());
}
function _onStreamMedia(e, t) {
  _streamMedia = {
    kind: e,
    url: t
  }, _streamShell && (_streamShell.waitDiv.classList.add('hidden'), _streamShell.statusDiv.classList.add('hidden'), _mountTextDiv(_streamShell), _appendMedia(_streamShell.textDiv, e, t)), _scrollChatToBottom();
}
function _onStreamDone() {
  _streamContent = _atlasResponseText(_streamContent); _streamReasoning = _atlasResponseText(_streamReasoning);
  _aiStreaming = false;
  _streamRenderer.flush();
  const e = _streamShell, t = _streamContent, n = _streamReasoning, a = _streamMedia, o = _streamAsstId;
  e && (e.waitDiv.classList.add('hidden'), e.statusDiv.classList.add('hidden'), e.statsDiv.textContent = _formatStats({
    startedAt: _streamStartedAt,
    firstTokenAt: _streamFirstTokenAt,
    usage: _streamUsage
  }), _addCopyAction(e.actionsDiv, () => a ? a.url : t), _addRetryAction(e.actionsDiv, () => _retryMessage(o)));
  const s = _getChat(_aiCurrentChatId);
  if (s) {
    const e = s.messages.findIndex(e => e.id === o), r = {
        id: o,
        role: 'assistant',
        content: t,
        reasoning: n || void 0,
        media: a || void 0
      };
    -1 !== e ? s.messages[e] = r : s.messages.push(r), s.lastMessageAt = Date.now(), _persistChat(s);
  }
  _renderRecents(), _streamShell = null, _aiStreaming = !1;
  const r = document.getElementById('aiSendBtn');
  r && (r.disabled = !1);
}
function _onStreamError(e) {
  if (_streamRenderer.cancel(), _streamPlaceholder && (_streamPlaceholder.remove(), _streamPlaceholder = null), _streamShell && (_streamShell.messageDiv.remove(), _streamShell = null), _pendingUserMsg) {
    const e = document.querySelector(`[data-msg-id="${ _pendingUserMsg.id }"]`);
    e && e.remove(), _pendingUserMsg = null;
  }
  _pendingMediaResolve = null, _showError(e), _aiStreaming = !1;
  const t = document.getElementById('aiSendBtn');
  t && (t.disabled = !1);
}
function _escapeHtml(e) {
  return e.replace(/[&<>"']/g, e => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#39;'
  }[e]));
}
function _formatMessage(text) {
  text = _atlasResponseText(text);
  return window.AtlasMarkdown?.render ? window.AtlasMarkdown.render(text) : _escapeHtml(text).replace(/\n/g, '<br>');
}
function _renderMarkdown(e, t) {
  e.innerHTML = _formatMessage(t), e.querySelectorAll('a').forEach(e => {
    e.target = '_blank', e.rel = 'noreferrer';
  });
}
function _scrollChatToBottom() {
  const e = document.getElementById('aiChatContainer');
  e && (e.scrollTop = e.scrollHeight);
}
function _showError(e) {
  const t = document.getElementById('aiChatContainer');
  if (!t)
    return;
  const n = t.querySelector('.ai-error-box') || document.createElement('div');
  clearTimeout(n._dismissTimer);
  n.className = 'ai-error-box'; n.setAttribute('role', 'alert'); n.textContent = e;
  if (!n.parentNode) t.appendChild(n);
  n._dismissTimer = setTimeout(() => n.remove(), 5000);
}
function _addCopyAction(e, t) {
  const n = document.createElement('button');
  n.className = 'ai-message-action-btn', n.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>', n.title = 'Copy', n.onclick = () => {
    navigator.clipboard.writeText(t()), n.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>', setTimeout(() => {
      n.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
    }, 1500);
  }, e.appendChild(n);
}
function _addRetryAction(e, t) {
  const n = document.createElement('button');
  n.className = 'ai-message-action-btn', n.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>', n.title = 'Retry', n.onclick = t, e.appendChild(n);
}
function _addEditAction(e, t) {
  const n = document.createElement('button');
  n.className = 'ai-message-action-btn', n.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>', n.title = 'Edit', n.onclick = t, e.appendChild(n);
}
function _renderUserMessage(e, t, n) {
  const a = document.getElementById('aiMessages'), o = document.createElement('div');
  if (o.className = 'ai-message user', o.dataset.msgId = e, n) {
    const e = document.createElement('img');
    e.className = 'ai-message-user-media', e.src = n, e.alt = '', o.appendChild(e);
  }
  if (t) {
    const e = document.createElement('div');
    e.className = 'ai-message-text', e.textContent = t, o.appendChild(e);
  }
  const s = document.createElement('div');
  return s.className = 'ai-message-actions', _addCopyAction(s, () => t), _aiReadOnly || _addEditAction(s, () => _editMessage(o, t)), o.appendChild(s), a.appendChild(o), _scrollChatToBottom(), o;
}
function _createAssistantShell() {
  const e = document.createElement('div');
  e.className = 'ai-message assistant';
  const t = document.createElement('details');
  t.className = 'ai-reasoning hidden';
  const n = document.createElement('summary');
  n.className = 'ai-reasoning-summary', n.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0-6 6c0 1.887.833 3.32 2.09 4.264.55.417.91 1.05.91 1.736v.5a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-.5c0-.686.36-1.319.91-1.736A6.001 6.001 0 0 0 18 9a6 6 0 0 0-6-6z"/><path d="M9.663 17h4.673"/></svg><span class="ai-reasoning-label">Reasoning</span><svg class="ai-reasoning-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>';
  const a = n.querySelector('.ai-reasoning-label'), o = document.createElement('div');
  o.className = 'ai-reasoning-body', t.appendChild(n), t.appendChild(o);
  const s = document.createElement('div');
  s.className = 'ai-message-text';
  const r = document.createElement('div');
  r.className = 'ai-message-actions';
  const i = document.createElement('div');
  i.className = 'ai-message-stats';
  const c = document.createElement('div');
  c.className = 'ai-thinking-dots', c.innerHTML = '<span class="ai-typing-dot"></span><span class="ai-typing-dot"></span><span class="ai-typing-dot"></span>';
  const l = document.createElement('div');
  return l.className = 'ai-message-status hidden', e.appendChild(t), e.appendChild(c), e.appendChild(l), e.appendChild(r), e.appendChild(i), {
    messageDiv: e,
    reasoningDetails: t,
    reasoningBody: o,
    reasoningLabel: a,
    textDiv: s,
    actionsDiv: r,
    statsDiv: i,
    waitDiv: c,
    statusDiv: l
  };
}
function _mountTextDiv(e) {
  e.textDiv.isConnected || e.messageDiv.insertBefore(e.textDiv, e.actionsDiv);
}
function _appendMedia(e, t, n) {
  const a = document.createElement('div');
  a.className = 'ai-message-media';
  const o = sjEncode(n);
  if ('image' === t) {
    const e = document.createElement('img');
    e.src = o, e.alt = '', e.onclick = () => window.open(o, '_blank'), a.appendChild(e);
  } else {
    const e = document.createElement('video');
    e.src = o, e.controls = !0, e.playsInline = !0, a.appendChild(e);
  }
  e.appendChild(a);
}
function _renderAssistantMessage(e) {
  e = {...e, content: _atlasResponseText(e.content), reasoning: ''};
  const t = document.getElementById('aiMessages'), n = _createAssistantShell();
  return n.messageDiv.dataset.msgId = e.id, e.reasoning && (n.reasoningDetails.classList.remove('hidden'), n.reasoningBody.textContent = e.reasoning), n.waitDiv.classList.add('hidden'), _mountTextDiv(n), _renderMarkdown(n.textDiv, e.content), e.media && _appendMedia(n.textDiv, e.media.kind, e.media.url), _addCopyAction(n.actionsDiv, () => e.media ? e.media.url : e.content), _aiReadOnly || _addRetryAction(n.actionsDiv, () => _retryMessage(e.id)), t.appendChild(n.messageDiv), _scrollChatToBottom(), n.messageDiv;
}
function _showThinkingIndicator() {
  const e = document.getElementById('aiMessages'), t = document.createElement('div');
  if (t.className = 'ai-message assistant', _aiWebSearchEnabled) {
    const e = document.createElement('div');
    e.className = 'ai-message-status', e.textContent = 'Searching the web\u2026', t.appendChild(e);
  }
  const n = document.createElement('div');
  return n.className = 'ai-blink-dots', n.innerHTML = '<span class="ai-typing-dot"></span><span class="ai-typing-dot"></span><span class="ai-typing-dot"></span>', t.appendChild(n), e.appendChild(t), _scrollChatToBottom(), t;
}
function _formatStats({
  startedAt: e,
  firstTokenAt: t,
  usage: n
}) {
  const a = [((performance.now() - e) / 1000).toFixed(1) + 's'];
  if (t && a.push(`TTFT ${ ((t - e) / 1000).toFixed(1) }s`), n) {
    const e = n.total_tokens ?? (n.prompt_tokens ?? 0) + (n.completion_tokens ?? 0);
    e && a.push(`${ e } tokens total`);
  }
  return a.join(' \xB7 ');
}
function _retryMessage(e) {
  if (_aiStreaming || _aiReadOnly)
    return;
  const retryChat = _aiChats.find(chat => chat.id === _aiCurrentChatId);
  const retryIndex = retryChat?.messages.findIndex(message => message.id === e) ?? -1;
  const retryPrompt = retryChat?.messages.slice(0, retryIndex).reverse().find(message => message.role === 'user')?.content;
  if (_atlasBlockedPrompt(retryPrompt)) return _atlasRejectPrompt(retryPrompt);
  if (!_aiWsReady || !_aiWs)
    return _setAIStatus('not connected'), void _ensureAIWs();
  if (!e || !_aiCurrentChatId)
    return;
  const t = _getChat(_aiCurrentChatId), n = t.messages.findIndex(t => t.id === e);
  -1 !== n && (t.messages = t.messages.slice(0, n), _persistChat(t)), _clearAIMessages(), t.messages.forEach(e => {
    'user' === e.role ? _renderUserMessage(e.id, e.content, e.media ? e.media.url : null) : _renderAssistantMessage(e);
  }), _aiStreaming = !0, _streamMedia = null, _streamAsstId = e, _streamPlaceholder = _showThinkingIndicator(), _aiWs.send(JSON.stringify({
    type: 'retry',
    conversationId: _aiCurrentChatId,
    model: _aiSelectedModel,
    webSearch: _aiWebSearchEnabled
  }));
}
function _editMessage(e, t) {
  if (_aiStreaming)
    return;
  const n = e.querySelector('.ai-message-actions'), a = e.querySelector('.ai-message-text');
  if (!a)
    return;
  const o = document.createElement('textarea');
  o.value = t, o.className = 'ai-message-text ai-edit-textarea';
  const s = document.createElement('div');
  s.className = 'ai-edit-actions';
  const r = document.createElement('button');
  r.textContent = 'Cancel', r.className = 'ai-edit-cancel-btn', r.onclick = () => {
    const e = document.createElement('div');
    e.className = 'ai-message-text', e.textContent = t, o.replaceWith(e), s.remove(), n && n.classList.remove('hidden');
  };
  const i = document.createElement('button');
  i.textContent = 'Save & send', i.className = 'ai-edit-save-btn', i.onclick = () => {
    const t = o.value.trim();
    t && _editAndResend(e.dataset.msgId, t);
  }, s.appendChild(r), s.appendChild(i), a.replaceWith(o), n && n.classList.add('hidden'), o.insertAdjacentElement('afterend', s), o.focus();
}
function _editAndResend(e, t) {
  if (_aiStreaming || _aiReadOnly)
    return;
  if (_atlasBlockedPrompt(t)) return _atlasRejectPrompt(t);
  if (!_aiWsReady || !_aiWs)
    return _setAIStatus('not connected'), void _ensureAIWs();
  if (!_aiCurrentChatId)
    return;
  const n = _getChat(_aiCurrentChatId), a = n.messages.findIndex(t => t.id === e), o = -1 !== a ? n.messages[a].media : null;
  -1 !== a && (n.messages = n.messages.slice(0, a)), _persistChat(n), _clearAIMessages(), n.messages.forEach(e => {
    'user' === e.role ? _renderUserMessage(e.id, e.content, e.media ? e.media.url : null) : _renderAssistantMessage(e);
  }), _showAIWelcome(!1), _renderUserMessage(e, t, o ? o.url : null), _streamPlaceholder = _showThinkingIndicator(), _aiStreaming = !0, _streamMedia = null, _pendingUserMsg = {
    id: e,
    content: t,
    media: o
  }, _aiWs.send(JSON.stringify({
    type: 'edit',
    conversationId: _aiCurrentChatId,
    messageId: e,
    userMessageId: e,
    content: _atlasAiPrompt(t),
    model: _aiSelectedModel,
    webSearch: _aiWebSearchEnabled
  }));
}
function _chatExpired(e) {
  if (!e)
    return !1;
  if (e.expired)
    return !0;
  if (!e.messages || !e.messages.length)
    return !1;
  const t = e.lastMessageAt || e.updatedAt || 0;
  return t > 0 && Date.now() - t > AI_CHAT_TTL_MS;
}
function _renderChatMessages(e) {
  _clearAIMessages(), e.messages.forEach(e => {
    'user' === e.role ? _renderUserMessage(e.id, e.content, e.media ? e.media.url : null) : _renderAssistantMessage(e);
  });
}
function _applyAIReadOnlyState() {
  const e = document.getElementById('aiExpiredBanner'), t = document.getElementById('aiInputStack');
  e && e.classList.toggle('hidden', !_aiReadOnly), t && t.classList.toggle('hidden', _aiReadOnly);
}
function _markChatExpired(e) {
  const t = _aiChats.find(t => t.id === e);
  t && (t.expired = !0, _persistChat(t, !1), _aiCurrentChatId === e && (_aiReadOnly = !0, _renderChatMessages(t), _applyAIReadOnlyState()), _renderRecents());
}
function _getChat(e) {
  let t = _aiChats.find(t => t.id === e);
  return t || (t = {
    id: e,
    title: '',
    messages: []
  }, _aiChats.unshift(t)), t;
}
function _renderRecents() {
  const e = document.getElementById('aiRecentsList');
  if (e) {
    if (e.innerHTML = '', 0 === _aiChats.length) {
      const t = document.createElement('div');
      return t.className = 'ai-empty-state', t.textContent = 'No recent chats', void e.appendChild(t);
    }
    _aiChats.forEach(t => {
      if (/^Application context:/i.test(t.title || '')) t.title = (t.messages.find(message => message.role === 'user')?.content || 'Conversation').slice(0, 80);
      const n = _chatExpired(t), a = document.createElement('div');
      a.className = 'ai-recent-item' + (t.id === _aiCurrentChatId ? ' active' : '') + (n ? ' expired' : ''), a.dataset.chatId = t.id;
      a.setAttribute('role', 'group');
      const o = document.createElement('span');
      o.setAttribute('role', 'button'); o.tabIndex = 0;
      o.addEventListener('keydown', event => {
        if(event.key === 'Enter' || event.key === ' ') { event.preventDefault(); _loadChat(t.id); }
      });
      if (o.className = 'ai-recent-item-title', o.textContent = t.title || 'untitled', o.onclick = () => _loadChat(t.id), a.appendChild(o), n) {
        const e = document.createElement('span');
        e.className = 'ai-recent-item-badge', e.textContent = 'expired', e.title = 'Chats are deleted from the server 35 hours after the last message. You can still read this one.', e.onclick = () => _loadChat(t.id), a.appendChild(e);
      }
      const s = document.createElement('button');
      s.className = 'ai-recent-item-delete', s.type = 'button', s.title = 'Delete conversation', s.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>', s.onclick = e => {
        e.stopPropagation(), _deleteChat(t.id);
      }, a.appendChild(s), e.appendChild(a);
    });
  }
}
function _deleteChatRecord(e) {
  _oDB().then(t => {
    t.transaction('chats', 'readwrite').objectStore('chats').delete(e);
  }).catch(t => {
    console.error('[O] chat delete failed:', e, t);
  });
}
function _deleteChat(e) {
  if (e)
    if (_chatExpired(_aiChats.find(t => t.id === e)))
      _onConversationDeleted(e);
    else {
      if (!_aiWsReady || !_aiWs)
        return _setAIStatus('not connected'), void _ensureAIWs();
      _pendingDeleteChatId = e, _aiWs.send(JSON.stringify({
        type: 'deleteConversation',
        conversationId: e
      }));
    }
}
function _onConversationDeleted(e) {
  e && (_pendingDeleteChatId === e && (_pendingDeleteChatId = null), _aiChats = _aiChats.filter(t => t.id !== e), _deleteChatRecord(e), _aiCurrentChatId === e && (_aiCurrentChatId = null, _aiReadOnly = !1, _applyAIReadOnlyState(), _clearAIMessages(), _showAIWelcome(!0)), _renderRecents());
}
function _loadChat(e) {
  if (_aiStreaming)
    return;
  const t = _aiChats.find(t => t.id === e);
  if (t) {
    if (_aiCurrentChatId = e, _showAIWelcome(!1), _aiReadOnly = _chatExpired(t), _applyAIReadOnlyState(), _renderChatMessages(t), t.model) {
      const e = document.getElementById('aiModelPopup');
      e && e.querySelector(`.ai-model-item[data-model-id="${ t.model }"]`) && _selectModel(t.model);
    }
    _renderRecents();
  }
}
function _startScreenshare() {
  _screenshareStream ? _toast('screenshare already active') : window.documentPictureInPicture && window.documentPictureInPicture.requestWindow ? (alert('Choose the tab or window to screenshare, NOT your entire screen.\nThe model currently selected will be used for screenshare.'), navigator.mediaDevices.getDisplayMedia({
    video: { displaySurface: 'browser' },
    audio: !1
  }).then(e => _initScreenshareStream(e)).catch(e => {
    e && 'NotAllowedError' !== e.name && _toast('screenshare failed: ' + (e.message || e));
  })) : _toast('Picture-in-Picture is not supported in this browser');
}
async function _initScreenshareStream(e) {
  _screenshareStream = e;
  const t = document.createElement('video');
  t.muted = !0, t.playsInline = !0, t.srcObject = e;
  try {
    await t.play();
  } catch (e) {
  }
  _screenshareVideo = t;
  const n = e.getVideoTracks()[0];
  n && n.addEventListener('ended', _stopScreenshare), _screenshareChatId = null, await _openScreenshareWindow();
}
function _stopScreenshare() {
  if (_screenshareRenderer.cancel(), _screenshareStream && (_screenshareStream.getTracks().forEach(e => e.stop()), _screenshareStream = null), _screenshareVideo = null, _screenshareWin) {
    try {
      _screenshareWin.close();
    } catch (e) {
    }
    _screenshareWin = null;
  }
  _screenshareUi = null, _screenshareStreaming = !1, _screenshareChatId = null, _screenshareAsstId = null, _screenshareContent = '', _screenshareReasoning = '', _pendingScreenshareUserMsg = null, _pendingScreenshareMediaResolve = null;
}
'undefined' != typeof marked && (marked.setOptions({ breaks: !0 }), 'undefined' != typeof markedKatex && marked.use(markedKatex({ throwOnError: !1 })), 'undefined' != typeof markedHighlight && 'undefined' != typeof hljs && marked.use(markedHighlight.markedHighlight({
  langPrefix: 'hljs language-',
  highlight(e, t) {
    const n = hljs.getLanguage(t) ? t : 'plaintext';
    return hljs.highlight(e, { language: n }).value;
  }
})));
const SCREENSHARE_MAX_SIDE = 1920, SCREENSHARE_JPEG_QUALITY = 0.85;
function _captureScreenshot() {
  return new Promise((e, t) => {
    try {
      const n = _screenshareVideo;
      if (!n)
        return void t(new Error('no active screenshare'));
      const a = n.videoWidth || 1280, o = n.videoHeight || 720, s = Math.min(1, SCREENSHARE_MAX_SIDE / Math.max(a, o)), r = document.createElement('canvas');
      r.width = Math.max(1, Math.round(a * s)), r.height = Math.max(1, Math.round(o * s));
      const i = r.getContext('2d');
      i.imageSmoothingQuality = 'high', i.drawImage(n, 0, 0, r.width, r.height), r.toBlob(n => {
        n ? e(n) : t(new Error('capture failed'));
      }, 'image/jpeg', SCREENSHARE_JPEG_QUALITY);
    } catch (e) {
      t(e);
    }
  });
}
async function _openScreenshareWindow() {
  let e;
  try {
    e = await window.documentPictureInPicture.requestWindow({
      width: 380,
      height: 520
    });
  } catch (e) {
    return _toast('could not open the AI screenshare window'), void _stopScreenshare();
  }
  _screenshareWin = e;
  const t = e.document.createElement('style');
  t.textContent = '\n        * { box-sizing: border-box; }\n        html, body { margin: 0; height: 100%; background: #0c0c14; color: #e8e8f0; font-family: \'Inter\', system-ui, sans-serif; }\n        .ss-wrap { display: flex; flex-direction: column; height: 100%; }\n        .ss-header { padding: 10px 12px; font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.5); letter-spacing: .02em; border-bottom: 1px solid rgba(255,255,255,0.08); flex-shrink: 0; }\n        .ss-messages { flex: 1; overflow-y: auto; padding: 10px 12px; display: flex; flex-direction: column; gap: 12px; }\n        .ss-turn { display: flex; flex-direction: column; gap: 6px; }\n        .ss-user { font-size: 12px; color: rgba(255,255,255,0.45); font-style: italic; white-space: pre-wrap; }\n        .ss-assistant { font-size: 13.5px; line-height: 1.5; color: rgba(255,255,255,0.92); word-wrap: break-word; }\n        .ss-assistant a { color: #a78bfa; }\n        .ss-assistant p { margin: 0 0 8px; }\n        .ss-assistant p:last-child { margin-bottom: 0; }\n        .ss-status { font-size: 11px; color: rgba(255,255,255,0.4); padding: 0 12px 4px; min-height: 14px; flex-shrink: 0; }\n        .ss-inputrow { display: flex; gap: 6px; padding: 8px 10px; border-top: 1px solid rgba(255,255,255,0.08); flex-shrink: 0; }\n        .ss-textarea { flex: 1; resize: none; min-height: 34px; max-height: 90px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; color: #fff; padding: 8px 10px; font-family: inherit; font-size: 13px; }\n        .ss-textarea:focus { outline: none; border-color: rgba(167,139,250,0.5); }\n        .ss-btn { border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }\n        .ss-send { width: 34px; height: 34px; background: #8b7cf6; color: #fff; }\n        .ss-send:disabled, .ss-solve:disabled { opacity: .4; cursor: default; }\n        .ss-solverow { padding: 0 10px 8px; flex-shrink: 0; }\n        .ss-solve { width: 100%; padding: 8px; background: rgba(167,139,250,0.15); color: #cbb8ff; font-size: 12.5px; font-weight: 500; border: 1px solid rgba(167,139,250,0.3); }\n        .ss-solve:hover:not(:disabled) { background: rgba(167,139,250,0.25); }\n        .ss-dots { display: flex; gap: 4px; padding: 2px 0; }\n        .ss-dot { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,0.4); animation: ssBlink 1.2s infinite ease-in-out; }\n        .ss-dot:nth-child(2) { animation-delay: .15s; }\n        .ss-dot:nth-child(3) { animation-delay: .3s; }\n        @keyframes ssBlink { 0%, 80%, 100% { opacity: .25; } 40% { opacity: 1; } }\n    ', e.document.head.appendChild(t);
  const n = e.document.createElement('div');
  n.className = 'ss-wrap';
  const a = e.document.createElement('div');
  a.className = 'ss-header', a.textContent = 'Atlas AI - screenshare', n.appendChild(a);
  const o = e.document.createElement('div');
  o.className = 'ss-messages', n.appendChild(o);
  const s = e.document.createElement('div');
  s.className = 'ss-status', n.appendChild(s);
  const r = e.document.createElement('div');
  r.className = 'ss-solverow';
  const i = e.document.createElement('button');
  i.type = 'button', i.className = 'ss-btn ss-solve', i.textContent = 'Solve question on this page', r.appendChild(i), n.appendChild(r);
  const c = e.document.createElement('div');
  c.className = 'ss-inputrow';
  const l = e.document.createElement('textarea');
  l.className = 'ss-textarea', l.placeholder = 'Ask about this tab\u2026', l.rows = 1;
  const d = e.document.createElement('button');
  d.type = 'button', d.className = 'ss-btn ss-send', d.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="m5 12 7-7 7 7M12 19V5"/></svg>', c.appendChild(l), c.appendChild(d), n.appendChild(c), e.document.body.appendChild(n);
  const u = () => {
    const e = l.value.trim();
    e && !_screenshareStreaming && (l.value = '', _sendScreenshareMessage(e));
  };
  d.onclick = u, l.addEventListener('keydown', e => {
    'Enter' !== e.key || e.shiftKey || (e.preventDefault(), u());
  }), i.onclick = () => {
    _screenshareStreaming || _sendScreenshareMessage(SOLVE_QUESTION_PROMPT);
  }, e.addEventListener('pagehide', _stopScreenshare, { once: !0 }), _screenshareUi = {
    messages: o,
    status: s,
    sendBtn: d,
    solveBtn: i,
    textarea: l,
    currentTurn: null,
    currentAssistantEl: null,
    currentDots: null
  };
}
function _screenshareSetStatus(e) {
  _screenshareUi && _screenshareUi.status && (_screenshareUi.status.textContent = e || '');
}
function _screenshareRenderUser(e) {
  if (!_screenshareUi || !_screenshareWin)
    return;
  const t = _screenshareWin.document, n = t.createElement('div');
  n.className = 'ss-turn';
  const a = t.createElement('div');
  a.className = 'ss-user', a.textContent = '\uD83D\uDCF8 ' + e, n.appendChild(a), _screenshareUi.messages.appendChild(n), _screenshareUi.currentTurn = n, _screenshareUi.messages.scrollTop = _screenshareUi.messages.scrollHeight;
}
function _screenshareShowThinking() {
  if (!_screenshareUi || !_screenshareUi.currentTurn || !_screenshareWin)
    return;
  const e = _screenshareWin.document.createElement('div');
  e.className = 'ss-dots', e.innerHTML = '<span class="ss-dot"></span><span class="ss-dot"></span><span class="ss-dot"></span>', _screenshareUi.currentTurn.appendChild(e), _screenshareUi.currentDots = e;
}
function _screenshareUpdateResponse() {
  if (_screenshareUi && _screenshareUi.currentTurn && _screenshareWin) {
    if (_screenshareUi.currentDots && (_screenshareUi.currentDots.remove(), _screenshareUi.currentDots = null), !_screenshareUi.currentAssistantEl) {
      const e = _screenshareWin.document.createElement('div');
      e.className = 'ss-assistant', _screenshareUi.currentTurn.appendChild(e), _screenshareUi.currentAssistantEl = e;
    }
    _renderMarkdown(_screenshareUi.currentAssistantEl, _atlasResponseText(_screenshareContent, _screenshareStreaming)), _screenshareUi.messages.scrollTop = _screenshareUi.messages.scrollHeight;
  }
}
async function _sendScreenshareMessage(e) {
  if (_screenshareStreaming)
    return;
  if (!e)
    return;
  if (_aiStreaming)
    return void _screenshareSetStatus('main chat is busy, try again in a moment');
  if (_atlasBlockedPrompt(e)) {
    const ui = _screenshareUi;
    if (!ui) return;
    _screenshareRenderUser(e); _screenshareShowThinking(); _screenshareStreaming = true;
    ui.sendBtn.disabled = ui.solveBtn.disabled = true;
    setTimeout(() => {
      if (_screenshareUi !== ui) return;
      _screenshareContent = ATLAS_AI_RESTRICTION; _screenshareUpdateResponse();
      _screenshareStreaming = false; ui.sendBtn.disabled = ui.solveBtn.disabled = false;
    }, 2000);
    return;
  }
  if (!_screenshareVideo)
    return void _screenshareSetStatus('no tab is being shared');
  if (!_aiWsReady || !_aiWs)
    return _ensureAIWs(), void _screenshareSetStatus('not connected');
  let t;
  _screenshareUi && (_screenshareUi.sendBtn && (_screenshareUi.sendBtn.disabled = !0), _screenshareUi.solveBtn && (_screenshareUi.solveBtn.disabled = !0)), _screenshareSetStatus('capturing screenshot\u2026');
  try {
    t = await _captureScreenshot();
  } catch (e) {
    return void _screenshareOnError('screenshot failed');
  }
  const n = new File([t], 'screenshot.jpg', { type: t.type || 'image/jpeg' }), a = URL.createObjectURL(t);
  _screenshareRenderUser(e), _screenshareShowThinking(), _screenshareStreaming = !0, _screenshareContent = '', _screenshareReasoning = '', _screenshareAsstId = _newId(), _pendingScreenshareUserMsg = {
    id: _newId(),
    content: e,
    media: {
      url: a,
      blob: n
    }
  }, _screenshareSetStatus('uploading screenshot\u2026');
  try {
    const t = await _fileToBase64(n), a = await new Promise((e, t) => {
        _pendingScreenshareMediaResolve = e, _aiWs.send(JSON.stringify({
          type: 'mediaStart',
          model: _aiSelectedModel,
          mime: n.type,
          conversationId: _screenshareChatId || void 0
        })), setTimeout(() => {
          _pendingScreenshareMediaResolve === e && (_pendingScreenshareMediaResolve = null, t(new Error('upload timed out')));
        }, 15000);
      });
    for (let e = 0; e < t.length; e += AI_MEDIA_CHUNK_CHARS)
      _aiWs.send(JSON.stringify({
        type: 'mediaChunk',
        mediaId: a,
        chunk: t.slice(e, e + AI_MEDIA_CHUNK_CHARS)
      }));
    _aiWs.send(JSON.stringify({
      type: 'mediaDone',
      mediaId: a,
      prompt: _atlasAiPrompt(e)
    })), _screenshareSetStatus('');
  } catch (e) {
    _screenshareOnError(e.message || 'upload failed');
  }
}
const _screenshareRenderer = _makeStreamRenderer(_screenshareUpdateResponse);
function _handleScreenshareMessage(e) {
  switch (e.type) {
  case 'message':
    if (_screenshareChatId = e.conversationId, _pendingScreenshareUserMsg) {
      const t = _getChat(_screenshareChatId);
      t.lastMessageAt = Date.now(), t.title || (t.title = e.title || 'Screenshare'), t.model = e.model || _aiSelectedModel;
      const n = e.messageId || _pendingScreenshareUserMsg.id;
      t.messages.push({
        id: n,
        role: 'user',
        content: _pendingScreenshareUserMsg.content,
        media: _pendingScreenshareUserMsg.media
      }), _persistChat(t), _pendingScreenshareUserMsg = null;
    }
    _renderRecents();
    break;
  case 'thinking':
    _screenshareReasoning || _screenshareSetStatus('Reasoning\u2026'), _screenshareReasoning += e.delta || '';
    break;
  case 'content': {
      const t = !_screenshareContent;
      t && _screenshareSetStatus(''), _screenshareContent += e.delta || '', t ? _screenshareRenderer.flush() : _screenshareRenderer.schedule();
      break;
    }
  case 'processing':
    _screenshareSetStatus(e.text || '');
    break;
  case 'usage':
    break;
  case 'image':
  case 'video':
    _screenshareContent += (_screenshareContent ? '\n\n' : '') + `[${ e.type }](${ e.url })`, _screenshareRenderer.flush();
    break;
  case 'done':
    _screenshareFinish();
    break;
  case 'error':
    _pendingScreenshareMediaResolve && (_pendingScreenshareMediaResolve = null), _screenshareOnError(e.text || 'error');
  }
}
function _screenshareFinish() {
  _screenshareContent = _atlasResponseText(_screenshareContent); _screenshareReasoning = _atlasResponseText(_screenshareReasoning);
  _screenshareRenderer.flush();
  const e = _getChat(_screenshareChatId);
  if (e) {
    const t = {
      id: _screenshareAsstId,
      role: 'assistant',
      content: _screenshareContent,
      reasoning: _screenshareReasoning || void 0
    };
    e.messages.push(t), e.lastMessageAt = Date.now(), _persistChat(e);
  }
  _renderRecents(), _screenshareUi && (_screenshareUi.currentTurn = null, _screenshareUi.currentAssistantEl = null, _screenshareUi.currentDots = null, _screenshareUi.sendBtn && (_screenshareUi.sendBtn.disabled = !1), _screenshareUi.solveBtn && (_screenshareUi.solveBtn.disabled = !1)), _screenshareStreaming = !1, _screenshareSetStatus('');
}
function _screenshareOnError(e) {
  _screenshareRenderer.cancel(), _screenshareSetStatus(e), _screenshareUi && (_screenshareUi.currentDots && (_screenshareUi.currentDots.remove(), _screenshareUi.currentDots = null), _screenshareUi.currentTurn = null, _screenshareUi.currentAssistantEl = null, _screenshareUi.sendBtn && (_screenshareUi.sendBtn.disabled = !1), _screenshareUi.solveBtn && (_screenshareUi.solveBtn.disabled = !1)), _pendingScreenshareUserMsg = null, _pendingScreenshareMediaResolve = null, _screenshareStreaming = !1;
}
async function clearAtlasData() {
  if (!confirm('Clear Atlas bookmarks, chats, settings and cached games? Synergy login will be kept.')) return;
  for (const key of ['SETTINGS','TRNSPRT','transport','WID','O_MIGRATED','CTRLLERMAP','CLOUD_ICE','ADS_NOTICE_SEEN']) localStorage.removeItem(key);
  for (const key of ['atlasSwSoft','atlasSwReloaded']) sessionStorage.removeItem(key);
  const databases = ['O','oCache','oAiChats','__jet_controller','__scramjet_controller'];
  await Promise.all(databases.map(name => new Promise(resolve => {
    const request = indexedDB.deleteDatabase(name);
    request.onsuccess = request.onerror = request.onblocked = resolve;
  })));
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.filter(item => item.scope === window.atlasAppBase).map(item => item.unregister()));
  allowUnload = true;
  location.reload();
}

function applyAtlasTheme() {
  document.title = 'atlas';
  document.querySelector('.wordmark')?.remove();
  const style = document.createElement('link');
  style.id = 'atlas-tobacco-theme';
  style.rel = 'stylesheet';
  const signalThemeReady = () => document.dispatchEvent(new Event('atlas:theme-ready'));
  style.addEventListener('load', signalThemeReady, { once: true });
  style.addEventListener('error', signalThemeReady, { once: true });
  style.href = getAsset('atlas-tobacco.css');
  shadowRoot.appendChild(style);
  const chrome = document.createElement('div');
  chrome.id = 'atlasChrome';
  chrome.innerHTML = `
    <div class="atlas-frame" aria-hidden="true"></div>
    <aside class="atlas-rail">
      <button class="atlas-command-key" type="button" title="Focus search">&#8984;K</button>
      <div class="atlas-rail-wordmark">atlas</div>
      <div class="atlas-rail-context" id="atlasRailContext">Home</div>
      <div class="atlas-credit">Based on tongsherbet/storage &middot; Inspired by GUST</div>
    </aside>`;
  shadowRoot.appendChild(chrome);
  const content = document.querySelector('.content');
  const searchWrap = document.getElementById('searchWrap');
  const shortcuts = document.getElementById('shortcuts');
  if (content?.parentElement) {
    content.parentElement.style.background = 'linear-gradient(90deg, rgba(197, 123, 46, .035), transparent 16%), #160e09';
  }
  if (content && searchWrap && shortcuts) {
    const searchHeading = document.createElement('div');
    searchHeading.className = 'atlas-search-heading';
    searchHeading.innerHTML = `<span class="atlas-caret">&rsaquo;</span><span>Search or enter address</span><kbd>&#8984;K</kbd>`;
    content.insertBefore(searchHeading, searchWrap);
    const recent = document.createElement('div');
    recent.className = 'atlas-recent';
    recent.innerHTML = `<span>Recent</span>`;
    [
      [
        'Twitch directory',
        'https://twitch.tv/directory'
      ],
      [
        'YouTube subscriptions',
        'https://youtube.com/feed/subscriptions'
      ],
      [
        'Geometry Dash',
        'https://webdashers.dev/'
      ]
    ].forEach(([label, url]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.onclick = () => navigate(url);
      recent.appendChild(button);
    });
    searchWrap.after(recent);
    const destinationHeading = document.createElement('div');
    destinationHeading.className = 'atlas-destinations-heading';
    destinationHeading.innerHTML = `<strong>Destinations</strong><span>Press Alt + 1&ndash;9 to jump</span><span id="atlasDestinationCount">All ${ SHORTCUTS.length + _bookmarks.length }</span>`;
    shortcuts.before(destinationHeading);
  }
  const navButtons = document.querySelector('.nav-buttons');
  if (navButtons) {
    const createNavButton = (id, label, handler) => {
      const button = document.createElement('button');
      button.className = 'nav-item atlas-text-nav';
      button.id = id;
      button.type = 'button';
      button.textContent = label;
      button.onclick = handler;
      return button;
    };
    navButtons.prepend(createNavButton('navHome', 'Home', () => {
      _activateAtlasScreen(null);
    }), createNavButton('navBrowse', 'Browse', () => {
      _activateAtlasScreen('panel');
      const panel = document.getElementById('panel');
      panel?.classList.add('open');
      document.getElementById('bottomNav')?.classList.add('hidden');
      const address = document.getElementById('addrInput');
      address?.focus();
      address?.select();
    }));
  }
  const gamesButton = document.getElementById('navGames');
  const effectsButton = document.getElementById('navEffects');
  const aiButton = [...document.querySelectorAll('.nav-item')].find(button => button.textContent.trim() === 'AI');
  if (gamesButton)
    gamesButton.dataset.label = 'Library';
  if (effectsButton)
    effectsButton.dataset.label = 'Sound';
  if (aiButton)
    aiButton.dataset.label = 'Atlas AI';
  const settingsButton = document.getElementById('navSettings');
  settingsButton?.setAttribute('data-label', 'Settings');
  if (settingsButton && aiButton)
    navButtons?.insertBefore(settingsButton, aiButton);
  const gamesHeader = document.querySelector('#gamesScreen .screen-header-left');
  const effectsHeader = document.querySelector('#effectsScreen .screen-header-left');
  const settingsHeader = document.querySelector('#settingsScreen .screen-header-left');
  if (gamesHeader)
    gamesHeader.innerHTML = `<span class="screen-header-title">Library</span><span class="screen-header-sub">Games that run inside Atlas.</span>`;
  if (effectsHeader)
    effectsHeader.innerHTML = `<span class="screen-header-title">Sound effects</span><span class="screen-header-sub">Play a sound without leaving your session.</span>`;
  if (settingsHeader)
    settingsHeader.innerHTML = `<span class="screen-header-title">Settings</span>`;
  const volumeFooter = document.querySelector('.effects-footer');
  const volumeSlider = document.getElementById('volumeSlider');
  if (volumeFooter && volumeSlider) {
    const label = document.createElement('span');
    label.className = 'effects-volume-label';
    label.textContent = 'Master';
    const output = document.createElement('output');
    output.className = 'effects-volume-output';
    output.id = 'effectsVolumeOutput';
    output.value = '100';
    output.textContent = '100';
    volumeFooter.prepend(label);
    volumeFooter.appendChild(output);
    volumeSlider.addEventListener('input', () => {
      const value = String(Math.round(parseFloat(volumeSlider.value) * 100));
      output.value = value;
      output.textContent = value;
    });
  }
  const commandKey = chrome.querySelector('.atlas-command-key');
  commandKey.onclick = () => {
    const panel = document.getElementById('panel');
    if (!panel?.classList.contains('open')) _activateAtlasScreen(null);
    const input = panel?.classList.contains('open') ? document.getElementById('addrInput') : document.getElementById('searchInput');
    input?.focus();
    input?.select();
  };
  window.updateAtlasChromeState = () => {
    const panelOpen = document.getElementById('panel')?.classList.contains('open');
    const libraryOpen = document.getElementById('gamesScreen')?.classList.contains('open');
    const soundOpen = document.getElementById('effectsScreen')?.classList.contains('open');
    const settingsOpen = document.getElementById('settingsScreen')?.classList.contains('open');
    const playerOpen = document.getElementById('gamePlayer')?.classList.contains('open');
    const aiOpen = document.getElementById('aiScreen')?.classList.contains('open');
    const context = aiOpen ? 'AI' : settingsOpen ? 'Settings' : soundOpen ? 'Sound' : libraryOpen ? 'Library' : panelOpen ? 'Browsing' : 'Home';
    const contextEl = document.getElementById('atlasRailContext');
    if (contextEl)
      contextEl.textContent = context;
    chrome.classList.toggle('atlas-home', context === 'Home');
    chrome.classList.toggle('atlas-player-open', playerOpen);
    document.getElementById('bottomNav')?.classList.toggle('atlas-player-open', playerOpen);
    document.getElementById('navHome')?.classList.toggle('active', context === 'Home');
    document.getElementById('navBrowse')?.classList.toggle('active', context === 'Browsing');
  };
  window.updateAtlasChromeState();
  document.addEventListener('keydown', event => {
    if (!event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
      return;
    const active = shadowRoot?.activeElement || document.activeElement;
    if (active?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(active?.tagName || '')) return;
    const index = event.key === '0' ? 9 : Number(event.key) - 1;
    if (index < 0 || index > 8 || !SHORTCUTS[index])
      return;
    event.preventDefault();
    if (SHORTCUTS[index].url) navigate(SHORTCUTS[index].url);
    else SHORTCUTS[index].onclick?.();
  });
}
applyAtlasTheme();
