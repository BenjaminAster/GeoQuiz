
const cacheName = new URL(self.registration.scope).pathname;

self.addEventListener("fetch", (evt) => {
	evt.respondWith((async () => {
		return (await (await self.caches.open(cacheName)).match(evt.request)) || await (async () => {
			const response = await self.fetch(evt.request.url, { cache: "no-store", });
			await (await self.caches.open(cacheName)).put(evt.request, response.clone());
			return response;
		})()
	})());
});

self.addEventListener("message", async (evt) => {
	if (evt.data === "refresh") {
		await self.caches.delete(cacheName);
		evt.source.postMessage("refresh");
	}
});

