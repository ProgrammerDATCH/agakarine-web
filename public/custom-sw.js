const CACHE_NAME = 'agakarine-v1';
const OFFLINE_URL = '/offline';
const API_CACHE_NAME = 'agakarine-api-v1';

// Resources to pre-cache
const PRE_CACHED_RESOURCES = [
  '/',
  '/offline',
  '/manifest.json',
  '/logo.png',
];

// Create a queue for storing failed requests
let syncQueue = [];

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(PRE_CACHED_RESOURCES);
      }),
      caches.open(API_CACHE_NAME)
    ])
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('agakarine-'))
          .filter((name) => name !== CACHE_NAME && name !== API_CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          // Return cached response
          return response;
        }

        return fetch(event.request)
          .then((networkResponse) => {
            // Cache successful GET requests
            if (networkResponse.ok) {
              const responseToCache = networkResponse.clone();
              caches.open(API_CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // Return offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
            return new Response('Network error', { status: 408 });
          });
      })
    );
  } else if (event.request.method === 'POST' || event.request.method === 'PUT' || event.request.method === 'DELETE') {
    event.respondWith(
      fetch(event.request.clone())
        .catch((error) => {
          // Store failed requests in the queue
          syncQueue.push({
            url: event.request.url,
            method: event.request.method,
            body: event.request.clone().text(),
            timestamp: new Date().getTime()
          });
          return new Response(JSON.stringify({ queued: true }), {
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
  }
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(
      Promise.all(
        syncQueue.map(async (request) => {
          try {
            const response = await fetch(request.url, {
              method: request.method,
              body: await request.body,
              headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
              // Remove successful requests from the queue
              syncQueue = syncQueue.filter(
                (item) => item.timestamp !== request.timestamp
              );
            }
          } catch (error) {
            console.error('Sync failed:', error);
          }
        })
      )
    );
  }
});