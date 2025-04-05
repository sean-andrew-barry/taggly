console.log("Hi from service.js");

self.addEventListener("install", event =>
{
  console.log("[ServiceWorker] Install");
});

self.addEventListener("activate", event =>
{
  console.log("[ServiceWorker] Activate");

  // // CODELAB: Remove previous cached data from disk.
  // event.waitUntil(
  //   caches.keys().then((keyList) =>
  //   {
  //     return Promise.all(keyList.map((key) =>
  //     {
  //       if (key !== CACHE_NAME)
  //       {
  //         console.log("[ServiceWorker] Removing old cache", key);
  //         return caches.delete(key);
  //       }
  //     }));
  //   }),
  // );
  //
  // self.clients.claim();
});

self.addEventListener("fetch", event =>
{
  const url = new URL(event.request.url);
  console.log("[ServiceWorker] Fetch", url);

  // if (url.search)
  // {
  //   // console.log(event);
  //   // console.log("~~~~Importing an include file", url.href);
  //   // url.search = "";
  //   // event.request.url = url.href;
  //   // console.log("Changed to", url.href);
  //   const response = Response.redirect(url.href);
  //   console.log(url.href, "responding with", response);
  //   // event.respondWith(
  //   //   response,
  //   // );
  //   // return;
  // }

  // // CODELAB: Add fetch event handler here.
  // if (event.request.mode !== "navigate")
  // {
  //   // Not a page navigation, bail.
  //   return;
  // }
  //
  // event.respondWith(
  //   fetch(event.request).catch(() =>
  //   {
  //     return caches.open(CACHE_NAME).then((cache) =>
  //     {
  //       return cache.match("offline.html");
  //     });
  //   }),
  // );
});
