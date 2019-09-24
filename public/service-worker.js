
self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open('osm_recycling').then(function(cache) {
            return cache.addAll([
                '/'
            ]);
        })
    );
});

self.addEventListener('fetch', function(event) {

    let url = new URL(event.request.url);

    event.respondWith(
        caches.match(event.request).then(function(response) {
            if(url.pathname === '/') {
                return fetch(event.request) || response;
            }
            else {
                return response || fetch(event.request);
            }
        })
    );

});