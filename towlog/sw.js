// Offline cache for the app shell (network-first, cache fallback) + Android "Share → TowLog" target.
const C='towlog-v5',FILES=['./','index.html','manifest.webmanifest','icon.svg','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C&&x!=='towlog-share').map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method==='POST'&&u.pathname.endsWith('/share-target')){e.respondWith(share(e.request));return}
  if(e.request.method!=='GET'||u.origin!==location.origin)return;
  e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request,{ignoreSearch:true})));
});
// stash the shared text / screenshot, then open the app, which picks it up
async function share(req){
  const f=await req.formData(),c=await caches.open('towlog-share');
  const text=[f.get('title'),f.get('text'),f.get('url')].filter(Boolean).join('\n');
  if(text)await c.put('text',new Response(text));
  const img=f.getAll('image').find(x=>x&&x.size);if(img)await c.put('image',new Response(img));
  return Response.redirect('./?share=1',303);
}
