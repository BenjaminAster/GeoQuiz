
import { storage } from "./utils.js";


export let installPromptEvent: any;

{
	const showOpenInAppButton = () => {
		document.querySelector<HTMLElement>("[_action=installApp]").hidden = true;
		const button = document.querySelector<HTMLElement>("[_action=openInApp]");
		button.hidden = false;
		button.addEventListener("click", () => {
			window.open("web+geographyquiz://", "_blank");
		});
	};

	if (storage.get("isInstalled") === true) {
		showOpenInAppButton();
	}

	window.addEventListener("beforeinstallprompt", (event: Event) => {
		storage.set("isInstalled", false);
		installPromptEvent = event;
		document.querySelector<HTMLElement>("[_action=installApp").hidden = false;
	});

	window.addEventListener("appinstalled", (event: Event) => {
		storage.set("isInstalled", true);
		showOpenInAppButton();
	});

	if (new URL(location.href).searchParams.has("url")) {
		history.replaceState(history.state, document.title, "./");
	}
}
