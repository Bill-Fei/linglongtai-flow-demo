const CACHE_NAME = "tianxi-card-motion-v45";
const APP_ASSETS = [
  "./",
  "./index.html",
  "./styles.css?v=45",
  "./script.js?v=45",
  "./assets/icon-ai-podcast.svg",
  "./manifest.webmanifest",
  "./app-icon.svg",
  "./tianxi-logo.svg",
  "./assets/icon-add.svg",
  "./assets/icon-ds.svg",
  "./assets/icon-mic.svg",
  "./assets/icon-input-add.svg",
  "./assets/icon-input-send-arrow.svg",
  "./assets/icon-input-send-bg.svg",
  "./assets/icon-input-voice.svg",
  "./assets/result-top-tools.svg",
  "./assets/keyboard-sogou.png",
  "./assets/typing-bottom-bg.svg",
  "./assets/voice-bg.svg",
  "./assets/voice-wave.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
