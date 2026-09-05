var _0x931b = 7;
const sjEncode = url => frame.prefix + controller.config.codec.encode(url);
_0x931b = 11;
const SHORTCUTS = [{
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
const ra = [{
  "name": "Google",
  "url": "https://www.google.com/search?q="
}, {
  "name": "DuckDuckGo",
  "url": "https://duckduckgo.com/?q="
}, {
  "name": "Bing",
  "url": "https://www.bing.com/search?q="
}, {
  "name": "Brave",
  "url": "https://search.brave.com/search?q="
}, {
  "name": "Yahoo",
  "url": "https://search.yahoo.com/search?p="
}, {
  "name": "Startpage",
  "url": "https://www.startpage.com/sp/search?q="
}, {
  "name": "Ecosia",
  "url": "https://www.ecosia.org/search?q="
}, {
  "name": "Ask",
  "url": "https://www.ask.com/web?q="
}];
var _0x6f1g7g = 7;
const SETTINGS = {
  "Appearance": {
    "Stars": {
      "type": "toggle",
      "default": true,
      "callback": val => {
        starsEnabled = val;
      }
    },
    'Shooting Stars': {
      "type": "toggle",
      "default": true,
      "callback": val => {
        shootingStarsEnabled = val;
      }
    },
    "Prevent Close": {
      "type": 'toggle',
      "default": true,
      "callback": val => {
        preventCloseEnabled = val;
      }
    },
    "Title Changer": {
      "type": "toggle",
      "default": true,
      "callback": (val, init) => {
        titleChangerEnabled = val;
        if (init) return;
        if (!val) {
          try {
            clearTimeout(focusTimeout);
          } catch {}
          focusTimeout = null;
          document.title = "atlas";
        } else if (document.hidden) {
          document.title = "New Tab";
        }
      }
    }
  },
  'Privacy': {
    "PrivateDNS (AdBlock, AntiTracking, AntiMalware)": {
      "type": "toggle",
      "default": true,
      "callback": (val, init) => {
        localStorage.ABDE = val;
        if (!init) {
          allowUnload = true;
          location.reload();
        }
      }
    },
    "Clientsided Ad Block": {
      "type": "toggle",
      "default": true,
      "callback": val => {}
    },
    "About:Blank Cloak": {
      "type": "toggle",
      "default": false,
      "callback": (val, init) => {
        if (init) return;
        if (val) triggerCloak();
      }
    }
  },
  "Proxy": {
    "Transport": {
      "type": "dropdown",
      "default": {
        "name": "libcurl",
        "src": getAsset("curl/index.mjs")
      },
      "options": [{
        "name": "libcurl",
        "src": getAsset("curl/index.mjs")
      }, {
        "name": "epoxy",
        "src": getAsset("pox/index.mjs")
      }],
      "callback": async val => {
        try {
          if (localStorage.transport === val.src) return;
          localStorage.transport = val.src;
          const {
            "default": TransportClient
          } = await import(val.src);
          transport = new TransportClient({
            "wisp": window.wispServer
          });
          await initTransport(transport);
          controller.setTransport(transport);
        } catch {}
      }
    },
    "Search Engine": {
      "type": 'dropdown',
      "default": {
        "name": "Brave",
        "url": "https://search.brave.com/search?q="
      },
      "options": ra,
      "callback": val => {}
    }
  },
  "Advanced": {
    "Force Update/Clear Data": {
      "type": "button",
      "label": 'Clear',
      "action": async () => {
        if (!confirm("This will clear all data and force update the client. Are you sure?")) return;
        try {
          const names = await caches.keys();
          await Promise.all(names.map(n => caches["delete"](n)));
        } catch (e) {}
        try {
          localStorage.clear();
        } catch (e) {}
        try {
          sessionStorage.clear();
        } catch (e) {}
        try {
          document.cookie.split(";").forEach(c => {
            const name = c.split("=")[0].trim();
            const domain = location.hostname;
            const pathParts = location.pathname.split("/");
            for (let i = pathParts.length; i >= 0; i--) {
              const path = pathParts.slice(0, i).join("/") || "/";
              document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path};domain=${domain}`;
              document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path}`;
            }
          });
        } catch (e) {}
        try {
          const regs = await navigator.serviceWorker.getRegistrations();
          await Promise.all(regs.map(r => r.unregister()));
        } catch (e) {}
        try {
          const forceDelDb = name => new Promise(res => {
            const open = indexedDB.open(name);
            open.onsuccess = () => {
              open.result.close();
              deleteTs();
            };
            open.onerror = deleteTs;
            const deleteTs = () => {
              const req = indexedDB.deleteDatabase(name);
              req.onsuccess = req.onerror = req.onblocked = res;
            };
          });
          await forceDelDb("__scramjet_controller");
          if (indexedDB.databases) {
            const dbs = await indexedDB.databases();
            await Promise.all(dbs.map(db => forceDelDb(db.name)));
          }
        } catch (e) {}
        allowUnload = true;
        alert("done! after the page reloads, please wait for the client to update and load");
        location.reload(1);
      }
    }
  }
};
_0x6f1g7g = 17;
const EXTENSIONS = [{
  "name": "Youtube Ad Blocker",
  "domain": "youtube.com",
  "code": "(function() { 'use strict'; var cssArrObject = ['#masthead-ad', 'ytd-rich-item-renderer.style-scope.ytd-rich-grid-row #content:has(.ytd-display-ad-renderer)', '.video-ads.ytp-ad-module', 'tp-yt-paper-dialog:has(yt-mealbar-promo-renderer)', 'ytd-engagement-panel-section-list-renderer[target-id=\"engagement-panel-ads\"]', '#related #player-ads', '#related ytd-ad-slot-renderer', 'ytd-ad-slot-renderer', 'yt-mealbar-promo-renderer', 'ytd-popup-container:has(a[href=\"/premium\"])', 'ad-slot-renderer', 'ytm-companion-ad-renderer', '#related #-ad-']; function removeNonVideoAds(arry) { arry.forEach((selector, index) => { arry[index] = `${selector}{display:none!important}`; }); const premiumContainers = [...document.querySelectorAll('ytd-popup-container')]; const matchingContainers = premiumContainers.filter(container => container.querySelector('a[href=\"/premium\"]')); if (matchingContainers.length > 0) { matchingContainers.forEach(container => container.remove()); } const backdrops = document.querySelectorAll('tp-yt-iron-overlay-backdrop'); const targetBackdrop = Array.from(backdrops).find((backdrop) => backdrop.style.zIndex === '2201'); if (targetBackdrop) { targetBackdrop.className = ''; targetBackdrop.removeAttribute('opened'); } let style = document.createElement('style'); (document.head || document.body).appendChild(style); style.appendChild(document.createTextNode(arry.join(' '))); } function skipAd(video) { const adIndicator = document.querySelector('.ytp-ad-skip-button, .ytp-skip-ad-button, .ytp-ad-skip-button-modern, .video-ads.ytp-ad-module .ytp-ad-player-overlay, .ytp-ad-button-icon'); if (adIndicator && !window.location.href.includes('https://m.youtube.com/')) { video.muted = true; video.currentTime = video.duration - 0.1; } } function removeAdblockWarning() { var warningInterval = setInterval(function() { var popupExists = document.getElementsByClassName('style-scope ytd-popup-container').length > 0; var dismissButton = document.getElementById('dismiss-button'); var divider = document.getElementById('divider'); if (popupExists && dismissButton && divider) { setTimeout(function() { dismissButton.click(); const playButton = document.getElementsByClassName('ytp-play-button ytp-button')[0]; if (playButton) playButton.click(); clearInterval(warningInterval); }, Math.random() * 3000); } }, Math.random() * 500); } setInterval(() => { if (document.readyState !== 'loading') { removeNonVideoAds(cssArrObject); removeAdblockWarning(); var adsVideo = document.querySelector('.ad-showing video'); var mainVideo = document.querySelector('video'); if (mainVideo) { var playerStatus = { currentTime: mainVideo.currentTime, isPaused: mainVideo.paused, speed: mainVideo.playbackRate }; if (playerStatus.currentTime <= 5 && playerStatus.isPaused == true) { mainVideo.play().catch(error => { console.error('Failed to play video:', error); }); } } if (adsVideo) { skipAd(adsVideo); } } }, 500); })();"
}, {
  "name": "GeForce NOW Ad Blocker",
  "domain": ["geforcenow.com", "*.geforcenow.com"],
  "code": `(function() {
 Object.defineProperty(document, 'hidden', { get: () => false });
 
    function checkForVideo() {
        const video = document.getElementById('preStreamVideo');
        if (video) {
            video.style.width = '0.1px';
            video.style.height = '0.1px';
            video.muted = true;
            const observer = new MutationObserver(() => {
                if (!document.contains(video)) {
                    observer.disconnect();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }
 
    const interval = setInterval(() => {
        if (document.getElementById('preStreamVideo')) {
            clearInterval(interval);
            checkForVideo();
        }
    }, 1000);
})();`
}, {
  "name": "nowgg.fun fat fat",
  "domain": "*.ip.nowgg.fun",
  "code": `window.alert=()=>{}`,
  "prompt": false
}];
var _0xffc = 12;
const _extApproved = new Set();
_0xffc = 5;
const _extDismissed = new Set();
function _domainMatches(pattern, hostname) {
  if (pattern === "*") return true;
  if (pattern.startsWith("*.")) {
    const localValue1 = pattern.slice(1);
    return hostname === localValue1.slice(1) || hostname.endsWith(localValue1);
  }
  return hostname === pattern;
}
function _extMatchesDomain(ext, hostname) {
  const localValue1 = Array.isArray(ext.domain) ? ext.domain : [ext.domain];
  return localValue1.some(p => _domainMatches(p, hostname));
}
function _runExtension(ext) {
  try {
    frame.element.contentWindow.eval(ext?.code?.toString());
  } catch {}
}
function _showExtPrompt(ext, idx) {
  const localValue1 = "_ep" + idx;
  if (document.getElementById(localValue1)) return;
  const localValue2 = document.createElement("div");
  localValue2.id = localValue1;
  localValue2.className = "ext-prompt";
  const localValue3 = document.createElement("div");
  localValue3.className = "ext-prompt-eyebrow";
  localValue3.textContent = "Extension available";
  const localValue4 = document.createElement("div");
  localValue4.className = "ext-prompt-name";
  localValue4.textContent = ext.name;
  const localValue5 = document.createElement("div");
  localValue5.className = "ext-prompt-question";
  localValue5.textContent = "Run it on this site?";
  const localValue6 = document.createElement("div");
  localValue6.className = "ext-prompt-btns";
  const localValue7 = document.createElement("button");
  localValue7.className = "ext-prompt-btn yes";
  localValue7.textContent = "Yes";
  const localValue8 = document.createElement("button");
  localValue8.className = "ext-prompt-btn no";
  localValue8.textContent = "No";
  const localValue9 = () => {
    localValue2.classList.remove("open");
    localValue2.addEventListener("transitionend", () => localValue2.remove(), {
      "once": true
    });
    setTimeout(() => localValue2.remove(), 350);
  };
  localValue7.onclick = () => {
    localValue9();
    _extApproved.add(idx);
    _runExtension(ext);
  };
  localValue8.onclick = () => {
    localValue9();
    _extDismissed.add(idx);
  };
  localValue6.appendChild(localValue7);
  localValue6.appendChild(localValue8);
  localValue2.appendChild(localValue3);
  localValue2.appendChild(localValue4);
  localValue2.appendChild(localValue5);
  localValue2.appendChild(localValue6);
  (shadowRoot || document.body).appendChild(localValue2);
  requestAnimationFrame(() => localValue2.classList.add("open"));
}
function _checkExtensions(href, argument1) {
  try {
    argument1 = new URL(href).hostname;
  } catch (e) {
    return;
  }
  if (!argument1) return;
  EXTENSIONS.forEach((ext, i) => {
    if (ext.enabled === false) return;
    if (!_extMatchesDomain(ext, argument1)) return;
    if (_extApproved.has(i)) {
      _runExtension(ext);
    } else if (ext.prompt === false) {
      _runExtension(ext);
    } else if (!_extDismissed.has(i)) {
      _showExtPrompt(ext, i);
    }
  });
}
let frame = null;
var _0xd1b5e = 12;
let starsEnabled = true;
_0xd1b5e = 7;
let shootingStarsEnabled = true;
let preventCloseEnabled = true;
let titleChangerEnabled = true;
var allowUnload = false;
window.addEventListener("keydown", e => {
  return;
  if (e.ctrlKey && e.key.toLowerCase() === "r") {
    allowUnload = true;
    setTimeout(() => {
      allowUnload = false;
    }, 1000);
  }
});
window.addEventListener("beforeunload", e => {
  if (allowUnload || !preventCloseEnabled) return;
  e.preventDefault();
  e.returnValue = '';
});
var _0x0ebdd = 15;
const saved = (() => {
  try {
    return JSON.parse(localStorage.getItem("SETTINGS") || "{}");
  } catch (e) {
    return {};
  }
})();
_0x0ebdd = 11;
function saveSettings() {
  const localValue1 = {};
  Object.entries(SETTINGS).forEach(([cat, s]) => {
    localValue1[cat] = {};
    Object.entries(s).forEach(([k, v]) => {
      localValue1[cat][k] = v._value !== undefined ? v._value : v["default"];
    });
  });
  localStorage.setItem("SETTINGS", JSON.stringify(localValue1));
}
Object.entries(SETTINGS).forEach(([cat, settings]) => {
  Object.entries(settings).forEach(([key, s]) => {
    s._value = saved[cat]?.[key] !== undefined ? saved[cat][key] : s["default"];
    if (s.callback) s.callback(s._value, true);
  });
});
function cloakAboutBlank() {
  if (window.self !== window.top) return true;
  const localValue1 = window.open("about:blank", "_blank");
  if (!localValue1) return false;
  allowUnload = true;
  localValue1.document.open();
  localValue1.document.write(cloakWrapperHtml(window.location.href));
  localValue1.document.close();
  window.close();
  location.href = "about:blank";
  setTimeout(() => {
    allowUnload = false;
  }, 1000);
  return true;
}
let cloakPending = false;
function triggerCloak() {
  if (cloakAboutBlank()) return;
  if (cloakPending) return;
  cloakPending = true;
  const localValue1 = () => {
    if (!cloakAboutBlank()) return;
    document.removeEventListener("click", localValue1, true);
    document.removeEventListener("keydown", localValue1, true);
    document.removeEventListener("pointerdown", localValue1, true);
    cloakPending = false;
  };
  document.addEventListener("click", localValue1, true);
  document.addEventListener("keydown", localValue1, true);
  document.addEventListener("pointerdown", localValue1, true);
}
function cloakWrapperHtml(originalUrl, argument1) {
  const localValue1 = !!SETTINGS.Appearance["Title Changer"]._value;
  argument1 = 8;
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>New Tab</title>
<style>html,body{margin:0;padding:0;height:100vh;overflow:hidden}iframe{border:0}</style>
</head>
<body>
<iframe id="cloakFrame" width="100%" height="100%" src="${window.location.href}"></iframe>
<script>
(function () {
    var originalUrl = ${JSON.stringify(originalUrl)};
    var titleChangerOnNow = ${localValue1};
    function applyTitle() {
        document.title = (!titleChangerOnNow || document.hidden) ? 'New Tab' : 'atlas';
    }
    document.addEventListener('visibilitychange', applyTitle);
    applyTitle();
    window.addEventListener('storage', function (e) {
        if (e.key !== 'SETTINGS') return;
        var s; try { s = JSON.parse(localStorage.getItem('SETTINGS') || '{}'); } catch (err) { s = {}; }
        titleChangerOnNow = !!(s.Appearance && s.Appearance['Title Changer']);
        applyTitle();
        if (!(s.Privacy && s.Privacy['About:Blank Cloak'])) {
            try { document.getElementById('cloakFrame').contentWindow.allowUnload = true; } catch (e) {}
            window.location.href = originalUrl;
        }
    });
})();
</script>
</body>
</html>`;
}
if (window.self === window.top && SETTINGS.Privacy['About:Blank Cloak']._value) {
  triggerCloak();
}
var _0x9b_0x9e9 = 11;
const taglineEl = document.getElementById("tagline");
_0x9b_0x9e9 = 13;
taglineEl?.remove();
applyAtlasTheme();
document.getElementById("tagline")?.remove();
const atlasAiButton = [...document.querySelectorAll(".nav-item")].find(button => button.textContent.trim() === "AI");
if (atlasAiButton) {
  atlasAiButton.removeAttribute("onclick");
  atlasAiButton.disabled = true;
  atlasAiButton.setAttribute("aria-disabled", "true");
  atlasAiButton.title = "Not available";
}
const atlasNavStats = document.querySelector(".nav-stats");
if (atlasNavStats && !atlasNavStats.querySelector(".atlas-credit")) {
  const credit = document.createElement("span");
  credit.className = "nav-stat atlas-credit";
  credit.textContent = "Credit оpiumbest + Inspired by GUST";
  atlasNavStats.appendChild(credit);
}
const grid = document.getElementById("shortcuts");
SHORTCUTS.forEach(({
  "label": label,
  "url": url,
  "faviconHost": faviconHost,
  "faviconUrl": faviconUrl
}, index) => {
  const el = document.createElement("div");
  el.className = "shortcut";
  el.tabIndex = 0;
  el.setAttribute("role", "button");
  const img = document.createElement("img");
  img.className = "shortcut-icon";
  img.alt = '';
  img.loading = "lazy";
  img.decoding = "async";
  img.src = faviconUrl || "https://www.google.com/s2/favicons?domain=" + new URL(faviconHost || url).hostname + "&sz=128";
  img.onerror = () => {
    img.removeAttribute("src");
  };
  const span = document.createElement("span");
  span.className = "shortcut-title";
  span.textContent = label;
  const number = document.createElement("span");
  number.className = "shortcut-number";
  number.textContent = String(index + 1);
  const domain = document.createElement("span");
  domain.className = "shortcut-domain";
  try {
    domain.textContent = new URL(url).hostname.replace(/^www\./, "");
  } catch {
    domain.textContent = '';
  }
  el.appendChild(number);
  el.appendChild(img);
  el.appendChild(span);
  el.appendChild(domain);
  el.onclick = () => navigate(url);
  el.onkeydown = event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      navigate(url);
    }
  };
  grid.appendChild(el);
});
const sidebar = document.getElementById("settingsSidebar");
var _0xb9gc = 4;
const tabsEl = document.getElementById("settingsTabs");
_0xb9gc = 3;
const panelsEl = document.getElementById("settingsPanels");
const categories = Object.keys(SETTINGS);
const sectionEls = [];
function setActive(cat) {
  sidebar.querySelectorAll(".sidebar-item").forEach(el => el.classList.toggle("active", el.dataset.cat === cat));
  tabsEl.querySelectorAll(".tab-item").forEach(el => el.classList.toggle("active", el.dataset.cat === cat));
  panelsEl.querySelectorAll(".settings-panel-section").forEach(el => el.classList.toggle("active", el.dataset.section === cat));
}
let scrollLock = false;
let scrollLockTimer = null;
function scrollToCategory(cat) {
  setActive(cat);
  const localValue1 = panelsEl.querySelector(`[data-section="${cat}"]`);
  if (!localValue1) return;
  scrollLock = true;
  clearTimeout(scrollLockTimer);
  const localValue2 = localValue1.getBoundingClientRect();
  const localValue3 = panelsEl.getBoundingClientRect();
  panelsEl.scrollTo({
    "top": panelsEl.scrollTop + localValue2.top - localValue3.top,
    "behavior": "smooth"
  });
  scrollLockTimer = setTimeout(() => {
    scrollLock = false;
  }, 800);
}
panelsEl.addEventListener("scroll", () => {
  if (scrollLock) return;
  const containerTop = panelsEl.getBoundingClientRect().top;
  let active = categories[0];
  sectionEls.forEach(el => {
    if (el.getBoundingClientRect().top - containerTop < 4) active = el.dataset.section;
  });
  setActive(active);
});
const atlasSettingsLabels = {
  "Appearance": "General",
  "Privacy": "Privacy",
  "Proxy": "Connection",
  "Advanced": "Advanced"
};
categories.forEach((cat, i) => {
  const sItem = document.createElement("div");
  sItem.className = "sidebar-item" + (i === 0 ? " active" : '');
  sItem.textContent = atlasSettingsLabels[cat] || cat;
  sItem.dataset.cat = cat;
  sItem.onclick = () => scrollToCategory(cat);
  sidebar.appendChild(sItem);
  const tItem = document.createElement("button");
  tItem.className = "tab-item" + (i === 0 ? " active" : '');
  tItem.textContent = atlasSettingsLabels[cat] || cat;
  tItem.dataset.cat = cat;
  tItem.onclick = () => scrollToCategory(cat);
  tabsEl.appendChild(tItem);
  const section = document.createElement("div");
  section.className = "settings-panel-section";
  section.dataset.section = cat;
  sectionEls.push(section);
  const lbl = document.createElement("div");
  lbl.className = "category-label";
  lbl.textContent = atlasSettingsLabels[cat] || cat;
  section.appendChild(lbl);
  const rows = document.createElement("div");
  rows.className = "category-rows";
  Object.entries(SETTINGS[cat]).forEach(([key, s]) => {
    const row = document.createElement("div");
    row.className = "setting-row";
    const label = document.createElement("span");
    label.className = "setting-label";
    label.textContent = key;
    row.appendChild(label);
    if (s.type === "toggle") {
      const btn = document.createElement("button");
      btn.className = "toggle" + (s._value ? " on" : '');
      btn.onclick = () => {
        btn.classList.toggle("on");
        s._value = btn.classList.contains("on");
        s.callback(s._value);
        saveSettings();
      };
      row.appendChild(btn);
    } else if (s.type === "input") {
      const inp = document.createElement("input");
      inp.className = "setting-input";
      inp.placeholder = key;
      inp.value = s._value || '';
      inp.onchange = () => {
        s._value = inp.value;
        s.callback(inp.value);
        saveSettings();
      };
      row.appendChild(inp);
    } else if (s.type === "button") {
      const btn = document.createElement("button");
      btn.className = "setting-action-btn";
      btn.textContent = s.label;
      btn.onclick = () => s.action();
      row.appendChild(btn);
    } else if (s.type === "dropdown") {
      const sel = document.createElement("select");
      sel.className = "setting-select";
      s.options.forEach(opt => {
        const o = document.createElement("option");
        o.textContent = opt.name;
        o.value = JSON.stringify(opt);
        if (opt.name === s._value?.name) o.selected = true;
        sel.appendChild(o);
      });
      sel.onchange = () => {
        s._value = JSON.parse(sel.value);
        s.callback(s._value);
        saveSettings();
      };
      row.appendChild(sel);
    }
    rows.appendChild(row);
  });
  section.appendChild(rows);
  panelsEl.appendChild(section);
});
setActive(categories[0]);
const spacer = document.createElement("div");
spacer.className = "settings-spacer";
panelsEl.appendChild(spacer);
function setVh() {
  document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
}
setVh();
window.addEventListener("resize", setVh);
var _0x923f = 17;
let canvas = document.getElementById("stars");
_0x923f = 2;
let ctx = canvas.getContext("2d");
let W, H;
function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);
const starObjs = Array.from({
  "length": 180
}, () => {
  const base = Math.random() * 0.28 + 0.05;
  return {
    "x": Math.random(),
    "y": Math.random(),
    "r": Math.random() * 0.85 + 0.2,
    "base": base,
    "alpha": base,
    "blinking": Math.random() < 0.3,
    "blinkPeak": 0,
    "blinkDir": 1,
    "blinkSpeed": 0.012 + Math.random() * 0.022,
    "pauseMs": Math.random() * 6000
  };
});
var _0xe_0x949 = 14;
let shoots = [];
_0xe_0x949 = 12;
const homeStateEls = ["panel", "gamesScreen", "gamePlayer", "effectsScreen"].map(id => document.getElementById(id));
function starsShouldRun() {
  return !document.hidden && document.hasFocus() && isAtlasMenu(true);
}
const ATLAS_EXTERNAL_SCREENS = ["panel", "gamePlayer"];
const ATLAS_HOME_ONLY_SCREENS = ["gamesScreen", "effectsScreen"];
function isAtlasMenu(homePageOnly = false) {
  const localValue1 = homePageOnly ? [...ATLAS_EXTERNAL_SCREENS, ...ATLAS_HOME_ONLY_SCREENS] : ATLAS_EXTERNAL_SCREENS;
  return !localValue1.some(id => document.getElementById(id)?.classList.contains("open"));
}
var _0xbf_0x5a2 = 6;
const navActiveMap = [["gamesScreen", "navGames"], ["effectsScreen", "navEffects"], ["settingsScreen", "navSettings"]];
_0xbf_0x5a2 = 9;
function updateNavActive() {
  navActiveMap.forEach(([screenId, navId]) => {
    const localValue1 = document.getElementById(screenId);
    const localValue2 = document.getElementById(navId);
    if (localValue1 && localValue2) localValue2.classList.toggle("active", localValue1.classList.contains("open"));
  });
  window.updateAtlasChromeState?.();
}
updateNavActive();
let starsRafPending = false;
let last = 0;
var _0x43af3b = 10;
let starsGen = 0;
_0x43af3b = 2;
let starsActive = null;
function stopStars() {
  starsGen++;
  starsRafPending = false;
  last = 0;
  shoots = [];
  if (W && H) ctx.clearRect(0, 0, W, H);
}
function startStars() {
  if (starsRafPending) return;
  starsRafPending = true;
  const localValue1 = starsGen;
  requestAnimationFrame(ts => doFrame(ts, localValue1));
}
function updateStarsActive() {
  const localValue1 = starsShouldRun();
  if (localValue1 === starsActive) return;
  starsActive = localValue1;
  if (localValue1) {
    startStars();
    if (!shootTimer) scheduleShoot();
  } else {
    stopStars();
  }
}
function spawnShoot() {
  const localValue1 = Math.random() * W * 1.4 - W * 0.2;
  const localValue2 = Math.random() * H * 0.5;
  const localValue3 = Math.PI / 180 * (12 + Math.random() * 22);
  const localValue4 = 7 + Math.random() * 8;
  shoots.push({
    "x": localValue1,
    "y": localValue2,
    "vx": Math.cos(localValue3) * localValue4,
    "vy": Math.sin(localValue3) * localValue4,
    "len": 70 + Math.random() * 100,
    "life": 1,
    "decay": 0.016 + Math.random() * 0.014
  });
}
let nextShootAt = 0;
var _0x9bd9c = 16;
let shootTimer = null;
_0x9bd9c = 12;
function scheduleShoot() {
  shootTimer = null;
  if (!starsShouldRun()) return;
  const localValue1 = Date.now();
  if (shootingStarsEnabled && localValue1 >= nextShootAt) {
    spawnShoot();
    nextShootAt = localValue1 + 500 + Math.random() * 800;
  }
  shootTimer = setTimeout(scheduleShoot, 500 + Math.random() * 800);
}
document.addEventListener("visibilitychange", updateStarsActive);
window.addEventListener("blur", updateStarsActive);
window.addEventListener("focus", updateStarsActive);
var _0xf8e72e = 8;
const screenClassObserver = new MutationObserver(() => {
  updateNavActive();
  updateStarsActive();
});
_0xf8e72e = "ocilqm";
const settingsScreenEl = document.getElementById("settingsScreen");
[...homeStateEls, settingsScreenEl].forEach(el => {
  if (el) screenClassObserver.observe(el, {
    "attributes": true,
    "attributeFilter": ["class"]
  });
});
setInterval(updateStarsActive, 1000);
const STARS_MAX_DT = 50;
function doFrame(ts, gen) {
  if (gen !== starsGen) return;
  if (!starsRafPending || !starsShouldRun()) {
    stopStars();
    return;
  }
  if (!last) {
    last = ts;
    requestAnimationFrame(t => doFrame(t, gen));
    return;
  }
  const localValue1 = ts - last;
  if (localValue1 < 33) {
    requestAnimationFrame(t => doFrame(t, gen));
    return;
  }
  last = ts;
  const localValue2 = Math.min(localValue1, STARS_MAX_DT);
  ctx.clearRect(0, 0, W, H);
  if (starsEnabled) {
    starObjs.forEach(s => {
      if (s.blinking) {
        s.blinkPeak += s.blinkDir * s.blinkSpeed;
        if (s.blinkPeak >= 1) {
          s.blinkPeak = 1;
          s.blinkDir = -1;
        }
        if (s.blinkPeak <= 0) {
          s.blinkPeak = 0;
          s.blinkDir = 1;
          s.blinking = false;
          s.alpha = s.base;
          s.pauseMs = 1500 + Math.random() * 5000;
        } else {
          s.alpha = s.base + (0.92 - s.base) * Math.sin(s.blinkPeak * Math.PI);
        }
      } else {
        s.pauseMs -= localValue2;
        if (s.pauseMs <= 0) s.blinking = true;
      }
      ctx.beginPath();
      ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.alpha.toFixed(3)})`;
      ctx.fill();
    });
  }
  if (shootingStarsEnabled) {
    shoots = shoots.filter(s => s.life > 0);
    shoots.forEach(s => {
      const localValue3 = s.x - s.vx * (s.len / 10);
      const localValue4 = s.y - s.vy * (s.len / 10);
      const localValue5 = ctx.createLinearGradient(localValue3, localValue4, s.x, s.y);
      localValue5.addColorStop(0, "rgba(255,255,255,0)");
      localValue5.addColorStop(1, `rgba(255,255,255,${(s.life * 0.85).toFixed(3)})`);
      ctx.beginPath();
      ctx.moveTo(localValue3, localValue4);
      ctx.lineTo(s.x, s.y);
      ctx.strokeStyle = localValue5;
      ctx.lineWidth = 1.1;
      ctx.stroke();
      s.x += s.vx;
      s.y += s.vy;
      s.life -= s.decay;
    });
  }
  requestAnimationFrame(t => doFrame(t, gen));
}
updateStarsActive();
function getSearchEngine() {
  return SETTINGS.Proxy?.["Search Engine"]?._value?.url || "https://duckduckgo.com/?q=";
}
function resolveUrl(v) {
  if (!v) return null;
  if (v.startsWith("http://") || v.startsWith("https://")) return v;
  if (v.includes(".") && !v.includes(" ")) return "https://" + v;
  return getSearchEngine() + encodeURIComponent(v);
}
function updateLockIcon(url, argument1) {
  const localValue1 = document.getElementById("lockIcon");
  argument1 = 1;
  if (localValue1) localValue1.classList.toggle("secure", typeof url === "string" && url.startsWith("https://"));
}
function navigate(url) {
  const u = resolveUrl(url || document.getElementById("searchInput").value.trim());
  if (!u) return;
  document.getElementById("gamesScreen")?.classList.remove("open");
  document.getElementById("effectsScreen")?.classList.remove("open");
  document.getElementById("settingsScreen")?.classList.remove("open");
  document.getElementById("panel").classList.add("open");
  document.getElementById("bottomNav").classList.add("hidden");
  document.getElementById("addrInput").value = u;
  updateLockIcon(u);
  startFrameLoading();
  frame.go(u);
  collapseSearch();
}
var _0xc29fa = 9;
const searchWrap = document.getElementById("searchWrap");
_0xc29fa = 14;
const searchInput = document.getElementById("searchInput");
const acBox = document.getElementById("autocomplete");
let acSelected = -1;
let acItems = [];
let acTimer = null;
function expandSearch() {
  searchWrap.classList.add("expanded");
}
function collapseSearch() {
  searchWrap.classList.remove("expanded");
  searchWrap.classList.remove("has-ac");
  acBox.classList.remove("has-items");
  acBox.innerHTML = '';
  acItems = [];
  acSelected = -1;
}
searchInput.addEventListener("focus", expandSearch);
(shadowRoot || document).addEventListener("click", e => {
  if (!searchWrap.contains(e.target)) collapseSearch();
});
async function fetchAutocompletes(q) {
  if (!q) {
    acBox.innerHTML = '';
    acBox.classList.remove("has-items");
    searchWrap.classList.remove("has-ac");
    return;
  }
  try {
    const localValue1 = await fetch(sjEncode(`https://search.brave.com/api/suggest?q=${encodeURIComponent(q)}`));
    const localValue2 = await localValue1.json();
    const localValue3 = localValue2[1] ? localValue2[1].slice(0, 8) : [];
    renderSuggestions(localValue3);
  } catch (e) {
    acBox.innerHTML = '';
    acBox.classList.remove("has-items");
    searchWrap.classList.remove("has-ac");
  }
}
function renderSuggestions(list) {
  acBox.innerHTML = '';
  acItems = list;
  acSelected = -1;
  if (!list.length) {
    acBox.classList.remove("has-items");
    searchWrap.classList.remove("has-ac");
    return;
  }
  list.forEach(s => {
    const localValue1 = document.createElement("div");
    localValue1.className = "ac-item";
    const localValue2 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    localValue2.setAttribute("viewBox", "0 0 24 24");
    const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    c.setAttribute("cx", "11");
    c.setAttribute("cy", "11");
    c.setAttribute("r", "8");
    const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("d", "m21 21-4.35-4.35");
    localValue2.appendChild(c);
    localValue2.appendChild(p);
    localValue1.appendChild(localValue2);
    localValue1.appendChild(document.createTextNode(s));
    localValue1.onmousedown = e => {
      e.preventDefault();
      searchInput.value = s;
      navigate(s);
    };
    acBox.appendChild(localValue1);
  });
  acBox.classList.add("has-items");
  searchWrap.classList.add("has-ac");
}
function updateAutocompleteSelection(items) {
  items.forEach((el, i) => el.classList.toggle("selected", i === acSelected));
}
searchInput.addEventListener("input", () => {
  clearTimeout(acTimer);
  acSelected = -1;
  acTimer = setTimeout(() => fetchAutocompletes(searchInput.value.trim()), 180);
});
searchInput.addEventListener("keydown", e => {
  const items = acBox.querySelectorAll(".ac-item");
  if (e.key === "ArrowDown") {
    e.preventDefault();
    acSelected = Math.min(acSelected + 1, items.length - 1);
    updateAutocompleteSelection(items);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    acSelected = Math.max(acSelected - 1, -1);
    updateAutocompleteSelection(items);
  } else if (e.key === "Escape") {
    collapseSearch();
  } else if (e.key === "Enter") {
    navigate(acSelected >= 0 ? acItems[acSelected] : undefined);
  }
});
document.addEventListener("keydown", event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    const panelOpen = document.getElementById("panel")?.classList.contains("open");
    const target = panelOpen ? document.getElementById("addrInput") : searchInput;
    target.focus();
    target.select();
  }
});
let homeClickCount = 0,
  homeResetTimer = null;
