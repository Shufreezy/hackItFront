let log = console.log.bind(console);
let err = console.error.bind(console);

let version = '1';
let cacheName = 'pwa-hackIt-v' + version;
let dataCacheName = 'pwa-hackIt-data-v' + version;

let appShellFilesToCache = [
  './',
  './index.html',
  './inline.bundle.js',
  './styles.bundle.js',
  './vendor.bundle.js',
  './main.bundle.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(self.skipWaiting());
  log('Service Worker: Installed');

  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      log('Service Worker: Caching App Shell');
      return cache.addAll(appShellFilesToCache);
    })
  );
});

self.addEventListener('activate', (e) => {
  caches.keys().then((keyList) => {
    return Promise.all(keyList.map((key) => {
      if (key !== cacheName) {
        log('Service Worker: Removing old cache', key);
        return caches.delete(key);
      }
    }));
  });
});

self.addEventListener('fetch', (e) => {
  log('Service Worker: Fetch URL ', e.request.url);

  e.respondWith(
    caches.match(e.request.clone()).then((response) => {
      return response || fetch(e.request.clone()).then((r2) => {
        return caches.open(dataCacheName).then((cache) => {
          console.log('Service Worker: Fetched & Cached URL ', e.request.url);
          cache.put(e.request.url, r2.clone());
          return r2.clone();
        });
      });
    })
  );
});