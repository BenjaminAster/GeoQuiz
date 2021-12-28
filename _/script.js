import { getTemplateCloner, languages, setLanguage, getLanguage, storage, } from "./utils.js";
import "./gameStart.js";
if (!new URL(location.href).searchParams.has("no-sw")) {
	navigator.serviceWorker?.register("./service-worker.js", { scope: "./" });
}
const browser = navigator.userAgentData?.brands?.find(({ brand }) => ["Chromium", "Firefox", "Safari"].includes(brand))?.brand?.toLowerCase() ?? (navigator.userAgent.match(/Firefox|Safari/i))?.[0]?.toLowerCase();
{
	let installPromptEvent;
	window.addEventListener("beforeinstallprompt", (event) => {
		installPromptEvent = event;
	});
	const setColorScheme = (scheme) => {
		const colorSchemes = ["dark", "light"];
		const colorScheme = scheme ? (colorSchemes.includes(scheme) ? scheme : colorSchemes[0]) : (colorSchemes[+!colorSchemes.indexOf(document.documentElement.getAttribute("color-scheme"))]);
		storage.set("color-scheme", colorScheme);
		document.querySelector("meta[name=color-scheme]").content = colorScheme;
		document.documentElement.setAttribute("color-scheme", colorScheme);
		document.querySelector("meta[name=theme-color]").content = (window.getComputedStyle(document.documentElement)?.getPropertyValue("--col-18")).trim();
	};
	setColorScheme(storage.get("color-scheme") ?? "dark");
	const actions = {
		toggleTheme() {
			setColorScheme();
		},
		popOutWindow() {
			window.open(location.href, "_blank", "location=yes");
		},
		async toggleFullscreen() {
			if (document.fullscreenElement) {
				document.exitFullscreen?.();
			}
			else {
				await document.documentElement.requestFullscreen?.();
			}
			;
		},
		async installOrOpenApp() {
			installPromptEvent?.prompt?.();
		},
		async refresh() {
			await new Promise(async (resolve) => {
				window.setTimeout(resolve, 500);
				window.caches.delete(new URL((await navigator.serviceWorker?.ready).scope).pathname);
				resolve();
			});
			await new Promise(async (resolve) => {
				window.setTimeout(resolve, 500);
				await (await navigator.serviceWorker?.ready)?.unregister?.();
				resolve();
			});
			await window.fetch("/clear-site-data/", { cache: "no-store" });
			location.reload(true);
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
		const buttons = [...document.querySelectorAll(`[_action="${actionName}"]`)];
		buttons.forEach((button) => button.addEventListener("click", func));
	}
	if (location.hostname === "localhost") {
		window.addEventListener("keydown", (evt) => {
			if (evt.key === "F5" && !evt.ctrlKey) {
				evt.preventDefault();
				actions.refresh();
			}
		});
	}
}
{
	setLanguage();
	const container = document.querySelector("languages options-select");
	const getClone = getTemplateCloner(container);
	for (const language of languages) {
		const clone = getClone({
			languageName: `languages.${language}`,
			languageCode: language.toUpperCase(),
		});
		const radio = clone.querySelector("input[type=radio]");
		if (language === getLanguage()) {
			radio.checked = true;
		}
		radio.addEventListener("change", (evt) => {
			setLanguage(language);
		});
		container.append(clone);
	}
}
{
	document.body.setAttribute("_loaded", "");
}
//# sourceMappingURL=script.js.map