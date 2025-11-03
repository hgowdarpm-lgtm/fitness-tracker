// Service Worker for offline functionality
const CACHE_NAME = 'fitness-tracker-v1';
const urlsToCache = [
  '/fitness-tracker/',
  '/fitness-tracker/index.html',
  '/fitness-tracker/app.js',
  '/fitness-tracker/manifest.json'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

