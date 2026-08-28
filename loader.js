var _0x26aeff = 10;
const devHosts = ["localhost", "127.0.0.1", "ngrok-free"];
_0x26aeff = 5;
window.devMode = devHosts.includes(location.hostname) || devHosts.includes(location.hostname.split(".").at(-2) || location.hostname), window.swPath = window.swPath || "sw.js", window.assetsBase = window.assetsBase || "https://cdn.jsdelivr.net/gh/baseattackforce/atlas@main/";
const serverList = ["cdn.northstreetumc.org", "cdn.pcesc.org", "cdn.kcchallengevbc.com", "cdn.slcbmooc.org", "wss://girlspreples.org/wi/"];
function wispPath() {
  return "false" !== localStorage.ABDE ? "/adblock/" : "/";
}
function wispUrl(endpoint) {
  return endpoint.includes("://") ? endpoint : `wss://${endpoint}${wispPath()}`;
}
function testWispDomain(domain) {
  return new Promise(t => {
    let r;
    try {
      r = new WebSocket(wispUrl(domain));
    } catch {
      t(null);
      return;
    }
    r.binaryType = "arraybuffer";
    let n = !1,
      i = 0,
      o = Math.floor(4294967294 * Math.random()) + 1 >>> 0,
      s = setTimeout(() => {
        try {
          r.close();
        } catch {}
        t(null);
      }, 5000),
      l = e => {
        clearTimeout(s), r.onmessage = r.onerror = r.onclose = null;
        try {
          r.close();
        } catch {}
        t(e);
      };
    r.onmessage = e => {
      let t = new DataView(e.data),
        s = t.getUint8(0),
        a = t.getUint32(1, !0);
      if (!n) {
        if (5 === s && 0 === a) r.send(new Uint8Array([5, 0, 0, 0, 0, 2, 1]));else if (3 === s && 0 === a) {
          n = !0;
          let c = new TextEncoder().encode("127.0.0.1"),
            d = new ArrayBuffer(8 + c.length),
            p = new DataView(d);
          p.setUint8(0, 1), p.setUint32(1, o, !0), p.setUint8(5, 1), p.setUint16(6, 1, !0), new Uint8Array(d).set(c, 8), i = performance.now(), r.send(d);
        }
        return;
      }
      a === o && l(Math.round(performance.now() - i));
    }, r.onerror = r.onclose = () => l(null);
  });
}
async function getWisp() {
  let storedIndex = localStorage.WID,
    parsedIndex = +storedIndex,
    hasStoredIndex = void 0 !== storedIndex && "" !== storedIndex && Number.isInteger(parsedIndex) && parsedIndex >= 0 && parsedIndex < serverList.length;
  if (hasStoredIndex) {
    let n = await testWispDomain(serverList[parsedIndex]);
    if (null !== n) return window.WispPing = n, wispUrl(serverList[parsedIndex]);
  }
  for (let i = 0; i < serverList.length; i++) {
    let o = await testWispDomain(serverList[i]);
    if (null !== o) return localStorage.WID = i, window.WispPing = o, wispUrl(serverList[i]);
  }
  return wispUrl(serverList[serverList.length - 1]);
}
function preload(assetUrl) {
  let t = document.createElement("link");
  t.rel = "preload", t.as = "script", t.href = assetUrl, document.head.appendChild(t);
}
function loadScript(scriptUrl) {
  return new Promise((t, r) => {
    let n = document.createElement("script");
    n.src = scriptUrl, n.onload = () => {
      n.remove(), t();
    }, n.onerror = () => {
      n.remove(), r();
    }, document.head.appendChild(n);
  });
}
async function initTransport(transport) {
  for (let t = 0; t < 100; t++) try {
    await transport.init();
    return;
  } catch (r) {
    if (!String(r).includes("wasm not loaded")) throw r;
    await new Promise(e => setTimeout(e, 100));
  }
  throw Error("transport init timed out");
}
window.controller = null, window.transport = null, window.shadowRoot = null, window.getAsset = e => {
  let t = Math.floor(Date.now() / 36e5);
  return window.assetsBase + e + (e.includes("?") ? "&" : "?") + t;
}, (async () => {
  for (; document.body.firstChild;) document.body.removeChild(document.body.firstChild);
  [...document.head.childNodes].forEach(e => {
    (1 !== e.nodeType || "LINK" !== e.tagName || "preconnect" !== e.rel && "dns-prefetch" !== e.rel) && e.remove();
  });
  let e = document.createElement("div");
  e.style.cssText = "position:fixed;inset:0;z-index:2147483647", document.documentElement.appendChild(e);
  let t = e.attachShadow({
      "mode": "closed"
    }),
    r = document.createElement("div");
  r.innerText = "start", Object.assign(r.style, {
    "position": "fixed",
    "top": "0",
    "left": "0",
    "width": "100%",
    "height": "100%",
    "background": "#000",
    "color": "#fff",
    "display": "flex",
    "alignItems": "center",
    "justifyContent": "center",
    "zIndex": "999999",
    "fontSize": "20px",
    "fontFamily": "sans-serif"
  }), t.appendChild(r), r.innerText = "loading scramjet";
  let n = getAsset("jet/jet.api.js"),
    i = getAsset("jet/jet.utils.js");
  preload(n), preload(i), await loadScript(getAsset("jet/jet.core.js")), await loadScript(n), await loadScript(i), r.innerText = "registering service worker (if you are stuck here, try CTRL + SHIFT + R)";
  let o = await navigator.serviceWorker.register(window.swPath);
  if (o.update(), await navigator.serviceWorker.ready, !navigator.serviceWorker.controller && (await new Promise(e => {
    let t = o.installing || o.waiting || o.active;
    t.addEventListener("statechange", function () {
      "activated" === this.state && e();
    }), "activated" === t.state && e();
  }), !navigator.serviceWorker.controller)) {
    location.reload();
    return;
  }
  r.innerText = "finding unblocked Opium server", window.wispServer || (window.wispServer = devMode ? (location.protocol.includes("s") ? "wss://" : "ws://") + location.host + "/" : await getWisp()), r.innerText = "initializing transport";
  let s = localStorage.transport || getAsset("curl/index.mjs"),
    {
      "default": l
    } = await import(s);
  await initTransport(transport = new l({
    "wisp": window.wispServer
  })), r.innerText = "initializing scramjet";
  let {
    "Controller": a
  } = $scramjetController;
  await (controller = new a({
    "serviceworker": navigator.serviceWorker.controller,
    "transport": transport,
    "config": {
      "scramjetPath": getAsset("jet/jet.core.js"),
      "wasmPath": getAsset("jet/jet.wasm"),
      "injectPath": getAsset("jet/jet.inject.js"),
      "virtualWasmPath": "jet.wasm.js",
      "codec": {
        "encode": e => e ? encodeURIComponent(e) : e,
        "decode": e => e ? decodeURIComponent(e) : e
      },
      "prefix": new URL("./~/", location.href).pathname
    },
    "scramjetConfig": {
      "maskedfiles": ["jet.inject.js", "jet.wasm.js"]
    }
  })).wait(), r.innerText = "loading UI";
  let c = await fetch(getAsset("main.html")),
    d = await c.text(),
    p = new DOMParser().parseFromString(d, "text/html");
  for (let h of [...p.head.children]) if ("LINK" === h.tagName) document.head.appendChild(h.cloneNode(!0));else if ("STYLE" === h.tagName) {
    let u = h.cloneNode(!0);
    u.textContent = u.textContent.replace(new RegExp(":root\\b", "g"), ":host"), t.appendChild(u);
  }
  shadowRoot = t;
  let $ = document.createElement("div");
  for (let f of (Object.assign($.style, {
    "position": "fixed",
    "inset": "0",
    "width": "100%",
    "height": "calc(var(--vh, 1vh) * 100)",
    "overflow": "hidden",
    "background": "#080810",
    "fontFamily": "'Inter', sans-serif",
    "color": "#e0e0e0",
    "display": "flex",
    "flexDirection": "column",
    "alignItems": "center",
    "justifyContent": "center"
  }), t.appendChild($), [...p.body.children])) "SCRIPT" !== f.tagName && $.appendChild(f.cloneNode(!0));
  let w = Document.prototype.getElementById;
  Document.prototype.getElementById = function (e) {
    return t.querySelector("#" + CSS.escape(e)) || w.call(this, e);
  };
  let m = Document.prototype.querySelector;
  Document.prototype.querySelector = function (e) {
    try {
      return t.querySelector(e) || m.call(this, e);
    } catch (r) {
      return m.call(this, e);
    }
  };
  let g = Document.prototype.querySelectorAll;
  Document.prototype.querySelectorAll = function (e) {
    try {
      let r = t.querySelectorAll(e);
      if (r.length) return r;
    } catch (n) {}
    return g.call(this, e);
  }, r.remove();
  let y = [...p.head.querySelectorAll("script"), ...p.body.querySelectorAll("script")];
  for (let v of y) await new Promise(e => {
    let t = document.createElement("script");
    v.src ? (t.src = v.src, t.onload = t.onerror = () => {
      t.remove(), e();
    }, document.head.appendChild(t)) : (t.textContent = v.textContent, document.head.appendChild(t), t.remove(), e());
  });
})().catch(e => {
  console.error("[atlas] initialization failed", e);
  let t = document.createElement("div");
  t.textContent = "Unable to load Atlas. Refresh to try again.", t.style.cssText = "position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;background:#080810;color:#f7f4ff;font:500 15px/1.4 Inter,system-ui,sans-serif", document.documentElement.appendChild(t);
});
const schoolList = ["deledao", "goguardian", "lightspeed", "linewize", "securly", ".edu/"];
function isBlockedDomain(e) {
  try {
    let t = new URL(e, location.origin).hostname + "/";
    return schoolList.some(e => t.includes(e));
  } catch (r) {
    return !1;
  }
}
const originalFetch = window.fetch;
window.fetch = function (e, t) {
  return isBlockedDomain(e) ? Promise.reject(Error("Blocked")) : originalFetch.apply(this, arguments);
};
var _0x939df = 8;
const originalOpen = XMLHttpRequest.prototype.open;
_0x939df = "nigpmc";
XMLHttpRequest.prototype.open = function (e, t) {
  if (isBlockedDomain(t)) throw Error("Blocked");
  return originalOpen.apply(this, arguments);
}, HTMLCanvasElement.prototype.toDataURL = function (...e) {
  return "";
};
