self.addEventListener("install", () => {
  self.skipWaiting();
});


self.addEventListener("install",e=>{
  e.waitUntil(
    caches.open("vault-cache").then(c=>
      c.addAll(["/","/index.html"])
    )
  );
});
self.addEventListener("fetch",e=>{
  e.respondWith(
    caches.match(e.request).then(r=>r||fetch(e.request))
  );
});
