// Adapted from tongsherbet/storage@050d21c0d66b641c420bb03bc7fe5965cd26b696.
// Synergy supplies a pinned owned-repository assetsBase and its local worker scope.
window.assetsBase ||= 'https://cdn.jsdelivr.net/gh/baseattackforce/atlas@main/';
window.atlasAppBase ||= new URL('./', location.href).href;
const e = [
  'localhost',
  '127.0.0.1',
  'ngrok-free'
];
window.devMode = e.includes(location.hostname) || e.includes(location.hostname.split('.').at(-2) || location.hostname);
const t = [
  'cdn.northstreetumc.org',
  'cdn.vipersfutbol.com',
  'cdn.pcesc.org',
  'cdn.kcchallengevbc.com',
  'cdn.slcbmooc.org',
  'cdn.topstargym.net',
  'cdn.goaplytexas.org',
  'cdn.clearfieldswimming.com',
  'cdn.richardacademy.cfd',
  'wss://athollcottage.com/connection/',
  'wss://kidsprepnest.org/vi/'
];
const primaryServiceBase = 'https://' + t.find(host => !host.includes('://'));
window.controller = null, window.transport = null, window.shadowRoot = null;
const r = e => new Promise(t => setTimeout(t, e)), o = (e, t) => {
    try {
      if (void 0 === t)
        return localStorage[e];
      localStorage[e] = t;
    } catch {
    }
  }, n = e => e.includes('://'), a = e => n(e) ? e : `wss://${ e }/`;
function testWlspDomain(e) {
  return new Promise(t => {
    let r;
    try {
      r = new WebSocket(a(e));
    } catch {
      return t(null);
    }
    r.binaryType = 'arraybuffer';
    const o = Math.floor(4294967294 * Math.random()) + 1 >>> 0;
    let n = !1, s = 0;
    const c = e => {
        clearTimeout(i), r.onmessage = r.onerror = r.onclose = null;
        try {
          r.close();
        } catch {
        }
        t(e);
      }, i = setTimeout(() => c(null), 3000);
    r.onerror = r.onclose = () => c(null), r.onmessage = ({data: e}) => {
      if (!(e instanceof ArrayBuffer) || e.byteLength < 5)
        return c(null);
      const t = new DataView(e), a = t.getUint8(0), i = t.getUint32(1, !0);
      if (n)
        return i === o && c(Math.round(performance.now() - s));
      if (0 === i)
        if (5 === a)
          r.send(new Uint8Array([
            5,
            0,
            0,
            0,
            0,
            2,
            1
          ]));
        else if (3 === a) {
          const e = new Uint8Array([
            1,
            0,
            0,
            0,
            0,
            1,
            69,
            0,
            ...new TextEncoder().encode('127.0.0.1')
          ]);
          new DataView(e.buffer).setUint32(1, o, !0), n = !0, s = performance.now(), r.send(e);
        }
    };
  });
}
async function getWlsp() {
  const cached = o('WID') ? +o('WID') : NaN, order = [...t.keys()];
  if (Number.isInteger(cached) && t[cached] && !n(t[cached])) { order.splice(order.indexOf(cached),1); order.unshift(cached); }
  try {
    const winner = await Promise.any(order.map(async index => {
      const ping = await testWlspDomain(t[index]);
      if (ping === null) throw new Error('relay unavailable');
      return {index,ping};
    }));
    window.WlspPing = winner.ping;
    window.WlspIsBackup = n(t[winner.index]);
    if (!window.WlspIsBackup) o('WID',winner.index);
    return a(t[winner.index]);
  } catch {
    window.WlspIsBackup = n(t.at(-1));
    return a(t.at(-1));
  }
}

