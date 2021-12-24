const APP_PREFIX = 'BudgetTracker';     
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

const FILES_TO_CACHE = [
    '/',
    './index.html',
    './js/index.js',
    './js/idb.js',
    './manifest.json',
    './css/styles.css',
    './icons/icon-72x72.png',
    './icons/icon-96x96.png',
    './icons/icon-128x128.png',
    './icons/icon-144x144.png',
    './icons/icon-152x152.png',
    './icons/icon-192x192.png',
    './icons/icon-384x384.png',
    './icons/icon-512x512.png',
];

// callback function of the install event listener:
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('installing cache : ' + CACHE_NAME)
      return cache.addAll(FILES_TO_CACHE)
    })
  )
});


//Add an event listener to the activate event:
self.addEventListener('activate', function(e) {
    e.waitUntil(
      caches.keys().then(function(keyList) {
        let cacheKeeplist = keyList.filter(function(key) {
          return key.indexOf(APP_PREFIX);
        });
        cacheKeeplist.push(CACHE_NAME);
  
        return Promise.all(
          keyList.map(function(key, i) {
            if (cacheKeeplist.indexOf(key) === -1) {
              console.log('deleting cache : ' + keyList[i]);
              return caches.delete(keyList[i]);
            }
          })
        );
      })
    );
  });

  //Add event listener to fetch everything:


self.addEventListener('fetch', function (e) {
  console.log('fetch request: ' + e.request.url);
  e.respondWith(caches.match(e.request).then(function (request) {
    if (request) {
      console.log('Responding with Cache: ' + e.request.url);
      return request
    } else {
      console.log('Files were not cached, fetching :' + e.request.url);
      return fetch(e.request)
    }
  }))
});