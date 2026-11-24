const CACHE_NAME = 'astroking-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './logo.png'
  // santranc.html eklediğinde buraya da ekle: './santranc.html'
];

// Dosyaları önbelleğe al
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Eski önbellekleri temizle
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// İstekleri önbellekten veya internetten karşıla
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request).catch(() => {
        // İnternet yoksa ve önbellekte de yoksa index.html göster
        return caches.match('./index.html');
      });
    })
  );
});