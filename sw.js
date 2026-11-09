// sw.js - Service Worker for Dynamix (Offline Cache & Auto-Refresh)
const CACHE_NAME = 'dynamix-v3';
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './js/decks.js',
  './js/sound.js',
  './js/storage.js',
  './js/engine.js',
  './js/components/home.js',
  './js/components/deck.js',
  './js/components/game.js',
  './js/components/modal.js',
  './js/app.js',
  './assets/fonts/SegoeIcons.ttf',
  './assets/fonts/segmdl2.ttf',
  './assets/fonts/segoeui.ttf',
  './assets/fonts/seguisb.ttf',
  './assets/icons/dynamix.svg',
  './assets/icons/icon.svg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './javafx_deck.json',
  './oop_deck.json'
];

// Install: precache all core application assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean up outdated caches and take control immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Stale-While-Revalidate caching strategy
// Serves instantly from cache for complete offline access, while updating cache from network in background
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (!url.protocol.startsWith('http')) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(event.request);
      const networkFetch = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || networkFetch;
    })
  );
});

// Cache Refresh: when returning online, re-fetch all core assets to keep local copy up to date
let lastCacheRefreshTime = Date.now();

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'REFRESH_CACHE') {
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        CORE_ASSETS.map((asset) => {
          return fetch(asset, { cache: 'reload' })
            .then((res) => {
              if (res && res.status === 200) {
                return cache.put(asset, res);
              }
            })
            .catch(() => {});
        })
      ).then(() => {
        lastCacheRefreshTime = Date.now();
        console.log('[Cache] Service Worker: cache was recently refreshed at ' + new Date(lastCacheRefreshTime).toLocaleTimeString());
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({ type: 'CACHE_STATUS', refreshed: true, timestamp: lastCacheRefreshTime });
          });
        });
      });
    });
  } else if (event.data && event.data.type === 'CHECK_CACHE') {
    const isRecent = (Date.now() - lastCacheRefreshTime) < 120000;
    if (event.source) {
      event.source.postMessage({ type: 'CACHE_STATUS', refreshed: isRecent, timestamp: lastCacheRefreshTime });
    }
  }
});
