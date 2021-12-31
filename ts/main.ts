

import {
	getTemplateCloner,
	languages,
	setLanguage,
	getLanguage,
	storage,
	setColorScheme,
} from "./utils.js";

import "./gameStart.js";

import { installPromptEvent } from "./pwa.js";

/*

cd ts && tsc -b -w

*/


if (!new URL(location.href).searchParams.has("no-sw")) {
	navigator.serviceWorker?.register("./service-worker.js", { scope: "./" });
}

const browser: string = (navigator as any).userAgentData?.brands?.find(
	({ brand }) => ["Chromium", "Firefox", "Safari"].includes(brand)
)?.brand?.toLowerCase() ?? (navigator.userAgent.match(/Firefox|Safari/i))?.[0]?.toLowerCase();

{
	/// nav buttons:

	setColorScheme(storage.get("colorScheme") ?? "dark");

	const actions: Record<string, Function> = {
		toggleTheme() {
			setColorScheme();
		},
		popOutWindow() {
			window.open(location.href, "_blank", "_");
		},
		async toggleFullscreen() {
			if (document.fullscreenElement) {
				document.exitFullscreen?.();
			} else {
				await document.documentElement.requestFullscreen?.();
			};
		},
		async installApp() {
			installPromptEvent?.prompt?.();
		},
		async refresh(clearLocalStorage: boolean = true) {
			if (clearLocalStorage) localStorage.clear();

			await new Promise<void>(async (resolve: () => void) => {
				window.setTimeout(resolve, 500);
				window.caches.delete(
					new URL((await navigator.serviceWorker?.ready).scope).pathname
				);
				resolve();
			});

			await new Promise<void>(async (resolve: () => void) => {
				window.setTimeout(resolve, 500);
				await (await navigator.serviceWorker?.ready)?.unregister?.();
				resolve();
			});

			await window.fetch("/clear-site-data/", { cache: "no-store" });
			(location as any).reload(true);
		},
		share() {
			navigator.share?.({
				title: document.title,
				text: document.querySelector("meta[name=description]")?.getAttribute("content"),
				url: location.href,
			});
		}
	};

	for (const [actionName, func] of Object.entries(actions)) {
		const buttons: Element[] = [...document.querySelectorAll(`[_action="${actionName}"]`)];
		buttons.forEach((button: Element) => button.addEventListener("click", () => func()));
	}

	if (location.hostname === "localhost") {
		window.addEventListener("keydown", (event: KeyboardEvent) => {
			if (event.key === "F5" && !event.ctrlKey) {
				event.preventDefault();
				actions.refresh(false);
			}
		});
	}
}

{
	/// languages:

	setLanguage();

	const container: HTMLElement = document.querySelector("languages options-select");
	const getClone = getTemplateCloner(container);

	for (const language of languages) {
		const clone = getClone({
			languageName: `languages.${language}`,
			languageCode: language.toUpperCase(),
		});

		const radio: HTMLInputElement = clone.querySelector("input[type=radio]");

		if (language === getLanguage()) {
			radio.checked = true;
		}

		radio.addEventListener("change", (event: MouseEvent) => {
			setLanguage(language);
		});

		container.append(clone);
	}
}

{
	document.body.setAttribute("_loaded", "");
}

