"use strict";

console.warn("Service.js");

const CACHE_NAME = "static-cache-v2";

const FILES_TO_CACHE = [
  "/offline.html",
];

self.addEventListener("install", event =>
{
  console.log("[ServiceWorker] Install");

  // Precache static resources here
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
    {
      console.log("[ServiceWorker] Pre-caching offline page");
      return cache.addAll(FILES_TO_CACHE);
    }),
  );

  self.skipWaiting();
});

self.addEventListener("activate", event =>
{
  console.log("[ServiceWorker] Activate");

  // CODELAB: Remove previous cached data from disk.
  event.waitUntil(
    caches.keys().then((keyList) =>
    {
      return Promise.all(keyList.map((key) =>
      {
        if (key !== CACHE_NAME)
        {
          console.log("[ServiceWorker] Removing old cache", key);
          return caches.delete(key);
        }
      }));
    }),
  );

  self.clients.claim();
});

self.addEventListener("fetch", event =>
{
  // console.log("[ServiceWorker] Fetch", event.request.url);

  // CODELAB: Add fetch event handler here.
  if (event.request.mode !== "navigate")
  {
    // Not a page navigation, bail.
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() =>
    {
      return caches.open(CACHE_NAME).then((cache) =>
      {
        return cache.match("offline.html");
      });
    }),
  );
});
