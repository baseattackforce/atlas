// Shared with the loader: internal new-tab navigation must not break cloaking.
(function () {
  function wrapper(value) {
    let url;
    try { url = new URL(value, location.href); } catch { return null; }
    if (!/^https?:$/.test(url.protocol)) return null;
    const attribute = url.href.replace(/[&"<>]/g, character => ({'&':'&amp;','"':'&quot;','<':'&lt;','>':'&gt;'}[character]));
    const original = JSON.stringify(url.href).replace(/</g, '\\u003c');
    return '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<title>New Tab</title><style>html,body{margin:0;height:100%;overflow:hidden}iframe{border:0;width:100%;height:100%}</style>' +
      '<iframe id="cloakFrame" src="' + attribute + '"></iframe><script>' +
      'addEventListener("storage",function(event){if(event.key!=="SETTINGS")return;let settings;try{settings=JSON.parse(localStorage.getItem("SETTINGS")||"{}")}catch{return}' +
      'if(!settings.Privacy?.["About:Blank Cloak"])location.href=' + original + '})<\/script>';
  }
  window.__atlasCloakWrapper = wrapper;
  window.__cloakOpen = value => {
    const html = wrapper(value);
    if (!html) return null;
    const open = window.__nativeOpen || window.open;
    const popup = open.call(window, 'about:blank', '_blank');
    if (!popup) return null;
    popup.document.open(); popup.document.write(html); popup.document.close();
    return popup;
  };
  window.__openCloak = () => {
    if (window.self !== window.top) return true;
    if (!window.__cloakOpen(location.href)) return false;
    window.allowUnload = true;
    window.onbeforeunload = null;
    location.replace('https://clever.com/');
    return true;
  };
})();
