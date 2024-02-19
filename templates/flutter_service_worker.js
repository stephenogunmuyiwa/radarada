'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "f75f4c75ebd61e0372ca6c04de028143",
"assets/AssetManifest.json": "3d93addc194c11e93d7e61d5a151c8d2",
"assets/assets/fonts/ProductSans-Bold.ttf": "a19a7b108b2e3961fc855c6ea5a6546f",
"assets/assets/fonts/ProductSans-Medium.ttf": "9c51beb79b8ab173abd924ce39178f0b",
"assets/assets/fonts/ProductSans-Regular.ttf": "b61c0ab33a818a0162f3e868babcef4b",
"assets/assets/fonts/ProductSans-Thin.ttf": "3c36b2574c62d41428b496b7512e952d",
"assets/assets/img/101checkouticon.png": "a207343c52ad80efc3628aee9e77516e",
"assets/assets/img/applelogo.png": "f822ec6c46ae4414ecab5c7e259e3636",
"assets/assets/img/backdrop.png": "91b3980b67ce8a44033b9097cdb463ee",
"assets/assets/img/backdrop2.png": "6e0387c8c70bed07443a1b3a447451ad",
"assets/assets/img/backdrop3.png": "2885d4a1e95e28bf47433d263060f5e4",
"assets/assets/img/iosstorelogo.png": "76a351c2475ea1b9a59612dbc31c78ce",
"assets/assets/img/ms_badge2.png": "8faea41284b91797486b2e932f710e16",
"assets/assets/img/playstorelogo.png": "cc90a6d8af4c779990fc5b526848c47d",
"assets/assets/img/prompt1.png": "4bb83af3600a160eebfaa3f5546f4b6e",
"assets/assets/img/prompt2.png": "feb8d7927f96f9ba97300089f10e0dd3",
"assets/assets/img/prompt3.png": "d8cf6936af4636f36fae4f07834a2ad9",
"assets/assets/img/prompt4.png": "56003dbaddea32c58423377b8ab5b9a5",
"assets/assets/img/screenshot1.png": "588137b39cf2bc574e20a54fefe84a2e",
"assets/assets/img/screenshot2.png": "92c9b472a20187ca1fb37e11edcefce8",
"assets/assets/img/screenshot3.png": "86107a7ab5500e47d52ccba8fa90f49b",
"assets/assets/img/screenshot4.png": "ffa32b8ed22d7c66a6e49e7a15a29933",
"assets/assets/img/windowlogo.png": "73615b1330021d33d9944e4a21c3f7d0",
"assets/FontManifest.json": "0ddbfe96141e74b152117a57bebb0392",
"assets/fonts/MaterialIcons-Regular.otf": "62ec8220af1fb03e1c20cfa38781e17e",
"assets/NOTICES": "1b8efd070aa1603cc604f42a54e59b09",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "57d849d738900cfd590e9adc7e208250",
"assets/shaders/ink_sparkle.frag": "f8b80e740d33eb157090be4e995febdf",
"canvaskit/canvaskit.js": "76f7d822f42397160c5dfc69cbc9b2de",
"canvaskit/canvaskit.wasm": "f48eaf57cada79163ec6dec7929486ea",
"canvaskit/chromium/canvaskit.js": "8c8392ce4a4364cbb240aa09b5652e05",
"canvaskit/chromium/canvaskit.wasm": "fc18c3010856029414b70cae1afc5cd9",
"canvaskit/skwasm.js": "1df4d741f441fa1a4d10530ced463ef8",
"canvaskit/skwasm.wasm": "6711032e17bf49924b2b001cef0d3ea3",
"canvaskit/skwasm.worker.js": "19659053a277272607529ef87acf9d8a",
"favicon.png": "19b5746715c59de1524155e8b01a3bda",
"flutter.js": "6b515e434cea20006b3ef1726d2c8894",
"icons/Icon-192.png": "99bc456da51c9570f9b7cb6075f5d176",
"icons/Icon-512.png": "8aadee30c13bdb14c1c28afe59c554b2",
"icons/Icon-maskable-192.png": "99bc456da51c9570f9b7cb6075f5d176",
"icons/Icon-maskable-512.png": "8aadee30c13bdb14c1c28afe59c554b2",
"index.html": "413a2133ed21e9c01e7a4e341ac95128",
"/": "413a2133ed21e9c01e7a4e341ac95128",
"main.dart.js": "1d82a43c15b933d08615952db1d3b873",
"manifest.json": "92b326948f61ef9990d6be52d7e16009",
"version.json": "ef88572042109dcc5c8b7810fa306f46"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
