/*
 * Keep these functions self-contained: Jet serializes them into workers
 * and proxied frames. The build copies this file without obfuscation so it
 * cannot introduce references to helpers outside the serialized functions.
 */
"use strict";

window.AtlasUrlCodec = Object.freeze({
  encode: function (url) {
    if (!url) return url;
    const bytes = new TextEncoder().encode(url);
    let binary = "";
    for (let offset = 0; offset < bytes.length; offset += 8192) {
      binary += String.fromCharCode.apply(null, bytes.subarray(offset, offset + 8192));
    }
    return "b64_" + btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  },
  decode: function (url) {
    if (!url) return url;
    if (!url.startsWith("b64_")) return decodeURIComponent(url);
    const payload = url.slice(4).replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(payload + "=".repeat((4 - payload.length % 4) % 4));
    const bytes = new Uint8Array(binary.length);
    for (let offset = 0; offset < binary.length; offset++) {
      bytes[offset] = binary.charCodeAt(offset);
    }
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  }
});
