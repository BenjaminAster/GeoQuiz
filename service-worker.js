
const cacheName = new URL(self.registration.scope).pathname;

self.addEventListener("fetch", (event) => {
	event.respondWith((async () => {
		return (await (await self.caches.open(cacheName)).match(event.request)) || await (async () => {
			const response = await self.fetch(event.request.url, { cache: "no-store", });
			await (await self.caches.open(cacheName)).put(event.request, response.clone());
			return response;
		})()
	})());
});
