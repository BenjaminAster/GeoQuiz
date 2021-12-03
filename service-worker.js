
// const cacheName = new URL(self.registration.scope).pathname;

// console.log("Hi, I'm the service worker!");

self.addEventListener("fetch", (evt) => {
	// evt.respondWith((async () => {
	// 	// return (await (await self.caches.open(cacheName)).match(evt.request)) || await (async () => {
	// 	// 	// const response = await self.fetch(evt.request.url, { cache: "no-store", });
	// 	// 	const response = await self.fetch(evt.request.url);
	// 	// 	// await (await self.caches.open(cacheName)).put(evt.request, response.clone());
	// 	// 	(await self.caches.open(cacheName)).put(evt.request, response.clone());
	// 	// 	return response;
	// 	// })()
	// 	// return (await self.caches.match(evt.request)) || await (async () => {
	// 	// 	// const response = await self.fetch(evt.request.url, { cache: "no-store", });
	// 	// 	const fetchPromise = self.fetch(evt.request);
	// 	// 	// await (await self.caches.open(cacheName)).put(evt.request, response.clone());
	// 	// 	// (await self.caches.open(cacheName)).put(evt.request, response.clone());
	// 	// 	await (await self.caches.open(cacheName)).add(evt.request);
	// 	// 	return fetchPromise;
	// 	// })()
	// 	// return await self.fetch(evt.request);
	// 	// return self.fetch(evt.request);

	// 	return self.fetch(evt.request);
	// })());

	evt.respondWith(self.fetch(evt.request));
});

// self.addEventListener("message", async (evt) => {
// 	if (evt.data === "refresh") {
// 		await self.caches.delete(cacheName);
// 		evt.source.postMessage("refresh");
// 	}
// });

