
/// <reference lib="WebWorker" />

const /** @type {string} */ cacheName = new URL(self.registration.scope).pathname;

const filesToCache = [
	"./",
	"./icon/icon.png",
	"./manifest.webmanifest",

	"./_/main.css",
	"./_/colors.css",
	"./_/icons.css",
	"./_/game.css",
	"./_/startScreen.css",
	"./_/endScreen.css",

	"./_/main.js",
	"./_/utils.js",
	"./_/gameStart.js",
	"./_/pwa.js",
	"./_/translations.js",
	"./_/game.js",
	"./_/worldMap.js",

	"./_/data.min.json",
];

const addCacheControlHeader = (/** @type {Response} */ response) => {
	response = new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers: response.headers,
	});
	response.headers.set("cache-control", "no-store");
	return response;
};

self.addEventListener("install", async (/** @type {InstallEvent} */ event) => {
	const cache = await self.caches.open(cacheName);
	await Promise.all(
		filesToCache.map(async (/** @type {string} */ path) => {
			if (!await cache.match(path)) await cache.put(
				path, addCacheControlHeader(await self.fetch(path, { cache: "force-cache" }))
			);
		})
	);
});

self.addEventListener("fetch", (/** @type {FetchEvent} */ event) => {
	event.respondWith((async () => {
		const response = (
			await (await self.caches.open(cacheName)).match(event.request)
			??
			await (async () => {
				const /** @type {Response} */ response = addCacheControlHeader(await self.fetch(event.request, { cache: "reload" }));
				(async () => await (await self.caches.open(cacheName)).put(event.request, response.clone()));
				return response.clone();
			})()
		);

		return response;
	})());
});

self.addEventListener("message", async (/** @type {MessageEvent} */ { data, source }) => {
	switch (data.type) {
		case ("checkForUpdate"): {
			const cachedHTML = await (await (await self.caches.open(cacheName)).match("./"))?.text();
			if (!cachedHTML) return;

			const fetchedHTML = await (async () => {
				try { return await (await self.fetch("./", { cache: "reload" }))?.text(); }
				catch { return null; }
			})();
			if (!fetchedHTML) return;

			if (cachedHTML !== fetchedHTML) {
				source.postMessage({ type: "updateAvailable" });
			}
			break;
		} case ("getFilesToCache"): {
			source.postMessage({ type: "filesToCache", filesToCache });
			break;
		}
	}
});
