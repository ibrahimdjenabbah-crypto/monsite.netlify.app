//INSTALL
const CACHE = 'mango-twofile-v30'; // Vous pouvez augmenter la version (ex: v29) pour forcer la mise à jour

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll([
      './',
      './index.html',
      './<img src="img/og-cove.jpg" width="1200" height="1078" alt="">',  // Ajout de l'image de couverture
      './<img src="img/tidiane.jpeg" width="1056" height="917" alt="">'   // Ajout de la photo d'Ahmad Tidiane
    ]);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (e)=>{ e.waitUntil(self.clients.claim()); });

self.addEventListener('fetch', (e)=>{
  const req = e.request;
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).catch(()=> new Response(
        `<!doctype html><meta charset="utf-8"><title>Hors ligne</title>
         <style>body{font-family:Inter,system-ui;display:grid;place-items:center;height:100vh;margin:0;color:#0F172A;background:#FAFBFF}</style>
         <h1>Vous êtes hors ligne</h1>`,
        {headers:{'Content-Type':'text/html; charset=utf-8'}}
      ))
    );
    return;
  }
  e.respondWith(
    caches.open(CACHE).then(async cache=>{
      const hit = await cache.match(req);
      const net = fetch(req).then(r=>{ cache.put(req, r.clone()); return r; }).catch(()=>hit);
      return hit || net;
    })
  );
});
