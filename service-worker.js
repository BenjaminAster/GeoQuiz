
const cacheName = new URL(self.registration.scope).pathname;

self.addEventListener("fetch", (evt) => {
	if (evt.request.url.includes("csd")) {
		console.log("csd");
		evt.respondWith(
			new Response(
				"testtest",
				{
					headers: {
						"Content-Type": "text/html; charset=utf-8",
						"Content-Length": "8",
						"Date": new Date().toUTCString(),
						"Access-Control-Allow-Origin": "*",
						"Connection": "keep-alive",
						"Keep-Alive": "timeout=5",
						"Cache-Control": "max-age=604800",
						"Clear-Site-Data": `"cache", "cookies"`,
						"X-Clear-Site-Data": `"cache", "cookies"`,
						"X-Asdf": `1`,
					},
					status: 200,
				}
			)
		)
		return;
	}
	evt.respondWith((async () => {
		return (await (await self.caches.open(cacheName)).match(evt.request)) || await (async () => {
			const response = await self.fetch(evt.request.url, { cache: "no-store", });
			await (await self.caches.open(cacheName)).put(evt.request, response.clone());
			return response;
		})()
	})());
});