const s = () => window.assetsBase;
async function initTransport(e) {
  for (let t = 0; t < 1000; t++) {
    try {
      return await e.init();
    } catch (e) {
      if (!String(e).includes('wasm not loaded'))
        throw e;
    }
    await r(10);
  }
  throw new Error('transport init timed out');
}
window.getAsset = file => {
  return new URL(file, window.assetsBase).href;
}, window.loadScript = (e, t, r, o, n) => new Promise((a, s) => {
  const c = document.createElement('script');
  const timeout = setTimeout(() => {
    c.remove();
    s(new Error('Timed out loading ' + e));
  }, 20000);
  c.src = e, o && (c.id = o), c.onload = () => {
    clearTimeout(timeout);
    t ? t() : c.remove(), a();
  }, c.onerror = () => {
    clearTimeout(timeout);
    r ? r() : c.remove(), s(new Error('failed to load ' + e));
  }, (n || document.head || document.documentElement).appendChild(c);
});
const c = ((() => {
    try {
      return navigator.serviceWorker;
    } catch {
    }
  })()), i = (e = ((() => {
    const e = window.swPath || 'sw.js';
    return e + (e.includes('?') ? '&' : '?') + 'raw';
  })())) => c.register(e, { updateViaCache: 'none' });
async function saveAssetsBase() {
  try {
    const e = indexedDB.open('O');
    e.onupgradeneeded = () => {
      e.result.createObjectStore('cache'), e.result.createObjectStore('chats', { keyPath: 'id' }), e.result.createObjectStore('bookmarks', { keyPath: 'id' });
    };
    const t = await new Promise((t, r) => {
        e.onsuccess = () => t(e.result), e.onerror = r;
      }), r = t.transaction('cache', 'readwrite');
    r.objectStore('cache').put(s(), 'assetsBase'), await new Promise(e => {
      r.oncomplete = r.onerror = r.onabort = e;
    }), t.close();
  } catch {
  }
}
async function swStart() {
  const e = await Promise.race([
    i(),
    r(20000)
  ]);
  if (!e)
    throw new Error('service worker registration timed out');
  if (!c.controller) {
    const t = new Promise(e => c.addEventListener('controllerchange', e, { once: !0 })), o = e.installing || e.waiting, n = new Promise(e => {
        'redundant' === o?.state && e(), o?.addEventListener('statechange', () => 'redundant' === o.state && e());
      });
    e.active?.postMessage({ type: 'OPM:claim' }), await Promise.race([
      t,
      n,
      r(o ? 40000 : 5000)
    ]);
  }
  if (!c.controller) {
    const t = !(!e.installing && !e.waiting);
    if (!t && swSoftReload())
      return !1;
    throw Object.assign(new Error(t ? 'service worker is still installing (slow network)' : 'page never came under service worker control'), { noReset: t });
  }
  if (!await swAlive(e))
    throw new Error('service worker is not responding');
  try {
    delete sessionStorage.atlasSwSoft;
  } catch {
  }
  return !0;
}
function swSoftReload() {
  try {
    if (sessionStorage.atlasSwSoft)
      return !1;
    sessionStorage.atlasSwSoft = 1;
  } catch {
    return !1;
  }
  return location.reload(), !0;
}
async function swReset() {
  try {
    if (sessionStorage.atlasSwReloaded)
      return !1;
    sessionStorage.atlasSwReloaded = 1;
  } catch {
    return !1;
  }
  return await Promise.race([
    c.getRegistrations().then(items => Promise.all(items.filter(item => item.scope === window.atlasAppBase).map(item => item.unregister()))).catch(() => {
    }),
    r(2000)
  ]), location.reload(), !0;
}
async function swAlive(e) {
  for (let t = 0; t < 20; t++) {
    const t = new AbortController(), o = setTimeout(() => t.abort(), 2000);
    try {
      const r = await fetch(new URL('__sw_alive', e.scope), {
        cache: 'no-store',
        signal: t.signal
      });
      if ('true' === await r.text())
        return !0;
    } catch {
    } finally {
      clearTimeout(o);
    }
    await r(100);
  }
  return !1;
}
const l = e => e, d = e => e, u = '', w = () => {}, m = async () => {};
let g = () => {
};
(async () => {
  document.body || await new Promise(e => document.addEventListener('DOMContentLoaded', e, { once: !0 }));
  const e = m(), t = document.createElement('div');
  t.style.cssText = 'position:fixed;inset:0;z-index:2147483647', document.documentElement.appendChild(t);
  const n = t.attachShadow({ mode: 'closed' }), a = document.createElement('div');
  a.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#000;color:#fff;display:flex;align-items:center;justify-content:center;z-index:999999;font-size:20px;font-family:Inter,sans-serif', n.appendChild(a);
  let s = 'start';
  g = e => a.isConnected && (a.innerText = l(s = e)), g(s), e.then(() => g(s));
  const d = new URLSearchParams(location.search).has('sf') || /[?&]sf(?:[=&]|$)/.test(location.href);
  if (window.top !== window.self && d) {
    g('singlefile, waiting for top frame');
    const e = Math.random().toString(36).slice(2);
    await new Promise(t => {
      addEventListener('message', function r(o) {
        o.data === e && (removeEventListener('message', r), t());
      }), window.top.postMessage(e, '*');
    });
  }
  const p = Promise.race([
    saveAssetsBase(),
    r(4000)
  ]);
  g('loading jet');
  const f = [
    'jet.core.js',
    'jet.api.js',
    'jet.utils.js'
  ].map(e => getAsset('sj/' + e));
  for (const e of f.slice(1))
    document.head.appendChild(Object.assign(document.createElement('link'), {
      rel: 'preload',
      as: 'script',
      href: e
    }));
  for (const e of f)
    await loadScript(e);
  if (!window.AtlasUrlCodec) await loadScript(getAsset('url-codec.js'));
  if (!c)
    return g('service workers are disabled or unsupported in this browser');
  g('registering service worker (if you are stuck here for over 30 seconds, reload)');
  const h = setTimeout(() => g('registering service worker (slow network or device, still working...)'), 5000);
  try {
    if (await p, !await swStart())
      return;
  } catch (e) {
    if (!e.noReset && await swReset())
      return;
    return g('service worker failed: ' + (e?.message || e) + ' (reload to try again)');
  } finally {
    clearTimeout(h);
  }
  let y = null;
  const v = () => y ||= (async () => {
    try {
      const e = await c.getRegistration();
      if (e) {
        if (!await swAlive(e) && await swReset())
          return;
      } else
        await i();
    } catch {
    }
    controller && c.controller && controller.serviceWorkerController !== c.controller && (controller.serviceWorkerController = c.controller, controller.setupMessagePort());
  })().finally(() => y = null);
  setInterval(v, 20000), addEventListener('focus', v), g('finding Atlas server'), window.wlspServer || (window.wlspServer = await getWlsp()), g('initializing transport');
  // Backup Wisp servers provide browsing, not necessarily AI/Lumin/Stratus.
  window.atlasServiceBase ||= window.WlspIsBackup
    ? primaryServiceBase
    : 'https://' + new URL(window.wlspServer).host;
  let b, j, S = o('TRNSPRT') || 'curl/index.mjs';
  try {
    ({default: b} = await import(getAsset(S)));
  } catch {
    S = 'curl/index.mjs', {default: b} = await import(getAsset(S));
  }
  o('TRNSPRT', S), transport = new b({ wisp: window.wlspServer }), await initTransport(transport), g('initializing SJ'), controller = new $jetController.Controller({
    serviceworker: c.controller,
    transport: transport,
    jetConfig: {
      maskedfiles: [
        'jet.inject.js',
        'jet.wasm.js'
      ],
      flags: {
        syncxhr: !1,
        disableComputedWrap: !1,
        rewriterLogs: !1,
        captureErrors: !1,
        cleanErrors: !1,
        scramitize: !1,
        sourcemaps: !1,
        destructureRewrites: !0,
        allowInvalidJs: !0,
        debugTrampolines: !1,
        debugSourceURL: !1,
        allowFailedIntercepts: !0,
        encapsulateWorkers: !0
      }
    },
    config: {
      jetPath: getAsset('sj/jet.core.js'),
      wasmPath: getAsset('sj/jet.wasm'),
      injectPath: getAsset('sj/jet.inject.js'),
      virtualWasmPath: 'jet.wasm.js',
      codec: window.AtlasUrlCodec,
      prefix: new URL('./~/', location.href).pathname
    }
  });
  const k = new Promise(e => j = e), C = controller.readyResolve;
  controller.readyResolve = (...e) => (j(!0), C.apply(controller, e));
  const T = new WeakMap(), E = () => T.get(controller.port) || T.set(controller.port, new Set()).get(controller.port), {
      recieve: x,
      sendRaw: A
    } = controller.rpc;
  controller.rpc.recieve = function (e) {
    return 'request' === e?.[this.id]?.$type && E().add(e[this.id].$token), x.call(this, e);
  }, controller.rpc.sendRaw = function (e, t) {
    return 'response' === e?.[this.id]?.$type && E().delete(e[this.id].$token), A.call(this, e, t);
  }, addEventListener('pagehide', () => {
    for (const e of E())
      controller.rpc.sendRaw({
        [controller.rpc.id]: {
          $type: 'response',
          $token: e,
          $error: 'page closed'
        }
      }, []);
  }), c.addEventListener('controllerchange', () => {
    c.controller && (controller.serviceWorkerController = c.controller, controller.setupMessagePort());
  });
  for (let e = 0; !await Promise.race([
      k,
      r(4000)
    ]); e++) {
    if (5 === e) {
      if (await swReset())
        return;
      throw new Error('the service worker never answered the jet handshake');
    }
    g('initializing SJ (retrying)'), controller.serviceWorkerController = c.controller || controller.serviceWorkerController, controller.setupMessagePort();
  }
  await controller.wait(), controller.guardServiceWorkerRevive = !1, g('loading UI');
  const P = new DOMParser().parseFromString(await fetch(getAsset('main.html')).then(response => { if (!response.ok) throw new Error('Atlas UI failed: HTTP ' + response.status); return response.text(); }), 'text/html');
  if (await e, w(P.body), u)
    for (const e of P.querySelectorAll('style'))
      e.textContent = e.textContent.replace(/\{([^{}]*text-transform:\s*uppercase[^{}]*)\}/g, '{$1;font-family:\'Inter Caps\',Inter,sans-serif}');
  for (const e of [...P.head.children])
    if ('LINK' === e.tagName)
      document.head.appendChild(e.cloneNode(!0)), 'stylesheet' !== e.rel || /fonts\.googleapis\.com/.test(e.href) || n.appendChild(e.cloneNode(!0));
    else if ('STYLE' === e.tagName) {
      const t = e.cloneNode(!0);
      t.textContent = t.textContent.replace(/:root\b/g, ':host'), n.appendChild(t);
    }
  u && n.appendChild(Object.assign(document.createElement('style'), { textContent: u })), shadowRoot = n;
  const M = document.createElement('div');
  M.style.cssText = 'position:fixed;inset:0;width:100%;height:calc(var(--vh, 1vh) * 100);overflow:hidden;background:#080810;font-family:\'Inter\', sans-serif;color:#e0e0e0;display:flex;flex-direction:column;align-items:center;justify-content:center', n.appendChild(M);
  for (const e of [...P.body.children])
    'SCRIPT' !== e.tagName && M.appendChild(e.cloneNode(!0));
  const {
    getElementById: D,
    querySelector: R,
    querySelectorAll: L
  } = Document.prototype;
  Document.prototype.getElementById = function (e) {
    return this === document && n.getElementById(e) || D.call(this, e);
  }, Document.prototype.querySelector = function (e) {
    if (this === document)
      try {
        return n.querySelector(e) || R.call(this, e);
      } catch {
      }
    return R.call(this, e);
  }, Document.prototype.querySelectorAll = function (e) {
    if (this === document)
      try {
        const t = n.querySelectorAll(e);
        if (t.length)
          return t;
      } catch {
      }
    return L.call(this, e);
  };
  for (const e of [
      ...P.head.querySelectorAll('script'),
      ...P.body.querySelectorAll('script')
    ]) {
    const t = document.createElement('script');
    const source = e.getAttribute('src');
    source ? (t.src = getAsset(source), await new Promise((resolve, reject) => {
      t.onload = resolve; t.onerror = () => reject(new Error('Unable to load ' + t.src)); document.head.appendChild(t);
    })) : (t.textContent = e.textContent, document.head.appendChild(t)), t.remove();
  }
  a.remove();
  window.SynergyAnalytics?.trackEvent?.('atlas_ready', {entry_point: 'atlas'});
})().catch(e => {
  console.error(e), g('failed to start: ' + (e?.message || e) + ' (reload to try again)');
});
