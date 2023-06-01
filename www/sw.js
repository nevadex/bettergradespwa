const CACHE_NAME = 'bg1'
const RSC_CACHE_NAME = 'bg_rsc1'

// Customize this with a different URL if needed.
const cacheFiles = [ // fetch-first
    '/',
    '/index.html',
    '/css/site.css',
    '/js/calc_class.js',
    '/js/calc_final.js',
    '/js/site.js',
    '/manifest.json',
    '/sw.js',
    '/images/img.png'
]

const rscFiles = [ // cache-first
    '/lib/bootstrap/dist/css/bootstrap.min.css',
    '/lib/jquery/dist/js/jquery.min.js',
    '/lib/bootstrap/dist/js/bootstrap.bundle.min.js'
]

// Use the install event to pre-cache all initial resources.
self.addEventListener('install', event => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll(cacheFiles);

        const rscCache = await caches.open(RSC_CACHE_NAME)
        await rscCache.addAll(rscFiles)
    })());
});

self.addEventListener('fetch', event => {
    event.respondWith((async () => {
        const cache = await caches.open(CACHE_NAME);
        const rscCache = await caches.open(RSC_CACHE_NAME)

        // Get the resource from the cache.
        const cachedResponse = await cache.match(event.request);
        const rscResponse = await rscCache.match(event.request)

        if (cachedResponse) {
            try {
                // If the resource was not in the cache, try the network.
                const fetchResponse = await fetch(event.request);

                // Save the resource in the cache and return it.
                await cache.put(event.request, fetchResponse.clone());
                return fetchResponse;
            } catch (e) {
                return cachedResponse;
            }
        } else if (rscResponse) {
            return rscResponse
        } else {
            try {
                // If the resource was not in the cache, try the network.
                const fetchResponse = await fetch(event.request);

                // Save the resource in the cache and return it.
                //await rscCache.put(event.request, fetchResponse.clone());
                return fetchResponse;
            } catch (e) {
                // The network failed.
            }
        }
    })());
});