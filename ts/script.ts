
// import "./worldMap.js";

import {
	translateElement,
	getTemplateCloner,
	languages,
	setLanguage,
} from "./languages.js";

navigator.serviceWorker.register("./service-worker.js", { scope: "./", type: "module" });

{
	// languages:

	setLanguage(languages[0]);

	const container: HTMLElement = document.querySelector("language-select");
	const getClone = getTemplateCloner(container);

	for (const language of languages) {
		const clone = getClone({
			languageName: `languages.${language}`,
			languageCode: language.toUpperCase(),
		});

		let button = clone.firstElementChild;
		if (language === languages[0]) {
			button.classList.add("selected");
		}
		button.addEventListener("click", (evt: MouseEvent) => {
			setLanguage(language);
			container.querySelector(".selected")?.classList.remove("selected");
			button.classList.add("selected");
		});

		container.append(clone);
	}
}

const browser = (() => {
	if ((navigator as any).userAgentData?.brands?.find(
		({ brand }) => brand === "Chromium"
	)) {
		return "chromium";
	}
})();

{
	// nav buttons & PWA:

	let installPromptEvent: any;

	window.addEventListener("beforeinstallprompt", (event: Event) => {
		installPromptEvent = event;
	});

	const actions: Record<string, () => void> = {
		toggleTheme() {
			const colorSchemeMeta: HTMLMetaElement = document.querySelector(`meta[name="color-scheme"]`);
			const colorSchemes = ["dark", "light"];
			colorSchemeMeta.content = colorSchemes[
				+!colorSchemes.indexOf(colorSchemeMeta.getAttribute("content"))
			];
		},
		popOutWindow() {
			window.open(location.href, "_blank", "location=yes");
		},
		async toggleFullscreen() {
			if (document.fullscreenElement) {
				document.exitFullscreen?.();
			} else {
				await document.body.requestFullscreen?.();
			};
		},
		async installApp() {
			installPromptEvent?.prompt?.();
			await installPromptEvent?.userChoice;
		},
		async refresh() {
			const serviceWorker = await navigator.serviceWorker.ready;
			await new Promise<void>(async (resolve) => {
				navigator.serviceWorker.addEventListener("message", (evt: MessageEvent) => {
					if (evt.data === "refresh") {
						resolve();
					}
				});
				serviceWorker.active.postMessage("refresh");
			});
			await serviceWorker.unregister();
			location.reload();
		}
	};

	for (const [actionName, func] of Object.entries(actions)) {
		const button: HTMLElement = document.querySelector(`[data-action="${actionName}"]`);
		button.addEventListener("click", func);
	}
}