let gameCloseClickCount = 0,
  gameCloseResetTimer = null;
function resetGameCloseConfirm() {
  gameCloseClickCount = 0;
  clearTimeout(gameCloseResetTimer);
  const localValue1 = document.getElementById("gamePlayerClose");
  const localValue2 = document.getElementById("gamePlayerCloseWrap");
  const localValue3 = document.getElementById("gameCloseCountdown");
  if (localValue1) localValue1.classList.remove("confirm");
  if (localValue2) localValue2.classList.remove("confirming");
  if (localValue3) {
    localValue3.style.animation = "none";
    localValue3.offsetHeight;
    localValue3.style.animation = '';
  }
}
function _armOrConfirmClose(onConfirm) {
  gameCloseClickCount++;
  if (gameCloseClickCount === 1) {
    const localValue1 = document.getElementById("gamePlayerClose");
    const localValue2 = document.getElementById("gamePlayerCloseWrap");
    if (localValue1) localValue1.classList.add("confirm");
    if (localValue2) localValue2.classList.add("confirming");
    gameCloseResetTimer = setTimeout(resetGameCloseConfirm, 5000);
  } else {
    resetGameCloseConfirm();
    onConfirm();
  }
}
function handleGamePlayerClose() {
  _armOrConfirmClose(closeGamePlayer);
}
function resetHomeConfirm() {
  homeClickCount = 0;
  clearTimeout(homeResetTimer);
  const localValue1 = document.getElementById("homeBtn");
  const localValue2 = document.getElementById("homeBtnWrap");
  const localValue3 = document.getElementById("homeCountdown");
  localValue1.classList.remove("confirm");
  localValue2.classList.remove("confirming");
  localValue3.style.animation = "none";
  localValue3.offsetHeight;
  localValue3.style.animation = '';
}
function handleHome() {
  homeClickCount++;
  if (homeClickCount === 1) {
    const localValue1 = document.getElementById("homeBtn");
    const localValue2 = document.getElementById("homeBtnWrap");
    localValue1.classList.add("confirm");
    localValue2.classList.add("confirming");
    homeResetTimer = setTimeout(resetHomeConfirm, 5000);
  } else {
    resetHomeConfirm();
    closePanel();
  }
}
function closePanel() {
  document.getElementById("panel").classList.remove("open");
  document.getElementById("bottomNav").classList.remove("hidden");
  document.getElementById("addrInput").value = '';
  updateLockIcon(null);
  try {
    frame.element.src = "about:blank";
  } catch {}
  stopFrameLoading();
  if (document.fullscreenElement) document.exitFullscreen();
}
let frameLoading = false;
function startFrameLoading() {
  frameLoading = true;
  document.getElementById("reloadBtn").classList.add("loading");
}
function stopFrameLoading() {
  frameLoading = false;
  document.getElementById("reloadBtn").classList.remove("loading");
}
function goBack() {
  try {
    frame && frame.back();
    startFrameLoading();
  } catch (e) {}
}
function goForward() {
  try {
    frame && frame.forward();
    startFrameLoading();
  } catch (e) {}
}
function reload() {
  if (frameLoading) {
    try {
      frame.element.contentWindow.stop();
    } catch (e) {}
    stopFrameLoading();
    return;
  }
  try {
    startFrameLoading();
    frame.reload();
  } catch (e) {
    stopFrameLoading();
  }
}
document.getElementById("addrInput").addEventListener("keydown", e => {
  if (e.key === "Enter") navigate(e.target.value.trim());
});
function toggleSettings() {
  const screen = document.getElementById("settingsScreen");
  const opening = !screen.classList.contains("open");
  if (opening) {
    document.getElementById("gamesScreen")?.classList.remove("open");
    document.getElementById("effectsScreen")?.classList.remove("open");
  }
  screen.classList.toggle("open", opening);
}
const fsEnter = `<path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/>`;
var _0x7863da = 6;
const fsExit = `<path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3"/>`;
_0x7863da = 0;
function toggleFullscreen() {
  const localValue1 = document.getElementById("frame");
  if (!document.fullscreenElement) localValue1.requestFullscreen();else document.exitFullscreen();
}
document.addEventListener("fullscreenchange", () => {
  document.getElementById("fsIcon").innerHTML = document.fullscreenElement ? fsExit : fsEnter;
});
frame = controller.createFrame(document.getElementById("frame"), {
  "plugins": [new $scramjetUtils.HttpCachePlugin(), new $scramjetUtils.UrlWatcherPlugin(href => {
    document.getElementById("addrInput").value = href;
    updateLockIcon(href);
    _checkExtensions(href);
  })]
});
frame.go("https://cloudflare.com/cdn-cgi/trace");
frame.element.addEventListener("load", function onLoad() {
  frame.element.src = "about:blank";
  frame.element.removeEventListener("load", onLoad);
});
frame.element.addEventListener("load", stopFrameLoading);
const link = document.querySelector("link[rel~='icon']") || document.createElement("link");
link.rel = "icon";
link.href = "data:,";
document.head.appendChild(link);
let focusTimeout = null;
document.addEventListener("visibilitychange", e => {
  if (!titleChangerEnabled) return;
  if (document.hidden) {
    document.title = "New Tab";
  } else {
    try {
      clearInterval(focusTimeout);
    } catch {}
    focusTimeout = null;
    document.title = "atlas";
  }
});
let _effectsVolume = 1;
var _0x4a_0xd44 = 17;
let _currentAudio = null;
_0x4a_0xd44 = 8;
let _effectsSearchTimer = null;
var _0x568fbb = 15;
let _effectsLoaded = false;
_0x568fbb = "qndipm";
let _effectsPage = 1;
let _effectsKeyword = null;
var _0x8d3e = 14;
let _effectsLoading = false;
_0x8d3e = 11;
var _0xaac8f = 13;
let _effectsExhausted = false;
_0xaac8f = "bghbqe";
let _effectsAll = [];
let _effectsLoadGen = 0;
var _0xf_0x133 = 9;
let _effectsScrollTop = 0;
_0xf_0x133 = 9;
function _makeGridVirtualizer(wrapId, sizerId, gridId, buildItem, onNearEnd, argument1, argument2, argument3, argument4, argument5, argument6, argument7, argument8, argument9, argument10, argument11, argument12) {
  const localValue1 = document.getElementById(wrapId);
  argument1 = 14;
  const localValue2 = document.getElementById(sizerId);
  argument2 = 10;
  const localValue3 = document.getElementById(gridId);
  argument3 = 2;
  let localValue4 = [];
  argument5 = 0;
  argument4 = 12;
  argument6 = 0;
  argument8 = 0;
  argument7 = 14;
  argument10 = 0;
  argument9 = 14;
  argument11 = 0;
  argument12 = 0;
  let localValue5 = false;
  function localValue6() {
    const localValue11 = getComputedStyle(localValue3);
    const localValue12 = localValue11.gridTemplateColumns.split(" ").filter(t => t && t !== "0px");
    argument5 = Math.max(1, localValue12.length);
    argument8 = parseFloat(localValue11.rowGap) || 0;
    argument10 = parseFloat(getComputedStyle(localValue2).paddingTop) || 0;
    const localValue13 = localValue3.firstElementChild;
    if (localValue13) {
      const h = localValue13.getBoundingClientRect().height;
      if (h > 0) argument6 = h + argument8;
    }
  }
  function localValue7(argument13) {
    if (argument6 > 0 && argument5 > 0) return;
    localValue6();
    if (argument6 > 0) return;
    if (!localValue4.length) return;
    localValue3.textContent = '';
    localValue3.style.top = argument10 + "px";
    const n = Math.min(localValue4.length, argument5);
    argument13 = "iqmjdl";
    for (let i = 0; i < n; i++) localValue3.appendChild(buildItem(localValue4[i], i));
    argument11 = 0;
    argument12 = n;
    localValue6();
  }
  function localValue8(s, e, argument13) {
    if (s >= argument12 || e <= argument11) {
      localValue3.textContent = '';
      for (let i = s; i < e; i++) localValue3.appendChild(buildItem(localValue4[i], i));
      argument11 = s;
      argument12 = e;
      return;
    }
    const localValue11 = Math.max(argument11, s);
    argument13 = 8;
    const localValue12 = Math.min(argument12, e);
    for (let k = argument11; k < localValue11; k++) localValue3.firstElementChild?.remove();
    for (let k = localValue12; k < argument12; k++) localValue3.lastElementChild?.remove();
    for (let i = localValue11 - 1; i >= s; i--) localValue3.prepend(buildItem(localValue4[i], i));
    for (let i = localValue12; i < e; i++) localValue3.appendChild(buildItem(localValue4[i], i));
    argument11 = s;
    argument12 = e;
  }
  function localValue9(argument13, argument14) {
    if (!localValue4.length || localValue1.classList.contains("flow")) return;
    localValue7();
    if (!argument6) return;
    const localValue11 = Math.ceil(localValue4.length / argument5);
    const localValue12 = Math.max(0, localValue11 * argument6 - argument8);
    const localValue13 = localValue12 + "px";
    if (localValue2.style.height !== localValue13) localValue2.style.height = localValue13;
    const localValue14 = localValue1.scrollTop;
    argument13 = 16;
    const localValue15 = localValue1.clientHeight || 1;
    let localValue16 = Math.floor((localValue14 - argument10) / argument6) - argument3;
    if (localValue16 < 0) localValue16 = 0;
    let localValue17 = Math.ceil((localValue14 - argument10 + localValue15) / argument6) + argument3;
    argument14 = "ngcepp";
    if (localValue17 > localValue11) localValue17 = localValue11;
    if (localValue17 <= localValue16) localValue17 = Math.min(localValue11, localValue16 + 1);
    const localValue18 = argument10 + localValue16 * argument6;
    const localValue19 = localValue18 + "px";
    if (localValue3.style.top !== localValue19) localValue3.style.top = localValue19;
    const s = localValue16 * argument5;
    const e = Math.min(localValue4.length, localValue17 * argument5);
    if (s !== argument11 || e !== argument12) localValue8(s, e);
    if (onNearEnd && localValue14 + localValue15 >= argument10 + localValue12 - localValue15) onNearEnd();
  }
  function localValue10() {
    if (localValue5) return;
    localValue5 = true;
    requestAnimationFrame(() => {
      localValue5 = false;
      localValue9();
    });
  }
  localValue1.addEventListener("scroll", localValue10, {
    "passive": true
  });
  window.addEventListener("resize", () => {
    if (!localValue4.length || localValue1.classList.contains("flow")) return;
    if (!localValue3.firstElementChild) {
      argument6 = 0;
      argument5 = 0;
      return;
    }
    const localValue11 = argument6 > 0 ? Math.floor(Math.max(0, localValue1.scrollTop - argument10) / argument6) * argument5 : 0;
    argument6 = 0;
    argument5 = 0;
    localValue3.textContent = '';
    argument11 = 0;
    argument12 = 0;
    localValue7();
    if (argument6 > 0) localValue1.scrollTop = argument10 + Math.floor(localValue11 / argument5) * argument6;
    localValue9();
  });
  return {
    setItems(next) {
      localValue4 = next || [];
      if (argument12 > localValue4.length) {
        localValue3.textContent = '';
        argument11 = 0;
        argument12 = 0;
      }
      localValue9();
    },
    restore(top) {
      if (!localValue4.length) return;
      localValue7();
      if (!argument6) return;
      const rows = Math.ceil(localValue4.length / argument5);
      const contentH = Math.max(0, rows * argument6 - argument8);
      localValue2.style.height = contentH + "px";
      const localValue11 = Math.max(0, argument10 * 2 + contentH - localValue1.clientHeight);
      localValue1.scrollTop = Math.min(top || 0, localValue11);
      localValue9();
    },
    clear() {
      localValue3.textContent = '';
      argument11 = 0;
      argument12 = 0;
    },
    reset() {
      localValue4 = [];
      localValue3.textContent = '';
      localValue2.style.height = '';
      localValue3.style.top = '';
      argument6 = 0;
      argument5 = 0;
      argument11 = 0;
      argument12 = 0;
    },
    enterFlow() {
      localValue1.classList.add("flow");
      localValue3.style.top = '';
      localValue2.style.height = '';
    },
    exitFlow() {
      localValue1.classList.remove("flow");
    },
    isMounted() {
      return !localValue1.classList.contains("flow") && !!localValue3.firstElementChild;
    },
    scrollTop() {
      return localValue1.scrollTop;
    }
  };
}
async function _getMyinstantsEffects(pageNum = 1, keyword = null, argument1) {
  const localValue1 = keyword ? `https://www.myinstants.com/en/search/?name=${encodeURIComponent(keyword)}&page=${pageNum}` : `https://www.myinstants.com/en/categories/sound%20effects/us/?page=${pageNum}`;
  const localValue2 = sjEncode(localValue1);
  argument1 = 10;
  const localValue3 = await fetch(localValue2);
  const localValue4 = await localValue3.text();
  const localValue5 = new DOMParser();
  const localValue6 = localValue5.parseFromString(localValue4, "text/html");
  const localValue7 = localValue6.querySelectorAll(".instant");
  const localValue8 = [];
  localValue7.forEach(instant => {
    const localValue9 = instant.querySelector(".instant-link");
    const localValue10 = instant.querySelector(".small-button");
    if (!localValue9 || !localValue10) return;
    const localValue11 = localValue9.textContent.trim();
    const localValue12 = localValue10.getAttribute("onclick");
    const localValue13 = localValue12?.match(new RegExp("play\\(['\"]([^'\"]+)['\"]", ""));
    if (!localValue13) return;
    const localValue14 = localValue13[1];
    const localValue15 = `https://www.myinstants.com${localValue14}`;
    const localValue16 = sjEncode(localValue15);
    localValue8.push({
      "title": localValue11,
      "src": localValue16
    });
  });
  return localValue8;
}
const _sblSrc = p => sjEncode(p.startsWith("http") ? p : "https://soundbuttonslab.com" + p);
async function _getSoundButtonsLabEffects(pageNum = 1, keyword = null, argument1) {
  const localValue1 = keyword ? `/api/v1/search-sound-button?q=${encodeURIComponent(keyword)}&page=${pageNum}` : `/api/v1/get-home-page-trending-soundboard-buttons?page=${pageNum}`;
  const localValue2 = await fetch(sjEncode("https://soundbuttonslab.com" + localValue1));
  argument1 = 0;
  if (!localValue2.ok) throw new Error(`HTTP ${localValue2.status} for ${localValue1}`);
  const localValue3 = await localValue2.json();
  return keyword ? localValue3.results.map(r => ({
    "title": r.title,
    "src": _sblSrc(r.file)
  })) : localValue3.results.data.map(r => ({
    "title": r.name,
    "src": _sblSrc(r.audio)
  }));
}
async function getEffects(pageNum = 1, keyword = null) {
  const [myinstants, soundButtonsLab] = await Promise.all([_getMyinstantsEffects(pageNum, keyword)["catch"](() => []), _getSoundButtonsLabEffects(pageNum, keyword)["catch"](() => [])]);
  return [...myinstants, ...soundButtonsLab];
}
const _effectsVirt = _makeGridVirtualizer("effectsGridWrap", "effectsGridSizer", "effectsGrid", e => _buildEffectButton(e.title, e.src), () => _loadEffectsPage());
function openEffects() {
  document.getElementById("gamesScreen")?.classList.remove("open");
  document.getElementById("settingsScreen")?.classList.remove("open");
  document.getElementById("effectsScreen").classList.add("open");
  if (!_effectsLoaded) {
    _effectsReload(null);
  } else if (!_effectsVirt.isMounted()) {
    _renderEffectsList();
    _effectsVirt.restore(_effectsScrollTop);
  }
}
function closeEffects() {
  const localValue1 = document.getElementById("effectsScreen");
  _effectsScrollTop = _effectsVirt.scrollTop();
  localValue1.classList.remove("open");
  setTimeout(() => {
    if (!localValue1.classList.contains("open")) {
      _effectsLoadGen++;
      _effectsLoading = false;
      _effectsVirt.clear();
    }
  }, 450);
}
function _renderEffectSkeletons(grid, count) {
  grid.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const localValue1 = document.createElement("div");
    localValue1.className = "effect-btn skeleton";
    grid.appendChild(localValue1);
  }
}
function _fillingEffectSkeletonCount(wrap, argument1, argument2, argument3) {
  argument1 = 100;
  argument3 = 8;
  argument2 = 6;
  const localValue1 = Math.max(1, Math.floor((wrap.clientWidth + argument3) / (argument1 + argument3)));
  const localValue2 = argument1;
  const localValue3 = Math.max(1, Math.ceil(wrap.clientHeight * 1.6 / (localValue2 + argument3)));
  return localValue1 * localValue3;
}
function _effectsReload(keyword, argument1) {
  _effectsPage = 1;
  _effectsKeyword = keyword || null;
  _effectsLoading = false;
  _effectsExhausted = false;
  _effectsAll = [];
  _effectsLoadGen++;
  _effectsScrollTop = 0;
  _effectsVirt.reset();
  _effectsVirt.enterFlow();
  const localValue1 = document.getElementById("effectsGridWrap");
  argument1 = "iehjke";
  _renderEffectSkeletons(document.getElementById("effectsGrid"), _fillingEffectSkeletonCount(localValue1));
  localValue1.scrollTop = 0;
  _loadEffectsPage();
}
function _renderEffectsList() {
  if (!_effectsAll.length) return;
  _effectsVirt.exitFlow();
  _effectsVirt.setItems(_effectsAll);
}
function _buildEffectButton(title, src, argument1, argument2, argument3, argument4) {
  argument1 = "http://www.w3.org/2000/svg";
  const localValue1 = document.createElement("button");
  argument2 = 9;
  localValue1.className = "effect-btn";
  const localValue2 = document.createElementNS(argument1, "svg");
  localValue2.setAttribute("viewBox", "0 0 24 24");
  const localValue3 = document.createElementNS(argument1, "polygon");
  localValue3.setAttribute("points", "11 5 6 9 2 9 2 15 6 15 11 19 11 5");
  const localValue4 = document.createElementNS(argument1, "path");
  argument3 = 8;
  localValue4.setAttribute("d", "M15.54 8.46a5 5 0 0 1 0 7.07");
  const localValue5 = document.createElementNS(argument1, "path");
  argument4 = 9;
  localValue5.setAttribute("d", "M19.07 4.93a10 10 0 0 1 0 14.14");
  localValue2.appendChild(localValue3);
  localValue2.appendChild(localValue4);
  localValue2.appendChild(localValue5);
  const localValue6 = document.createElement("span");
  localValue6.className = "effect-title";
  localValue6.textContent = title;
  const localValue7 = title.length;
  const localValue8 = localValue7 <= 6 ? 14 : localValue7 <= 12 ? 12 : localValue7 <= 20 ? 11 : localValue7 <= 30 ? 10 : 9;
  localValue6.style.fontSize = localValue8 + "px";
  localValue1.appendChild(localValue2);
  localValue1.appendChild(localValue6);
  const localValue9 = document.createElement("span");
  localValue9.className = "effect-action";
  localValue9.textContent = "Play";
  localValue1.appendChild(localValue9);
  localValue1.onclick = () => _playEffect(localValue1, src);
  if (_currentAudio && _currentAudio._effectSrc === src) localValue1.classList.add("playing");
  return localValue1;
}
async function _loadEffectsPage() {
  if (_effectsLoading || _effectsExhausted) return;
  _effectsLoading = true;
  const localValue1 = _effectsLoadGen;
  const localValue2 = document.getElementById("effectsGrid");
  try {
    const localValue3 = await getEffects(_effectsPage, _effectsKeyword);
    if (localValue1 !== _effectsLoadGen) {
      _effectsLoading = false;
      return;
    }
    if (!localValue3.length) {
      _effectsExhausted = true;
      if (_effectsPage === 1) {
        _effectsVirt.enterFlow();
        localValue2.innerHTML = "<div class=\"effects-loading\">Unable to load. Refresh and try again.</div>";
      }
      _effectsLoading = false;
      return;
    }
    _effectsAll.push(...localValue3);
    _effectsPage++;
    _effectsLoaded = true;
    _effectsLoading = false;
    _renderEffectsList();
  } catch (e) {
    if (localValue1 !== _effectsLoadGen) {
      _effectsLoading = false;
      return;
    }
    if (_effectsPage === 1) {
      _effectsVirt.enterFlow();
      localValue2.innerHTML = "<div class=\"effects-loading\">failed to load</div>";
    }
    _effectsLoading = false;
  }
}
function _clearPlayingBtns() {
  document.querySelectorAll(".effect-btn.playing").forEach(b => b.classList.remove("playing"));
}
function _playEffect(btn, src) {
  if (_currentAudio) {
    const localValue2 = _currentAudio._effectSrc === src;
    _currentAudio.pause();
    _currentAudio.currentTime = 0;
    _currentAudio = null;
    _clearPlayingBtns();
    if (localValue2) return;
  }
  const localValue1 = new Audio(src);
  localValue1.volume = _effectsVolume;
  localValue1._effectSrc = src;
  localValue1.play()["catch"](() => {});
  btn.classList.add("playing");
  _currentAudio = localValue1;
  localValue1.onended = () => {
    if (_currentAudio !== localValue1) return;
    _currentAudio = null;
    _clearPlayingBtns();
  };
}
function _updateVolumeTrack() {
  const localValue1 = document.getElementById("volumeSlider");
  const localValue2 = parseFloat(localValue1.value) * 100;
  localValue1.style.background = `linear-gradient(to right, var(--accent) ${localValue2}%, rgba(255,255,255,0.12) ${localValue2}%)`;
}
_updateVolumeTrack();
document.getElementById("volumeSlider").addEventListener("input", function () {
  _effectsVolume = parseFloat(this.value);
  if (_currentAudio) _currentAudio.volume = _effectsVolume;
  _updateVolumeTrack();
});
document.getElementById("effectsSearch").addEventListener("input", function () {
  clearTimeout(_effectsSearchTimer);
  const localValue1 = this.value.trim();
  _effectsSearchTimer = setTimeout(() => _effectsReload(localValue1 || null), 350);
});
var _0x3g2 = 4;
let _luminReady = false;
_0x3g2 = 11;
var _0x6gd58a = 10;
let _luminInitPromise = null;
_0x6gd58a = 2;
var _0x5_0x89g = 12;
let _gamesLoaded = false;
_0x5_0x89g = "jfbkko";
var _0x77e = 9;
let _gamesKeyword = null;
_0x77e = 0;
let _gamesSearchTimer = null;
var _0xf4c2df = 4;
let _gamesLoadGen = 0;
_0xf4c2df = 11;
let _gamesScrollTop = 0;
const _gamesImgCache = new WeakMap();
const GAMES_CACHE_TTL = 86400000;
let _gamesDBPromise = null;
function _gamesDB() {
  if (_gamesDBPromise) return _gamesDBPromise;
  _gamesDBPromise = new Promise((resolve, reject) => {
    const localValue1 = indexedDB.open("oCache", 1);
    localValue1.onupgradeneeded = () => localValue1.result.createObjectStore("cache");
    localValue1.onsuccess = () => resolve(localValue1.result);
    localValue1.onerror = () => {
      _gamesDBPromise = null;
      reject(localValue1.error);
    };
  });
  return _gamesDBPromise;
}
async function _loadGamesCacheEntry(key, isValid) {
  try {
    const localValue1 = await _gamesDB();
    const localValue2 = await new Promise((resolve, reject) => {
      const localValue3 = localValue1.transaction("cache", "readonly");
      const localValue4 = localValue3.objectStore("cache").get(key);
      localValue4.onsuccess = () => resolve(localValue4.result);
      localValue4.onerror = () => reject(localValue4.error);
    });
    if (!localValue2 || !isValid(localValue2.games) || Date.now() - localValue2.ts > GAMES_CACHE_TTL) return null;
    return localValue2.games;
  } catch (e) {
    return null;
  }
}
async function _saveGamesCacheEntry(key, games) {
  try {
    const localValue1 = await _gamesDB();
    await new Promise((resolve, reject) => {
      const localValue2 = localValue1.transaction("cache", "readwrite");
      localValue2.objectStore("cache").put({
        "ts": Date.now(),
        "games": games
      }, key);
      localValue2.oncomplete = resolve;
      localValue2.onerror = () => reject(localValue2.error);
    });
  } catch (e) {}
}
var _0xf4b84d = 12;
const _luminScriptPromise = loadScript("https://cdn.jsdelivr.net/gh/luminsdk/script/lumin.min.js");
_0xf4b84d = 16;
function _initLumin() {
  if (_luminReady) return Promise.resolve();
  if (_luminInitPromise) return _luminInitPromise;
  _luminInitPromise = _luminScriptPromise.then(() => Lumin.init({
    "headless": true
  })).then(() => {
    _luminReady = true;
  });
  return _luminInitPromise;
}
const GNM = {
  "index": "https://cdn.jsdelivr.net/gh/freebuisness/assets/zones.json",
  "html": "https://cdn.jsdelivr.net/gh/freebuisness/html@main",
  "covers": "https://cdn.jsdelivr.net/gh/freebuisness/covers@main"
};
const UGS = {
  "index": getAsset("ugs.json"),
  "html": "https://cdn.jsdelivr.net/gh/bubbls/ugs-singlefile/UGS-Files"
};
const CKV = {
  "index": getAsset("ckv.json"),
  "html": "https://cdn.jsdelivr.net/gh/WanoCapy/ChickenKingsVault@main",
  "covers": "https://cdn.jsdelivr.net/gh/WanoCapy/ChickenKingsVault@main"
};
const _gamesState = {
  "all": null,
  "fetchPromise": null,
  "matches": null
};
function _normalizeGameName(s) {
  return s.toLowerCase().replace(new RegExp("[^a-z0-9]+", "g"), '');
}
function _filterByName(list, keyword) {
  if (!keyword) return list;
  const k = _normalizeGameName(keyword);
  if (!k) return list;
  return list.filter(g => g._norm && g._norm.includes(k));
}
async function _fetchAllLuminGames(argument1) {
  await _initLumin();
  const localValue1 = [];
  argument1 = 12;
  let localValue2 = 1,
    localValue3 = 1;
  do {
    var localValue4 = 9;
    const localValue5 = await Lumin.getGames({
      "page": localValue2,
      "limit": 99999
    });
    localValue4 = 10;
    (localValue5.games || []).forEach(g => localValue1.push({
      "source": "lumin",
      "name": g.name,
      "id": g.id,
      "image_token": g.image_token
    }));
    localValue3 = localValue5.pages || 1;
    localValue2++;
  } while (localValue2 <= localValue3);
  return localValue1;
}
async function _fetchAllGnmGames() {
  const localValue1 = await (await fetch(GNM.index)).json();
  return localValue1.filter(g => g.url && g.url.startsWith("{HTML_URL}") && g.cover && !g.name.startsWith("[!]")).map(g => ({
    "source": "gnm",
    "name": g.name,
    "url": g.url,
    "cover": g.cover,
    "_html": GNM.html,
    "_covers": GNM.covers
  }));
}
async function _fetchListSource(meta, sourceName) {
  const localValue1 = await (await fetch(meta.index)).json();
  return localValue1.filter(g => g.url && g.url.startsWith("{HTML_URL}") && g.cover && !String(g.name).startsWith("[!]")).map(g => ({
    "source": sourceName,
    "name": g.name,
    "url": g.url,
    "cover": g.cover,
    "_html": meta.html,
    "_covers": meta.covers
  }));
}
function _finalizeGamesCatalog(all, argument1) {
  const localValue1 = new Map();
  argument1 = 12;
  all.forEach(g => {
    g._norm = _normalizeGameName(g.name);
    localValue1.set(g._norm, (localValue1.get(g._norm) || 0) + 1);
  });
  all.forEach(g => {
    g.displayName = g.name;
    if (localValue1.get(g._norm) > 1) {
      if (g.source === "gnm") {
        g.displayName = `${g.name} (gn-math)`;
      } else if (g.source === "ugs") {
        g.displayName = `${g.name} (ugs)`;
      } else if (g.source === "ckv") {
        g.displayName = `${g.name} (ckv)`;
      } else if (g.source === "lumin") {
        const localValue3 = g.id && g.id.includes("/") ? g.id.split("/")[0] : g.source;
        g.displayName = `${g.name} (${localValue3})`;
      }
    }
  });
  const localValue2 = new Intl.Collator(undefined, {
    "sensitivity": "base"
  });
  all.sort((a, b) => localValue2.compare(a.displayName, b.displayName));
  return all;
}
async function _ensureGamesCatalog() {
  if (!_gamesState.all) {
    if (!_gamesState.fetchPromise) {
      _gamesState.fetchPromise = (async () => {
        const localValue1 = await _loadGamesCacheEntry("games", g => g && Array.isArray(g.gnm));
        let localValue2 = false,
          localValue3 = false,
          localValue4 = false;
        const [lumin, gnm, ugs, ckv] = await Promise.all([_fetchAllLuminGames()["catch"](() => []), localValue1 ? localValue1.gnm : _fetchAllGnmGames()["catch"](() => {
          localValue2 = true;
          return [];
        }), localValue1 ? localValue1.ugs : _fetchListSource(UGS, "ugs")["catch"](() => {
          localValue3 = true;
          return [];
        }), localValue1 ? localValue1.ckv : _fetchListSource(CKV, "ckv")["catch"](() => {
          localValue4 = true;
          return [];
        })]);
        if (!localValue1 && !localValue2 && !localValue3 && !localValue4) _saveGamesCacheEntry("games", {
          "gnm": gnm,
          "ugs": ugs,
          "ckv": ckv
        });
        const localValue5 = new Set();
        const localValue6 = lumin.filter(g => {
          if (localValue5.has(g.id)) return false;
          localValue5.add(g.id);
          return true;
        });
        const localValue7 = [...localValue6, ...gnm, ...ugs, ...ckv];
        _gamesState.all = _finalizeGamesCatalog(localValue7);
      })();
      _gamesState.fetchPromise["catch"](() => {
        _gamesState.fetchPromise = null;
      });
    }
    await _gamesState.fetchPromise;
  }
  _gamesState.matches = _filterByName(_gamesState.all, _gamesKeyword);
}
function _gameCardImg(src, alt) {
  const localValue1 = document.createElement("img");
  localValue1.className = "game-card-img";
  localValue1.alt = alt;
  localValue1.loading = "lazy";
  localValue1.decoding = "async";
  localValue1.src = src;
  localValue1.onerror = () => {
    const localValue2 = document.createElement("div");
    localValue2.className = "game-card-placeholder";
    localValue1.replaceWith(localValue2);
  };
  return localValue1;
}
function _buildGameCard(g, argument1, argument2) {
  const localValue1 = document.createElement("button");
  localValue1.className = "game-card";
  const localValue2 = _gamesImgCache.get(g);
  argument1 = 9;
  if (localValue2) {
    localValue1.appendChild(_gameCardImg(localValue2, g.displayName));
  } else {
    const localValue5 = document.createElement("div");
    localValue5.className = "game-card-placeholder";
    localValue1.appendChild(localValue5);
    const localValue6 = _gamesLoadGen;
    _resolveGameImgSrc(g).then(src => {
      if (!src || localValue6 !== _gamesLoadGen || !localValue5.isConnected) return;
      localValue5.replaceWith(_gameCardImg(src, g.displayName));
    })["catch"](() => {});
  }
  const localValue3 = document.createElement("div");
  localValue3.className = "game-card-name";
  const localValue4 = document.createElement("span");
  argument2 = "afgpgf";
  localValue4.textContent = g.displayName;
  localValue3.appendChild(localValue4);
  localValue1.appendChild(localValue3);
  const localValue7 = document.createElement("span");
  localValue7.className = "game-card-source";
  localValue7.textContent = g.source === "cloud" ? "Cloud" : g.source === "lumin" ? "Atlas" : String(g.source || "Game").toUpperCase();
  localValue1.appendChild(localValue7);
  const localValue8 = document.createElement("span");
  localValue8.className = "game-card-action";
  localValue8.textContent = "Open";
  localValue1.appendChild(localValue8);
  localValue1.onclick = _gameCardOnClick(g);
  return localValue1;
}
async function _resolveGameImgSrc(g) {
  if (_gamesImgCache.has(g)) return _gamesImgCache.get(g);
  const localValue1 = g.source === "lumin" ? await Lumin.getImageUrl(g.image_token)["catch"](() => null) : g.cover.replace("{COVER_URL}", g._covers);
  if (localValue1) _gamesImgCache.set(g, localValue1);
  return localValue1;
}
function _gameCardOnClick(g) {
  if (g.source === "lumin") return () => openGamePlayer(g.id);
  const localValue1 = g.source === "ckv" ? `${g._html}/gamefiles/${encodeURIComponent(g.name)}.html` : g._html + "/" + g.url.replace("{HTML_URL}/", "");
  return () => openDirectGame(g.source, g.name, localValue1);
}
const _gamesVirt = _makeGridVirtualizer("gamesGridWrap", "gamesGridSizer", "gamesGrid", g => _buildGameCard(g));
function _updateGamesCount() {
  document.getElementById("gamesCount").textContent = _gamesState.matches ? _gamesState.matches.length.toLocaleString() + " Total" : '';
}
function _renderGameSkeletons(grid, count) {
  grid.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const localValue2 = document.createElement("div");
    localValue2.className = "game-card skeleton";
    var localValue1 = 2;
    const localValue3 = document.createElement("div");
    localValue1 = "odoclf";
    localValue3.className = "game-card-placeholder";
    localValue2.appendChild(localValue3);
    grid.appendChild(localValue2);
  }
}
function _fillingSkeletonCount(wrap, argument1, argument2, argument3, argument4) {
  argument1 = 155;
  argument2 = 8;
  const localValue1 = Math.max(1, Math.floor((wrap.clientWidth + argument2) / (argument1 + argument2)));
  argument3 = 4;
  const localValue2 = argument1 * 9 / 16 + 40;
  const localValue3 = Math.max(1, Math.ceil(wrap.clientHeight * 1.6 / (localValue2 + argument2)));
  argument4 = 4;
  return localValue1 * localValue3;
}
function _renderGamesList() {
  const localValue1 = document.getElementById("gamesGrid");
  _updateGamesCount();
  const localValue2 = _gamesState.matches;
  if (!localValue2 || !localValue2.length) {
    _gamesVirt.reset();
    _gamesVirt.enterFlow();
    localValue1.innerHTML = "<div class=\"games-loading\">no results</div>";
    return;
  }
  if (!document.getElementById("gamesScreen").classList.contains("open")) return;
  _gamesVirt.exitFlow();
  _gamesVirt.setItems(localValue2);
}
async function _loadFilteredGames(gen, grid, wrap, opts, argument1) {
  const localValue1 = opts.getList();
  argument1 = 9;
  if (localValue1) {
    _gamesVirt.exitFlow();
    _gamesState.matches = _filterByName(localValue1, _gamesKeyword);
    _renderGamesList();
    return;
  }
  _gamesVirt.enterFlow();
  _renderGameSkeletons(grid, _fillingSkeletonCount(wrap));
  document.getElementById("gamesCount").textContent = '';
  try {
    await opts.ensureLoaded();
  } catch (e) {
    if (gen === _gamesLoadGen) {
      _gamesVirt.enterFlow();
      grid.innerHTML = `<div class="games-loading">${opts.errorMsg}</div>`;
    }
    return;
  }
  if (gen !== _gamesLoadGen) return;
  opts.onLoaded?.();
  _gamesState.matches = _filterByName(opts.getList(), _gamesKeyword);
  _renderGamesList();
}
async function _gamesReload(keyword, argument1) {
  _gamesKeyword = keyword || null;
  const localValue1 = ++_gamesLoadGen;
  _gamesScrollTop = 0;
  const localValue2 = document.getElementById("gamesGrid");
  argument1 = 6;
  const localValue3 = document.getElementById("gamesGridWrap");
  _gamesVirt.reset();
  localValue3.scrollTop = 0;
  if (_cloudEnabled) {
    return _loadFilteredGames(localValue1, localValue2, localValue3, {
      "getList": () => _cloudGames.length ? _cloudGames : null,
      "ensureLoaded": async () => {
        _cloudGames = await loadCloudGames();
      },
      "errorMsg": 'failed to load cloud games'
    });
  }
  return _loadFilteredGames(localValue1, localValue2, localValue3, {
    "getList": () => _gamesState.all,
    "ensureLoaded": _ensureGamesCatalog,
    "errorMsg": 'failed to load',
    "onLoaded": () => {
      _gamesLoaded = true;
    }
  });
}
function openGames() {
  document.getElementById("effectsScreen")?.classList.remove("open");
  document.getElementById("settingsScreen")?.classList.remove("open");
  document.getElementById("gamesScreen").classList.add("open");
  if (!_gamesLoaded) {
    _gamesReload(null);
  } else if (!_gamesVirt.isMounted()) {
    _renderGamesList();
    _gamesVirt.restore(_gamesScrollTop);
  }
}
function closeGames(argument1) {
  const localValue1 = document.getElementById("gamesScreen");
  argument1 = "fgjigb";
  _gamesScrollTop = _gamesVirt.scrollTop();
  localValue1.classList.remove("open");
  setTimeout(() => {
    if (!localValue1.classList.contains("open")) {
      _gamesVirt.clear();
    }
  }, 450);
}
let _gamePlayerGen = 0;
let _skipNextGameAdBlockInject = false;
function _openGamePlayerShell(label) {
  _gamePlayerGen++;
  const localValue1 = _gamePlayerGen;
  const localValue2 = document.getElementById("gamePlayer");
  const localValue3 = document.getElementById("gameFrame");
  const localValue4 = document.getElementById("gamePlayerLoading");
  const localValue5 = document.getElementById("gamePlayerId");
  if (_cloudSession) teardownCloud(true);
  document.getElementById("cloudVideoWrap").style.display = "none";
  _exitStaleFullscreen(localValue2);
  localValue5.textContent = label;
  localValue3.style.display = "none";
  localValue3.src = "about:blank";
  localValue4.style.display = "flex";
  localValue4.textContent = "loading…";
  localValue2.classList.add("open");
  return {
    "gf": localValue3,
    "loading": localValue4,
    "gen": localValue1
  };
}
function _dirOf(url) {
  const u = new URL(url);
  u.search = '';
  u.hash = '';
  u.pathname = u.pathname.substring(0, u.pathname.lastIndexOf("/") + 1);
  return u.toString();
}
function _withBaseHref(html, baseUrl) {
  if (new RegExp("<base[^>]*>", "i").test(html)) return html;
  if (new RegExp("<head[^>]*>", "i").test(html)) return html.replace(new RegExp("<head([^>]*)>", "i"), `<head$1><base href="${baseUrl}">`);
  if (new RegExp("<html[^>]*>", "i").test(html)) return html.replace(new RegExp("<html([^>]*)>", "i"), `<html$1><head><base href="${baseUrl}"></head>`);
  return `<base href="${baseUrl}">` + html;
}
function _gameAdBlockInit(argument1) {
  const localValue1 = window.atob;
  argument1 = 7;
  window.atob = function (s) {
    const d = localValue1(s);
    return typeof d === "string" && d.includes("[AV][boot] ") ? null : d;
  };
  const localValue2 = setInterval(() => {
    try {
      document.getElementById("sidebarad1")?.remove();
      document.getElementById("sidebarad2")?.remove();
      clearInterval(localValue2);
    } catch {}
  }, 1000);
}
function _ADBLOCKIT(html) {
  const localValue1 = `<script>(${_gameAdBlockInit.toString()})();</script>`;
  if (new RegExp("<head[^>]*>", "i").test(html)) return html.replace(new RegExp("<head([^>]*)>", "i"), `<head$1>${localValue1}`);
  if (new RegExp("<html[^>]*>", "i").test(html)) return html.replace(new RegExp("<html([^>]*)>", "i"), `<html$1><head>${localValue1}</head>`);
  return localValue1 + html;
}
function _injectGameAdBlock(iframe) {
  try {
    const localValue1 = iframe.contentDocument || iframe.contentWindow.document;
    if (!localValue1) return;
    const s = localValue1.createElement("script");
    s.textContent = `(${_gameAdBlockInit.toString()})();`;
    localValue1.documentElement.appendChild(s);
  } catch (e) {}
}
document.getElementById("gameFrame").addEventListener("load", function () {
  if (_skipNextGameAdBlockInject) {
    _skipNextGameAdBlockInject = false;
    return;
  }
  _injectGameAdBlock(this);
});
function _unwrapModuleContent(html, argument1) {
  const localValue1 = html.match(new RegExp("<Content[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*<\\/Content>", "i"));
  argument1 = 15;
  if (localValue1) return localValue1[1];
  if (new RegExp("^\\s*<Module>", "i").test(html)) {
    const localValue2 = html.search(new RegExp("<!doctype html|<html", "i"));
    if (localValue2 !== -1) return html.slice(localValue2);
  }
  return html;
}
async function openDirectGame(source, name, url) {
  const {
    "gf": gf,
    "loading": loading,
    "gen": gen
  } = _openGamePlayerShell(`${source}/${name}`);
  try {
    const localValue1 = await fetch(url);
    const localValue2 = _unwrapModuleContent(await localValue1.text());
    if (gen !== _gamePlayerGen) return;
    gf.onload = () => {
      if (gen !== _gamePlayerGen) return;
      loading.style.display = "none";
      gf.style.display = "block";
    };
    const localValue3 = gf.contentDocument;
    localValue3.open();
    _skipNextGameAdBlockInject = true;
    localValue3.write(_ADBLOCKIT(_withBaseHref(localValue2, _dirOf(url))));
    localValue3.close();
  } catch (e) {
    if (gen === _gamePlayerGen) loading.textContent = "failed to load";
  }
}
async function openGamePlayer(gameId) {
  const {
    "gf": gf,
    "loading": loading,
    "gen": gen
  } = _openGamePlayerShell(gameId);
  try {
    await _initLumin();
    const {
      "url": url
    } = await Lumin.getGameUrl(gameId);
    const localValue1 = await fetch(url);
    const localValue2 = await localValue1.text();
    if (gen !== _gamePlayerGen) return;
    gf.onload = () => {
      if (gen !== _gamePlayerGen) return;
      loading.style.display = "none";
      gf.style.display = "block";
    };
    const localValue3 = gf.contentDocument;
    localValue3.open();
    _skipNextGameAdBlockInject = true;
    localValue3.write(_ADBLOCKIT(_withBaseHref(localValue2, _dirOf(url))));
    localValue3.close();
  } catch (e) {
    if (gen === _gamePlayerGen) loading.textContent = "failed to load";
  }
}
function closeGamePlayer() {
  resetGameCloseConfirm();
  _cloudEndedActive = false;
  const localValue1 = document.getElementById("gamePlayer");
  const localValue2 = document.getElementById("gameFrame");
  const localValue3 = document.getElementById("cloudVideoWrap");
  const localValue4 = document.getElementById("gamePlayerLoading");
  localValue1.classList.remove("open");
  localValue2.src = "about:blank";
  localValue2.style.display = "none";
  localValue3.style.display = "none";
  localValue4.style.display = "flex";
  localValue4.textContent = "loading…";
  document.getElementById("gamePlayerId").textContent = '';
  document.getElementById("gamePlayerTimeLeft").textContent = '';
  try {
    Lumin.endGame();
  } catch (e) {}
  if (_cloudEnabled && !_cloudSession) {
    _gamesState.matches = _filterByName(_cloudGames, _gamesKeyword);
    _updateGamesCount();
    _gamesVirt.setItems(_gamesState.matches);
  }
}
function _exitStaleFullscreen(expectedTarget) {
  if (document.fullscreenElement && document.fullscreenElement !== expectedTarget) {
    document.exitFullscreen()["catch"](() => {});
  }
}
function toggleGameFullscreen() {
  const localValue1 = _cloudSession ? document.getElementById("cloudVideoWrap") : document.getElementById("gamePlayer");
  if (!document.fullscreenElement) localValue1.requestFullscreen();else document.exitFullscreen();
}
function _lockCloudKeyboard() {
  try {
    navigator.keyboard?.lock?.();
  } catch {}
}
function _unlockCloudKeyboard() {
  try {
    navigator.keyboard?.unlock?.();
  } catch {}
}
document.addEventListener("fullscreenchange", function _gfsFc() {
  const localValue1 = document.getElementById("gamePlayerFsIcon");
  if (localValue1) {
    localValue1.innerHTML = document.fullscreenElement ? "<path d=\"M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3\"/>" : "<path d=\"M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3\"/>";
  }
  if (_cloudSession) {
    if (document.fullscreenElement) _lockCloudKeyboard();else _unlockCloudKeyboard();
  }
}, true);
document.getElementById("gamesSearch").addEventListener("input", function () {
  clearTimeout(_gamesSearchTimer);
  const localValue1 = this.value.trim();
  _gamesSearchTimer = setTimeout(() => _gamesReload(localValue1 || null), 350);
});
var _0x1a_0x121 = 7;
let _cloudEnabled = false;
_0x1a_0x121 = 0;
let _cloudGames = [];
let _cloudSession = null;
var _0xdb39df = 1;
let _cloudPc = null;
_0xdb39df = 7;
let _cloudDc = null;
var _0x9_0x15e = 10;
let _cloudWs = null;
_0x9_0x15e = 12;
var _0x8b1df = 5;
let _cloudTimers = [];
_0x8b1df = 4;
let _cloudInputActive = false;
var _0x51fb7e = 10;
let _cloudInputHandlers = null;
_0x51fb7e = 9;
let _cloudStarting = false;
let _cloudJitterHandlers = null;
let _cloudEndedActive = false;
let _cloudPendingCandidates = [];
function getStratusBase(argument1, argument2) {
  argument1 = 2;
  if (window.devMode) {
    argument2 = window.serverList?.[0] || "cdn.northstreetumc.org";
  } else if (window.wispServer?.includes("://")) {
    argument2 = window.wispServer.split("://")[1].split("/")[0];
  } else {
    argument2 = "cdn.northstreetumc.org";
  }
  if (argument2.includes("://")) return argument2.replace("/wi/", "/stratus");
  return `https://${argument2}/stratus`;
}
async function stratusApi(path, method = "GET", body, argument1) {
  const localValue1 = getStratusBase();
  argument1 = 6;
  const localValue2 = await fetch(`${localValue1}/${path}`, {
    "method": method,
    "headers": body ? {
      'content-type': 'application/json'
    } : undefined,
    "body": body ? JSON.stringify(body) : undefined
  });
  const localValue3 = await localValue2.json()["catch"](() => ({}));
  if (!localValue2.ok && !localValue3.error) localValue3.error = `HTTP ${localValue2.status}`;
  return localValue3;
}
function setCloudPhase(name, detail, spin) {
  document.getElementById("cloudPhase").textContent = name;
  document.getElementById("cloudPhaseDetail").textContent = detail || '';
  document.getElementById("cloudSpinner").style.display = spin ? "block" : "none";
}
function _quitCloudSession(uuid) {
  if (!uuid) return;
  fetch(`${getStratusBase()}/session/${uuid}/quit`, {
    "method": "POST",
    "keepalive": true
  })["catch"](() => {});
}
function teardownCloud(quit) {
  if (quit && _cloudSession) _quitCloudSession(_cloudSession.uuid);
  _cloudInputActive = false;
  _cloudStarting = false;
  _unlockCloudKeyboard();
  if (_cloudInputHandlers) {
    const {
      "mouseMoveHandler": mouseMoveHandler,
      "mouseButtonHandler": mouseButtonHandler,
      "contextMenuHandler": contextMenuHandler,
      "wheelHandler": wheelHandler,
      "videoClickHandler": videoClickHandler,
      "keyDownHandler": keyDownHandler,
      "keyUpHandler": keyUpHandler,
      "video": video,
      "pointerLockChangeHandler": pointerLockChangeHandler,
      "relockHint": relockHint,
      "invalidateRect": invalidateRect
    } = _cloudInputHandlers;
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mousedown", mouseButtonHandler);
    document.removeEventListener("mouseup", mouseButtonHandler);
    document.removeEventListener("contextmenu", contextMenuHandler);
    document.removeEventListener("wheel", wheelHandler);
    video.removeEventListener("click", videoClickHandler);
    document.removeEventListener("keydown", keyDownHandler, true);
    document.removeEventListener("keyup", keyUpHandler, true);
    document.removeEventListener("pointerlockchange", pointerLockChangeHandler);
    window.removeEventListener("resize", invalidateRect);
    relockHint.removeEventListener("click", videoClickHandler);
    relockHint.style.display = "none";
    _cloudInputHandlers = null;
  }
  if (_cloudJitterHandlers) {
    const {
      "video": video,
      "bumpJitterTarget": bumpJitterTarget
    } = _cloudJitterHandlers;
    video.removeEventListener("waiting", bumpJitterTarget);
    video.removeEventListener("stalled", bumpJitterTarget);
    _cloudJitterHandlers = null;
  }
  _cloudTimers.forEach(t => {
    clearInterval(t);
    clearTimeout(t);
  });
  _cloudTimers = [];
  try {
    _cloudDc && _cloudDc.close();
  } catch {}
  try {
    _cloudPc && _cloudPc.close();
  } catch {}
  try {
    _cloudWs && _cloudWs.close();
  } catch {}
  _cloudDc = null;
  _cloudPc = null;
  _cloudWs = null;
  _cloudSession = null;
  _cloudPendingCandidates = [];
  document.exitPointerLock?.();
  const localValue1 = document.getElementById("cloudVideo");
  if (localValue1) localValue1.srcObject = null;
}
let _cloudGamesFetchPromise = null;
async function loadCloudGames(argument1) {
  const localValue1 = await _loadGamesCacheEntry("cloudGames", Array.isArray);
  argument1 = 3;
  if (localValue1) return localValue1;
  if (!_cloudGamesFetchPromise) {
    _cloudGamesFetchPromise = (async () => {
      const r = await stratusApi("games");
      if (r.error) throw new Error(r.error);
      const localValue2 = (r.games || []).map(g => ({
        "source": 'cloud',
        "name": g.name,
        "key": g.key,
        "cover": g.cover || g.image,
        "displayName": g.name,
        "_norm": _normalizeGameName(g.name)
      }));
      await _saveGamesCacheEntry("cloudGames", localValue2);
      return localValue2;
    })();
    _cloudGamesFetchPromise["catch"](() => {
      _cloudGamesFetchPromise = null;
    });
  }
  return _cloudGamesFetchPromise;
}
function toggleCloudGames() {
  _cloudEnabled = !_cloudEnabled;
  document.getElementById("cloudToggle").classList.toggle("on", _cloudEnabled);
  _gamesReload(_gamesKeyword);
}
document.getElementById("cloudToggle").addEventListener("click", toggleCloudGames);
async function startCloudGame(gameKey, gameName, argument1) {
  if (_cloudStarting) return;
  _cloudStarting = true;
  resetGameCloseConfirm();
  teardownCloud(true);
  _gamePlayerGen++;
  const localValue1 = document.getElementById("gamePlayer");
  const localValue2 = document.getElementById("gameFrame");
  const localValue3 = document.getElementById("cloudVideoWrap");
  const localValue4 = document.getElementById("cloudVideo");
  const localValue5 = document.getElementById("cloudOverlay");
  const localValue6 = document.getElementById("gamePlayerLoading");
  argument1 = 3;
  const localValue7 = document.getElementById("gamePlayerId");
  localValue7.textContent = `cloud/${gameName}`;
  document.getElementById("gamePlayerTimeLeft").textContent = '';
  _exitStaleFullscreen(localValue3);
  localValue2.style.display = "none";
  localValue2.src = "about:blank";
  localValue6.style.display = "none";
  localValue3.style.display = "flex";
  localValue4.srcObject = null;
  localValue4.muted = true;
  localValue5.style.display = "flex";
  localValue1.classList.add("open");
  try {
    const localValue8 = await stratusApi("status");
    const localValue9 = localValue8.pool?.idle || 0;
    setCloudPhase("requesting game", `${localValue9} idle accounts`, true);
    const s = await stratusApi("session", "POST", {
      "game_key": gameKey
    });
    if (s.error) throw new Error(s.error);
    _cloudSession = {
      "uuid": s.uuid,
      "state": s.state,
      "gameKey": gameKey,
      "deadlineAt": null
    };
    if (s.state === "queued") {
      setCloudPhase("queued", `position #${s.queue_pos ?? "?"}`, false);
      while (_cloudSession && _cloudSession.uuid === s.uuid) {
        await new Promise(r => _cloudTimers.push(setTimeout(r, 2000)));
        if (!_cloudSession || _cloudSession.uuid !== s.uuid) break;
        const localValue12 = await stratusApi(`session/${_cloudSession.uuid}`);
        if (localValue12.error) throw new Error(localValue12.error);
        if (localValue12.state === "finished_queue") break;
        setCloudPhase("queued", `position #${localValue12.queue_pos ?? "?"}`, false);
      }
      if (!_cloudSession || _cloudSession.uuid !== s.uuid) return;
    }
    setCloudPhase("starting", "booting instance", true);
    const localValue10 = await stratusApi(`session/${_cloudSession.uuid}/start`, "POST", {});
    if (localValue10.error) throw new Error(localValue10.error);
    _cloudSession.deadlineAt = Date.now() + localValue10.max_seconds * 1000;
    _cloudSession.signalingWs = localValue10.signaling_ws;
    _cloudSession.iceServers = localValue10.ice_servers;
    await connectCloudSignaling(localValue10.signaling_ws, localValue10.ice_servers);
    const localValue11 = setInterval(() => {
      if (!_cloudSession || !_cloudSession.deadlineAt) return;
      const localValue12 = Math.max(0, Math.round((_cloudSession.deadlineAt - Date.now()) / 1000));
      document.getElementById("gamePlayerTimeLeft").textContent = `${Math.floor(localValue12 / 60)}:${String(localValue12 % 60).padStart(2, "0")}`;
    }, 500);
    _cloudTimers.push(localValue11);
  } catch (e) {
    if (_cloudSession) _quitCloudSession(_cloudSession.uuid);
    _cloudSession = null;
    setCloudPhase("error", e.message, false);
    _cloudStarting = false;
  }
}
const SOCKET_RECONNECT_DELAY_MS = 2000;
var _0xg4d6ea = 3;
const SOCKET_RECONNECT_MAX_TRIES = 2;
_0xg4d6ea = "pikabf";
function connectCloudSignaling(signalingWs, iceServers, isReconnect) {
  return new Promise((resolve, reject) => {
    const localValue1 = signalingWs.split("/").pop();
    const localValue2 = getStratusBase();
    const localValue3 = new URL(localValue2);
    const localValue4 = (localValue3.protocol === "https:" ? "wss://" : "ws://") + localValue3.host + localValue3.pathname.replace(new RegExp("\\/$", ""), '') + "/signal/" + localValue1;
    const localValue5 = new WebSocket(localValue4);
    _cloudWs = localValue5;
    localValue5.onopen = () => {
      if (_cloudWs !== localValue5) return;
      if (!isReconnect) setCloudPhase("starting", "signal connected, waiting for instance", true);
      _flushPendingCandidates();
    };
    localValue5.onerror = () => {
      if (_cloudWs === localValue5 && !isReconnect) reject(new Error("signaling failed"));
    };
    localValue5.onclose = () => {
      if (_cloudWs !== localValue5) return;
      _cloudWs = null;
      if (_cloudSession && _cloudPc) attemptCloudReconnect();else if (!isReconnect) reject(new Error("signaling closed"));
    };
    localValue5.onmessage = async ev => {
      if (_cloudWs !== localValue5) return;
      let m;
      try {
        m = JSON.parse(ev.data);
      } catch {
        return;
      }
      switch (m.type) {
        case "game_ready":
          if (!_cloudPc) {
            setCloudPhase("connecting", "negotiating webrtc", true);
            await createCloudPeer(iceServers);
          }
          resolve();
          break;
        case "rtc_answer":
          try {
            await _cloudPc.setRemoteDescription(new RTCSessionDescription(m.sdp));
          } catch {}
          break;
        case "rtc_candidate":
          try {
            await _cloudPc.addIceCandidate(new RTCIceCandidate(m.candidate));
          } catch {}
          break;
        case "ping":
          if (localValue5.readyState === 1) localValue5.send(JSON.stringify({
            "type": "ping"
          }));
          break;
        case "time_left":
          if (_cloudSession && typeof m.time_left === "number") {
            _cloudSession.deadlineAt = Date.now() + m.time_left * 1000;
          }
          break;
        case "game_cap":
          showCloudEndedScreen("time is up", m.message);
          break;
        case "game_ended":
          showCloudEndedScreen("session ended", m.message);
          break;
      }
    };
  });
}
function attemptCloudReconnect(argument1) {
  const localValue1 = _cloudSession;
  if (!localValue1 || localValue1.reconnecting) return;
  localValue1.reconnecting = true;
  localValue1.reconnectTries = 0;
  let localValue2 = false;
  document.getElementById("cloudOverlay").style.display = "flex";
  const localValue3 = document.getElementById("cloudRelockHint");
  if (localValue3) localValue3.style.display = "none";
  setCloudPhase("reconnecting", "signal lost, retrying…", true);
  const localValue4 = () => {
    if (!_cloudSession || _cloudSession !== localValue1 || localValue2) return;
    localValue1.reconnectTries++;
    connectCloudSignaling(localValue1.signalingWs, localValue1.iceServers, true).then(() => {
      if (localValue2 || !_cloudSession || _cloudSession !== localValue1) return;
      localValue2 = true;
      localValue1.reconnecting = false;
      if (_cloudPc && _cloudPc.connectionState === "connected") {
        document.getElementById("cloudOverlay").style.display = "none";
      } else {
        setCloudPhase("connecting", "reconnected, restoring stream…", true);
      }
    })["catch"](() => {});
    const localValue5 = setTimeout(() => {
      if (localValue2 || !_cloudSession || _cloudSession !== localValue1) return;
      if (localValue1.reconnectTries >= SOCKET_RECONNECT_MAX_TRIES) {
        localValue2 = true;
        showCloudEndedScreen("session ended", "lost connection to the game server");
        return;
      }
      try {
        _cloudWs && _cloudWs.close();
      } catch {}
      _cloudWs = null;
      localValue4();
    }, SOCKET_RECONNECT_DELAY_MS);
    _cloudTimers.push(localValue5);
  };
  argument1 = 5;
  localValue4();
}
function showCloudEndedScreen(title, detail) {
  if (!_cloudSession) return;
  teardownCloud(true);
  _cloudEndedActive = true;
  const localValue1 = document.getElementById("cloudVideoWrap");
  const localValue2 = document.getElementById("cloudOverlay");
  localValue1.style.display = "flex";
  localValue2.style.display = "flex";
  setCloudPhase(title, detail || '', false);
}
function cloudSigSend(obj) {
  if (_cloudWs && _cloudWs.readyState === 1) {
    _cloudWs.send(JSON.stringify(obj));
  } else if (obj.type === "rtc_candidate") {
    _cloudPendingCandidates.push(obj);
  }
}
function _flushPendingCandidates() {
  if (!_cloudPendingCandidates.length) return;
  const localValue1 = _cloudPendingCandidates;
  _cloudPendingCandidates = [];
  localValue1.forEach(obj => cloudSigSend(obj));
}
async function createCloudPeer(iceServers, argument1, argument2, argument3, argument4, argument5, argument6, argument7, argument8, argument9, argument10) {
  const localValue1 = document.getElementById("cloudVideo");
  argument1 = 3;
  _cloudPc = new RTCPeerConnection({
    "iceServers": iceServers,
    "bundlePolicy": "max-bundle",
    "rtcpMuxPolicy": "require",
    "iceCandidatePoolSize": 4
  });
  _cloudPc.addTransceiver("audio", {
    "direction": 'recvonly'
  });
  const localValue2 = _cloudPc.addTransceiver("video", {
    "direction": "recvonly"
  });
  try {
    const localValue17 = RTCRtpReceiver.getCapabilities?.("video");
    if (localValue17?.codecs?.length && localValue2.setCodecPreferences) {
      const localValue18 = localValue17.codecs.filter(c => new RegExp("h264", "i").test(c.mimeType));
      const localValue19 = localValue17.codecs.filter(c => new RegExp("av1", "i").test(c.mimeType));
      const localValue20 = localValue17.codecs.filter(c => !new RegExp("h264|av1", "i").test(c.mimeType));
      let localValue21 = false;
      try {
        if (localValue19.length && navigator.mediaCapabilities?.decodingInfo) {
          const localValue22 = await navigator.mediaCapabilities.decodingInfo({
            "type": "webrtc",
            "video": {
              "contentType": 'video/AV1',
              "width": 1920,
              "height": 1080,
              "bitrate": 4000000,
              "framerate": 30
            }
          });
          localValue21 = !!(localValue22.powerEfficient && localValue22.smooth);
        }
      } catch {}
      localValue2.setCodecPreferences(localValue21 ? [...localValue19, ...localValue18, ...localValue20] : [...localValue18, ...localValue19, ...localValue20]);
    }
  } catch {}
  _cloudDc = _cloudPc.createDataChannel("JYSDK", {
    "id": 1,
    "ordered": false,
    "maxRetransmits": 0,
    "priority": "high"
  });
  _cloudDc.onopen = () => {};
  const localValue3 = _cloudPc;
  const localValue4 = _cloudDc;
  argument2 = "hbcpee";
  localValue4.onclose = () => {
    if (_cloudDc !== localValue4 || !_cloudSession) return;
    showCloudEndedScreen("session ended", "lost the input channel");
  };
  localValue4.onerror = () => {
    if (_cloudDc !== localValue4 || !_cloudSession) return;
    showCloudEndedScreen("session ended", "input channel error");
  };
  argument3 = 0;
  argument4 = 200;
  argument5 = 40;
  let localValue5 = argument3;
  argument6 = 8;
  let localValue6 = null;
  argument7 = "cobjoj";
  let localValue7 = null;
  argument8 = 6;
  let localValue8 = null;
  const localValue9 = () => {
    for (const localValue17 of [localValue6, localValue7]) {
      if (!localValue17) continue;
      try {
        if ("jitterBufferTarget" in localValue17) localValue17.jitterBufferTarget = localValue5;
      } catch {}
      try {
        if ("playoutDelayHint" in localValue17) localValue17.playoutDelayHint = localValue5 / 1000;
      } catch {}
    }
  };
  const localValue10 = () => {
    if (localValue8) {
      clearTimeout(localValue8);
      localValue8 = null;
    }
    localValue5 = Math.min(argument4, localValue5 + argument5);
    localValue9();
    localValue8 = setTimeout(() => {
      localValue5 = Math.max(argument3, localValue5 - argument5);
      localValue9();
    }, 15000);
    _cloudTimers.push(localValue8);
  };
  argument9 = 9;
  localValue1.addEventListener("waiting", localValue10);
  localValue1.addEventListener("stalled", localValue10);
  let localValue11 = null;
  let localValue12 = null;
  const localValue13 = setInterval(async () => {
    if (!_cloudPc || _cloudPc !== localValue3) return;
    let localValue17;
    try {
      localValue17 = await localValue3.getStats();
    } catch {
      return;
    }
    let localValue18 = null,
      localValue19 = null,
      localValue20 = null,
      localValue21 = null;
    localValue17.forEach(s => {
      if (s.type === "candidate-pair" && s.state === "succeeded" && typeof s.currentRoundTripTime === "number") {
        localValue18 = s.currentRoundTripTime * 1000;
      }
      if (s.type === "inbound-rtp" && s.kind === "video") {
        if (typeof s.jitter === "number") localValue19 = s.jitter * 1000;
        if (typeof s.packetsLost === "number") localValue20 = s.packetsLost;
        if (typeof s.freezeCount === "number") localValue21 = s.freezeCount;
      }
    });
    const localValue22 = localValue20 !== null && localValue11 !== null ? localValue20 - localValue11 : 0;
    const localValue23 = localValue21 !== null && localValue12 !== null ? localValue21 - localValue12 : 0;
    localValue11 = localValue20;
    localValue12 = localValue21;
    const localValue24 = localValue18 !== null && localValue18 > 150 || localValue19 !== null && localValue19 > 40 || localValue22 > 0;
    if (localValue24) {
      localValue10();
    } else if (localValue23 > 0 && localValue5 === argument3) {}
  }, 3000);
  _cloudTimers.push(localValue13);
  _cloudJitterHandlers = {
    "video": localValue1,
    "bumpJitterTarget": localValue10
  };
  _cloudPc.ontrack = ev => {
    if (!localValue1.srcObject) localValue1.srcObject = new MediaStream();
    localValue1.srcObject.addTrack(ev.track);
    if (ev.track.kind === "video") {
      localValue6 = ev.receiver;
      localValue9();
    } else if (ev.track.kind === "audio") {
      localValue7 = ev.receiver;
      localValue9();
    }
  };
  _cloudPc.onicecandidate = ev => {
    if (ev.candidate) cloudSigSend({
      "type": "rtc_candidate",
      "candidate": ev.candidate.toJSON()
    });
  };
  let localValue14 = null;
  const localValue15 = () => {
    if (localValue14) {
      clearTimeout(localValue14);
      localValue14 = null;
    }
  };
  argument10 = "poinie";
  localValue3.onconnectionstatechange = () => {
    if (_cloudPc !== localValue3) return;
    const localValue17 = localValue3.connectionState;
    if (localValue17 === "connected") {
      localValue15();
      document.getElementById("cloudOverlay").style.display = "none";
      localValue1.muted = false;
      localValue1.play()["catch"](() => {});
      _cloudInputActive = true;
      _cloudStarting = false;
      setupCloudInput();
      if (document.fullscreenElement) _lockCloudKeyboard();
      return;
    }
    if (localValue17 === "disconnected") {
      if (!localValue14) {
        localValue14 = setTimeout(() => {
          if (_cloudPc === localValue3 && localValue3.connectionState === "disconnected") endCloudGame();
        }, 6000);
        _cloudTimers.push(localValue14);
      }
      return;
    }
    if (["failed", "closed"].includes(localValue17)) {
      localValue15();
      showCloudEndedScreen("session ended", "lost connection to the stream");
    }
  };
  try {
    const localValue17 = await navigator.mediaDevices.getUserMedia({
      "audio": true
    })["catch"](() => null);
    if (localValue17) {
      const localValue18 = localValue17.getAudioTracks()[0];
      _cloudPc.addTrack(localValue18);
    }
  } catch {}
  const localValue16 = await _cloudPc.createOffer();
  await _cloudPc.setLocalDescription(localValue16);
  cloudSigSend({
    "type": 'rtc_offer',
    "sdp": localValue16.sdp
  });
}
function setupCloudInput(argument1) {
  if (_cloudInputHandlers) return;
  const localValue1 = document.getElementById("cloudVideo");
  let localValue2 = 0,
    localValue3 = 0,
    localValue4 = 0,
    localValue5 = 0,
    localValue6 = 0;
  const localValue7 = new Set();
  let localValue8 = null;
  const localValue9 = () => {
    if (!localValue8) {
      const r = localValue1.getBoundingClientRect();
      const localValue26 = localValue1.videoWidth || 16,
        localValue27 = localValue1.videoHeight || 9;
      const localValue28 = Math.min(r.width / localValue26, r.height / localValue27);
      const w = localValue26 * localValue28,
        h = localValue27 * localValue28;
      localValue8 = {
        "left": r.left + (r.width - w) / 2,
        "top": r.top + (r.height - h) / 2,
        "width": w,
        "height": h
      };
    }
    return localValue8;
  };
  const localValue10 = () => {
    localValue8 = null;
  };
  window.addEventListener("resize", localValue10);
  const localValue11 = buf => {
    try {
      if (_cloudDc && _cloudDc.readyState === "open") _cloudDc.send(buf);
    } catch {}
  };
  const localValue12 = (moveX = 0, moveY = 0, scroll = 0) => {
    if (!_cloudDc || _cloudDc.readyState !== "open") return;
    moveX = Math.max(-127, Math.min(127, moveX));
    moveY = Math.max(-127, Math.min(127, moveY));
    const r = localValue9();
    const localValue26 = Math.floor((localValue2 - r.left) / r.width * 10000);
    const localValue27 = Math.floor((localValue3 - r.top) / r.height * 10000);
    const buf = new ArrayBuffer(12),
      v = new DataView(buf);
    v.setUint8(0, 1);
    v.setUint8(1, 11);
    v.setUint8(2, 2);
    v.setUint8(3, 8);
    v.setUint16(4, Math.max(0, Math.min(10000, localValue26)));
    v.setUint16(6, Math.max(0, Math.min(10000, localValue27)));
    v.setInt8(8, moveX);
    v.setInt8(9, moveY);
    v.setUint8(10, localValue6);
    v.setInt8(11, scroll);
    localValue11(buf);
  };
  const localValue13 = (keyCode, isDown) => {
    if (isDown) localValue7.add(keyCode);else localValue7["delete"](keyCode);
    const buf = new ArrayBuffer(24),
      v = new DataView(buf);
    v.setUint8(0, 1);
    v.setUint8(2, 1);
    v.setUint8(3, 1);
    v.setUint16(4, keyCode);
    v.setUint8(6, isDown ? 1 : 0);
    let localValue26 = 7;
    for (const k of localValue7) {
      if (k !== keyCode && k > 0 && k < 255 && localValue26 < 21) {
        v.setUint16(localValue26, k);
        localValue26 += 2;
        v.setUint8(localValue26, 1);
        localValue26++;
      }
    }
    v.setUint8(localValue26++, 255);
    v.setUint8(1, localValue26 - 1);
    localValue11(buf.slice(0, localValue26));
  };
  const localValue14 = e => {
    if (!_cloudInputActive) return;
    const localValue26 = e.movementX || 0,
      localValue27 = e.movementY || 0;
    if (document.pointerLockElement === localValue1) {
      const r = localValue9();
      localValue4 = Math.max(0, Math.min(r.width, localValue4 + localValue26));
      localValue5 = Math.max(0, Math.min(r.height, localValue5 + localValue27));
      localValue2 = r.left + localValue4;
      localValue3 = r.top + localValue5;
    } else {
      localValue2 = e.clientX;
      localValue3 = e.clientY;
    }
    localValue12(localValue26, localValue27, 0);
  };
  const localValue15 = e => {
    if (!_cloudInputActive) return;
    localValue6 = e.buttons;
    localValue12(0, 0, 0);
  };
  const localValue16 = e => {
    if (_cloudInputActive) e.preventDefault();
  };
  const localValue17 = e => {
    if (!_cloudInputActive) return;
    e.preventDefault();
    localValue12(0, 0, e.deltaY > 0 ? -1 : 1);
  };
  argument1 = 8;
  const localValue18 = document.getElementById("cloudRelockHint");
  const localValue19 = () => {
    if (!_cloudDc) return;
    if (document.pointerLockElement === localValue1) return;
    localValue10();
    const r = localValue9();
    localValue4 = r.width / 2;
    localValue5 = r.height / 2;
    localValue2 = r.left + localValue4;
    localValue3 = r.top + localValue5;
    localValue1.requestPointerLock?.();
  };
  const localValue20 = () => {
    localValue18.style.display = "none";
    localValue19();
  };
  let localValue21 = false;
  const localValue22 = () => {
    if (!_cloudInputActive) return;
    if (document.pointerLockElement === localValue1) {
      localValue21 = true;
      localValue18.style.display = "none";
    } else if (localValue21) {
      const localValue26 = document.getElementById("cloudOverlay").style.display !== "none";
      localValue18.style.display = localValue26 ? "none" : "flex";
    }
  };
  document.addEventListener("pointerlockchange", localValue22);
  localValue18.addEventListener("click", localValue20);
  const localValue23 = isDown => e => {
    if (!_cloudInputActive) return;
    e.preventDefault();
    e.stopPropagation();
    if (isDown && e.repeat) return;
    localValue13(e.keyCode, isDown);
  };
  const localValue24 = localValue23(true);
  const localValue25 = localValue23(false);
  document.addEventListener("mousemove", localValue14);
  document.addEventListener("mousedown", localValue15);
  document.addEventListener("mouseup", localValue15);
  document.addEventListener("contextmenu", localValue16);
  document.addEventListener("wheel", localValue17, {
    "passive": false
  });
  localValue1.addEventListener("click", localValue20);
  document.addEventListener("keydown", localValue24, {
    "capture": true
  });
  document.addEventListener("keyup", localValue25, {
    "capture": true
  });
  _cloudInputHandlers = {
    "mouseMoveHandler": localValue14,
    "mouseButtonHandler": localValue15,
    "contextMenuHandler": localValue16,
    "wheelHandler": localValue17,
    "videoClickHandler": localValue20,
    "keyDownHandler": localValue24,
    "keyUpHandler": localValue25,
    "video": localValue1,
    "invalidateRect": localValue10,
    "pointerLockChangeHandler": localValue22,
    "relockHint": localValue18
  };
}
function endCloudGame() {
  if (!_cloudSession) return;
  teardownCloud(true);
  _cloudEndedActive = false;
  const localValue1 = document.getElementById("cloudVideoWrap");
  const localValue2 = document.getElementById("gamePlayerLoading");
  localValue1.style.display = "none";
  localValue2.style.display = "flex";
  localValue2.textContent = "loading…";
  document.getElementById("gamePlayerTimeLeft").textContent = '';
  setCloudPhase("idle", '', false);
}
var _0xa4aee = 12;
const originalHandleGamePlayerClose = handleGamePlayerClose;
_0xa4aee = 9;
handleGamePlayerClose = function () {
  if (_cloudEndedActive) {
    _cloudEndedActive = false;
    closeGamePlayer();
    return;
  }
  if (_cloudSession) {
    _armOrConfirmClose(() => {
      endCloudGame();
      closeGamePlayer();
    });
    return;
  }
  originalHandleGamePlayerClose();
};
window.addEventListener("beforeunload", () => {
  if (_cloudSession) _quitCloudSession(_cloudSession.uuid);
});
document.addEventListener("visibilitychange", () => {
  if (_cloudSession && document.hidden) {
    if (_cloudWs && _cloudWs.readyState === 1) {
      _cloudWs.send(JSON.stringify({
        "type": 'ping'
      }));
    }
  }
});
const originalGameCardOnClick = _gameCardOnClick;
_gameCardOnClick = function (g) {
  if (g.source === "cloud") return () => startCloudGame(g.key, g.name);
  return originalGameCardOnClick(g);
};
(() => {
  const el = document.getElementById("pingDisplay");
  if (el) el.textContent = typeof window.WispPing === "number" ? `ping: ${window.WispPing}ms` : "ping: --";
})();
document.body.firstElementChild?.remove();
function applyAtlasTheme() {
  document.title = "atlas";
  document.querySelector(".wordmark")?.remove();

  const style = document.createElement("link");
  style.id = "atlas-tobacco-theme";
  style.rel = "stylesheet";
  style.href = getAsset("atlas-tobacco.css") + (devMode ? `&dev=${Date.now()}` : '');
  shadowRoot.appendChild(style);

  const chrome = document.createElement("div");
  chrome.id = "atlasChrome";
  chrome.innerHTML = `
    <div class="atlas-frame" aria-hidden="true"></div>
    <aside class="atlas-rail">
      <button class="atlas-command-key" type="button" title="Focus search">&#8984;K</button>
      <div class="atlas-rail-wordmark">atlas</div>
      <div class="atlas-rail-context" id="atlasRailContext">Home</div>
      <div class="atlas-credit">Credit opiumbest &middot; Inspired by GUST</div>
    </aside>`;
  shadowRoot.appendChild(chrome);

  const content = document.querySelector(".content");
  const searchWrap = document.getElementById("searchWrap");
  const shortcuts = document.getElementById("shortcuts");
  if (content?.parentElement) {
    content.parentElement.style.background = "linear-gradient(90deg, rgba(197, 123, 46, .035), transparent 16%), #160e09";
  }
  if (content && searchWrap && shortcuts) {
    const searchHeading = document.createElement("div");
    searchHeading.className = "atlas-search-heading";
    searchHeading.innerHTML = `<span class="atlas-caret">&rsaquo;</span><span>Search or enter address</span><kbd>&#8984;K</kbd>`;
    content.insertBefore(searchHeading, searchWrap);

    const recent = document.createElement("div");
    recent.className = "atlas-recent";
    recent.innerHTML = `<span>Recent</span>`;
    [
      ["Twitch directory", "https://twitch.tv/directory"],
      ["YouTube subscriptions", "https://youtube.com/feed/subscriptions"],
      ["Geometry Dash", "https://webdashers.dev/"]
    ].forEach(([label, url]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.onclick = () => navigate(url);
      recent.appendChild(button);
    });
    searchWrap.after(recent);

    const destinationHeading = document.createElement("div");
    destinationHeading.className = "atlas-destinations-heading";
    destinationHeading.innerHTML = `<strong>Destinations</strong><span>Press Alt + 1&ndash;9 to jump</span><span>All ${SHORTCUTS.length}</span>`;
    shortcuts.before(destinationHeading);
  }

  const navButtons = document.querySelector(".nav-buttons");
  if (navButtons) {
    const createNavButton = (id, label, handler) => {
      const button = document.createElement("button");
      button.className = "nav-item atlas-text-nav";
      button.id = id;
      button.type = "button";
      button.textContent = label;
      button.onclick = handler;
      return button;
    };
    navButtons.prepend(
      createNavButton("navHome", "Home", () => {
        document.getElementById("settingsScreen")?.classList.remove("open");
        closeGames();
        closeEffects();
        document.getElementById("panel")?.classList.remove("open");
        document.getElementById("bottomNav")?.classList.remove("hidden");
      }),
      createNavButton("navBrowse", "Browse", () => {
        document.getElementById("gamesScreen")?.classList.remove("open");
        document.getElementById("effectsScreen")?.classList.remove("open");
        document.getElementById("settingsScreen")?.classList.remove("open");
        const panel = document.getElementById("panel");
        panel?.classList.add("open");
        document.getElementById("bottomNav")?.classList.add("hidden");
        const address = document.getElementById("addrInput");
        address?.focus();
        address?.select();
      })
    );
  }

  const gamesButton = document.getElementById("navGames");
  const effectsButton = document.getElementById("navEffects");
  const aiButton = [...document.querySelectorAll(".nav-item")].find(button => button.textContent.trim() === "AI");
  if (gamesButton) gamesButton.dataset.label = "Library";
  if (effectsButton) effectsButton.dataset.label = "Sound";
  if (aiButton) aiButton.dataset.label = "Atlas AI";
  const settingsButton = document.getElementById("navSettings");
  settingsButton?.setAttribute("data-label", "Settings");
  if (settingsButton && aiButton) navButtons?.insertBefore(settingsButton, aiButton);

  const gamesHeader = document.querySelector("#gamesScreen .screen-header-left");
  const effectsHeader = document.querySelector("#effectsScreen .screen-header-left");
  const settingsHeader = document.querySelector("#settingsScreen .screen-header-left");
  if (gamesHeader) gamesHeader.innerHTML = `<span class="screen-header-title">Library</span><span class="screen-header-sub">Games that run inside Atlas.</span>`;
  if (effectsHeader) effectsHeader.innerHTML = `<span class="screen-header-title">Sound effects</span><span class="screen-header-sub">Play a sound without leaving your session.</span>`;
  if (settingsHeader) settingsHeader.innerHTML = `<span class="screen-header-title">Settings</span>`;

  const volumeFooter = document.querySelector(".effects-footer");
  const volumeSlider = document.getElementById("volumeSlider");
  if (volumeFooter && volumeSlider) {
    const label = document.createElement("span");
    label.className = "effects-volume-label";
    label.textContent = "Master";
    const output = document.createElement("output");
    output.className = "effects-volume-output";
    output.id = "effectsVolumeOutput";
    output.value = "100";
    output.textContent = "100";
    volumeFooter.prepend(label);
    volumeFooter.appendChild(output);
    volumeSlider.addEventListener("input", () => {
      const value = String(Math.round(parseFloat(volumeSlider.value) * 100));
      output.value = value;
      output.textContent = value;
    });
  }

  const commandKey = chrome.querySelector(".atlas-command-key");
  commandKey.onclick = () => {
    const panel = document.getElementById("panel");
    const input = panel?.classList.contains("open") ? document.getElementById("addrInput") : document.getElementById("searchInput");
    input?.focus();
    input?.select();
  };

  window.updateAtlasChromeState = () => {
    const panelOpen = document.getElementById("panel")?.classList.contains("open");
    const libraryOpen = document.getElementById("gamesScreen")?.classList.contains("open");
    const soundOpen = document.getElementById("effectsScreen")?.classList.contains("open");
    const settingsOpen = document.getElementById("settingsScreen")?.classList.contains("open");
    const playerOpen = document.getElementById("gamePlayer")?.classList.contains("open");
    const context = settingsOpen ? "Settings" : soundOpen ? "Sound" : libraryOpen ? "Library" : panelOpen ? "Browsing" : "Home";
    const contextEl = document.getElementById("atlasRailContext");
    if (contextEl) contextEl.textContent = context;
    chrome.classList.toggle("atlas-home", context === "Home");
    chrome.classList.toggle("atlas-player-open", playerOpen);
    document.getElementById("bottomNav")?.classList.toggle("atlas-player-open", playerOpen);
    document.getElementById("navHome")?.classList.toggle("active", context === "Home");
    document.getElementById("navBrowse")?.classList.toggle("active", panelOpen && !settingsOpen && !libraryOpen && !soundOpen);
  };
  window.updateAtlasChromeState();

  document.addEventListener("keydown", event => {
    if (!event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const index = event.key === "0" ? 9 : Number(event.key) - 1;
    if (index < 0 || index > 8 || !SHORTCUTS[index]) return;
    event.preventDefault();
    navigate(SHORTCUTS[index].url);
  });
}
