/* Linux Extreme - same-origin v86 binary asset caching.
 * Restrict interception to five explicit immutable dependency paths.
 * The cache stores distributable static binaries, never user shell history.
 */
"use strict";
const CACHE_NAME="linux-extreme-v86-assets-v1-20261118";
const ASSET_NAMES=new Set([
 "libv86.js","v86.wasm","seabios.bin","vgabios.bin","buildroot-bzimage68.bin"
]);
const ASSET_PREFIX=new URL("./vendor/v86/",self.registration.scope).pathname;
self.addEventListener("install",event=>event.waitUntil(self.skipWaiting()));
self.addEventListener("activate",event=>event.waitUntil((async()=>{
 const keys=await caches.keys();
 await Promise.all(keys.filter(k=>k.startsWith("linux-extreme-v86-assets-")&&k!==CACHE_NAME).map(k=>caches.delete(k)));
 await self.clients.claim();
})()));
self.addEventListener("fetch",event=>{
 if(event.request.method!=="GET")return;
 const u=new URL(event.request.url);
 if(u.origin!==self.location.origin || !u.pathname.startsWith(ASSET_PREFIX))return;
 const filename=u.pathname.slice(ASSET_PREFIX.length);
 if(!ASSET_NAMES.has(filename))return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE_NAME);
  const cached=await cache.match(event.request,{ignoreSearch:true});
  if(cached)return cached;
  const response=await fetch(event.request);
  if(response.ok && response.type==="basic"){
   try{await cache.put(event.request,response.clone())}catch(e){/* quota issue: online still works */}
  }
  return response;
 })());
});
