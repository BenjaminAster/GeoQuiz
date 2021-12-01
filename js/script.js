import { getTemplateCloner, languages, setLanguage, getLanguage, } from "./languages.js";
import "./game.js";
if (!new URL(location.href).searchParams.has("no-sw")) {
	navigator.serviceWorker.register("./service-worker.js", { scope: "./", type: "module" });
}
const browser = navigator.userAgentData?.brands?.find(({ brand }) => ["Chromium", "Firefox", "Safari"].includes(brand))?.brand?.toLowerCase() ?? (navigator.userAgent.match(/Firefox|Safari/i))?.[0]?.toLowerCase();
{
	if (browser === "safari") {
		document.querySelector("safari-warning").hidden = false;
	}
}
{
	let installPromptEvent;
	window.addEventListener("beforeinstallprompt", (event) => {
		installPromptEvent = event;
	});
	const setColorScheme = (scheme) => {
		const colorSchemes = ["dark", "light"];
		const colorScheme = scheme ?? colorSchemes[+!colorSchemes.indexOf(document.documentElement.getAttribute("color-scheme"))];
		localStorage.setItem("color-scheme", colorScheme);
		document.documentElement.setAttribute("color-scheme", colorScheme);
		document.querySelector("meta[name=color-scheme]").content = colorScheme;
		document.querySelector("meta[name=theme-color]").content = (window.getComputedStyle(document.documentElement)?.getPropertyValue("--col-18"));
	};
	setColorScheme(localStorage.getItem("color-scheme") ?? "dark");
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
		async installApp() {
			installPromptEvent?.prompt?.();
			await installPromptEvent?.userChoice;
		},
		async refresh() {
			const serviceWorker = await navigator.serviceWorker.ready;
			const unregisterAndReload = async () => {
				await serviceWorker.unregister();
				location.reload();
			};
			window.setTimeout(unregisterAndReload, 1000);
			await new Promise(async (resolve) => {
				navigator.serviceWorker.addEventListener("message", (evt) => {
					if (evt.data === "refresh") {
						resolve();
					}
				});
				serviceWorker.active.postMessage("refresh");
			});
			await unregisterAndReload();
		},
		share() {
			navigator.share?.({
				title: document.title,
				text: document.querySelector("meta[name=description]")?.getAttribute("content") ?? "",
				url: location.href,
			});
		}
	};
	for (const [actionName, func] of Object.entries(actions)) {
		const button = document.querySelector(`nav [data-action="${actionName}"]`);
		button.addEventListener("click", func);
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
		let button = clone.firstElementChild;
		if (language === getLanguage()) {
			button.classList.add("selected");
		}
		button.addEventListener("click", (evt) => {
			setLanguage(language);
			container.querySelector(".selected")?.classList.remove("selected");
			button.classList.add("selected");
		});
		container.append(clone);
	}
}
//# sourceMappingURL=script.js.map