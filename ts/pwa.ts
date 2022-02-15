
export let installPromptEvent: any;

const registerServiceWorker = async () => {
	await navigator.serviceWorker?.register("./service-worker.js", { scope: "./", updateViaCache: "all" });
};
registerServiceWorker();

const update = async () => {
	await window.caches.delete(new URL((await navigator.serviceWorker?.ready)?.scope)?.pathname);

	const filesToCache = await new Promise<string[]>(async (resolve) => {
		navigator.serviceWorker?.addEventListener("message", ({ data: { type, filesToCache } }: MessageEvent) => {
			if (type === "filesToCache") resolve(filesToCache);
		});

		(await navigator.serviceWorker?.ready)?.active.postMessage({ type: "getFilesToCache" });
	});

	await Promise.all(filesToCache.map(async (file) => await window.fetch(file, { cache: "reload" })));

	await (await navigator.serviceWorker?.ready)?.unregister();

	// await registerServiceWorker();

	localStorage.clear();
};

navigator.serviceWorker?.addEventListener("message", async ({ data: { type } }: MessageEvent) => {
	if (type === "updateAvailable") {
		const updatePromise = update();
		document.querySelector<HTMLElement>(".update-available").hidden = false;
		document.querySelector<HTMLElement>(".update-available [_action=update]").addEventListener("click", async () => {
			await updatePromise;
			(location as any).reload(true);
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
	(location as any).reload(true);
});

window.addEventListener("beforeinstallprompt", (event: Event) => {
	installPromptEvent = event;
	document.querySelector<HTMLElement>("[_action=installApp]").hidden = false;
});
