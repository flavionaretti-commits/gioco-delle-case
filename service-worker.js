const CACHE_NAME = "gioco-delle-case-v7-5a-aura-fix-20260821";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-180.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./sounds/effect-special.mp3",
  "./sounds/confirm-short.mp3",
  "./sounds/transition-magic.mp3",
  "./sounds/house-open.mp3",
  "./sounds/leader-event.mp3",
  "./sounds/potion-bubble.mp3",
  "./sounds/points-sparkle.mp3",
  "./sounds/project-whoosh.mp3",
  "./sounds/project-gleam.mp3",
  "./sounds/unlock-magic.mp3",
  "./sounds/README-SUONI.md"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(event.request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return response;
      }).catch(() => caches.match(event.request).then(r => r || caches.match("./index.html")))
    );
  }
});
