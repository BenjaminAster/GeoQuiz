import { storage } from "./utils.js";
export let installPromptEvent;
{
	const showOpenInAppButton = () => {
		document.querySelector("[_action=installApp]").hidden = true;
		const button = document.querySelector("[_action=openInApp]");
		button.hidden = false;
		button.addEventListener("click", () => {
			window.open("web+geographyquiz://", "_blank");
		});
	};
	if (storage.get("isInstalled") === true) {
		showOpenInAppButton();
	}
	window.addEventListener("beforeinstallprompt", (event) => {
		storage.set("isInstalled", false);
		installPromptEvent = event;
		document.querySelector("[_action=installApp").hidden = false;
	});
	window.addEventListener("appinstalled", (event) => {
		storage.set("isInstalled", true);
		showOpenInAppButton();
	});
	if (new URL(location.href).searchParams.has("url")) {
		history.replaceState(history.state, document.title, "./");
	}
}
//# sourceMappingURL=pwa.js.map