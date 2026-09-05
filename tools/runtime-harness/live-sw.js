"use strict";

importScripts("/stuff/jet/jet.sw.js");

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {
  event.respondWith((async () => {
    try {
      if (self.$scramjetController?.shouldRoute(event)) {
        return await self.$scramjetController.route(event);
      }
    } catch (error) {
      console.warn("[atlas-live-preview] routed request failed", error);
    }

    const [, prefix, clientId, frameId] = new URL(event.request.url).pathname.split("/");
    if (prefix === "~" && clientId && frameId) {
      return new Response("Loading...", {
        status: 503,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store",
        },
      });
    }

    return fetch(event.request);
  })());
});
