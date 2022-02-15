export let installPromptEvent;
const registerServiceWorker = async () => {
	await navigator.serviceWorker?.register("./service-worker.js", { scope: "./", updateViaCache: "all" });
};
registerServiceWorker();
const update = async () => {
	await window.caches.delete(new URL((await navigator.serviceWorker?.ready)?.scope)?.pathname);
	const filesToCache = await new Promise(async (resolve) => {
		navigator.serviceWorker?.addEventListener("message", ({ data: { type, filesToCache } }) => {
			if (type === "filesToCache")
				resolve(filesToCache);
		});
		(await navigator.serviceWorker?.ready)?.active.postMessage({ type: "getFilesToCache" });
	});
	await Promise.all(filesToCache.map(async (file) => await window.fetch(file, { cache: "reload" })));
	await (await navigator.serviceWorker?.ready)?.unregister();
	localStorage.clear();
};
navigator.serviceWorker?.addEventListener("message", async ({ data: { type } }) => {
	if (type === "updateAvailable") {
		const updatePromise = update();
		document.querySelector(".update-available").hidden = false;
		document.querySelector(".update-available [_action=update]").addEventListener("click", async () => {
			await updatePromise;
			location.reload(true);
		});
		await updatePromise;
	}
});
{
	const checkReadyState = async () => {
		if (document.readyState === "complete" && navigator.onLine) {
			(await navigator.serviceWorker?.ready)?.active.postMessage({ type: "checkForUpdate" });
		}
	};
	checkReadyState();
	document.addEventListener("readystatechange", checkReadyState);
}
document.querySelector("footer [_action=update]").addEventListener("click", async () => {
	await update();
	location.reload(true);
});
window.addEventListener("beforeinstallprompt", (event) => {
	installPromptEvent = event;
	document.querySelector("[_action=installApp]").hidden = false;
});
//# sourceMappingURL=pwa.js.map