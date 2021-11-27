
// import "./worldMap.js";

import {
	translateElement,
	getTemplateCloner,
	languages,
	setLanguage,
	getLanguage,
} from "./languages.js";

navigator.serviceWorker.register("./service-worker.js", { scope: "./", type: "module" });

const browser: string = (navigator as any).userAgentData?.brands?.find(
	({ brand }) => ["Chromium", "Firefox", "Safari"].includes(brand)
)?.brand?.toLowerCase() ?? (navigator.userAgent.match(/Firefox|Safari/i))?.[0]?.toLowerCase();

{
	// nav buttons & PWA:

	let installPromptEvent: any;

	window.addEventListener("beforeinstallprompt", (event: Event) => {
		installPromptEvent = event;
	});

	const updateThemeColor = () => {
		(document.querySelector("meta[name=theme-color]") as HTMLMetaElement).content = window.getComputedStyle(
			document.querySelector("actual-content")
		)?.getPropertyValue("--col-18");
	}

	const actions: Record<string, () => void> = {
		toggleTheme() {
			const colorSchemeMeta: HTMLMetaElement = document.querySelector("meta[name=color-scheme]");
			const colorSchemes = ["dark", "light"];
			colorSchemeMeta.content = colorSchemes[
				+!colorSchemes.indexOf(colorSchemeMeta.getAttribute("content"))
			];

			window.setTimeout(updateThemeColor);
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
		const button: HTMLElement = document.querySelector(`[data-action="${actionName}"]`);
		button.addEventListener("click", func);
	}

	if (location.hostname === "localhost") {
		window.addEventListener("keydown", (evt: KeyboardEvent) => {
			if (evt.key === "F5" && !evt.ctrlKey) {
				evt.preventDefault();
				actions.refresh();
			}
		});
	}
}

{
	// languages:

	setLanguage();

	const container: HTMLElement = document.querySelector("language-select");
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
		button.addEventListener("click", (evt: MouseEvent) => {
			setLanguage(language);
			container.querySelector(".selected")?.classList.remove("selected");
			button.classList.add("selected");
		});

		container.append(clone);
	}
}

{
	// continents:

	const container: HTMLElement = document.querySelector("continent-select");
	const getClone = getTemplateCloner(container);

	const continents: string[] = [
		"africa",
		"northAmerica",
		"southAmerica",
		"asia",
		"europe",
		"oceania",
	];

	for (const continent of continents) {
		const clone = getClone({
			continentName: `continents.${continent}`,
		});

		let button = clone.firstElementChild;
		let selectedContinents = new Set();

		button.addEventListener("click", (evt: MouseEvent) => {
			button.classList.toggle("selected");
			selectedContinents.has(continent) ? (
				selectedContinents.delete(continent)
			) : selectedContinents.add(continent);
		});

		container.append(clone);
	}
}
