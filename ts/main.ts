

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

// const browser: string = (navigator as any).userAgentData?.brands?.find(
// 	({ brand }) => ["Chromium", "Firefox", "Safari"].includes(brand)
// )?.brand?.toLowerCase() ?? (navigator.userAgent.match(/Firefox|Safari/i))?.[0]?.toLowerCase();

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
}

{
	/// languages:

	setLanguage();

	const container: HTMLElement = document.querySelector(".languages .select");
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

