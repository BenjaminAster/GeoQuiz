import { storage } from "./utils.js";
(async () => {
	const [iconURI, appleTouchIconURI] = await Promise.all([[512, true], [192, false]].map(async ([size, alpha]) => {
		const canvas = document.createElement("canvas");
		canvas.width = canvas.height = size;
		const ctx = canvas.getContext("2d", { alpha });
		ctx.fillStyle = "green";
		ctx.ellipse(size / 2, size / 2, size / 2, size / 2, 0, 0, 2 * Math.PI);
		ctx.fill();
		return URL.createObjectURL(await new Promise((resolve) => {
			canvas.toBlob(resolve, "image/png");
		}));
	}));
	const manifest = {
		name: document.title,
		short_name: document.title,
		description: document.querySelector("meta[name=description]").getAttribute("content"),
		start_url: document.baseURI,
		scope: document.baseURI,
		display: "standalone",
		background_color: "black",
		theme_color: "black",
		id: document.baseURI,
		dir: "auto",
		categories: [
			"education",
			"games",
			"geography",
			"quiz",
		],
		lang: "en",
		file_handlers: [],
		display_override: ["window-controls-overlay"],
		protocol_handlers: [{
				protocol: "web+geographyquiz",
				url: document.baseURI + "?url=%s",
			}],
		user_preferences: {
			color_scheme_dark: {
				theme_color: "black",
				background_color: "black"
			},
			color_scheme_light: {
				theme_color: "white",
				background_color: "white"
			},
		},
		prefer_related_applications: false,
		launch_handler: {
			route_to: "new-client",
			navigate_existing_client: "always",
		},
		icons: [{
				src: iconURI,
				type: "image/png",
				sizes: "512x512",
				purpose: "maskable any",
			}],
		screenshots: [{
				src: "https://benjaminaster.com/media/transparent-2x2.png",
				sizes: "2x2",
			}],
	};
	{
		let el = document.createElement("link");
		el.rel = "manifest";
		el.href = URL.createObjectURL(new Blob([JSON.stringify(manifest, null, "\t")], { type: "application/manifest+json" }));
		document.head.appendChild(el);
	}
	{
		let el = document.createElement("link");
		el.rel = "apple-touch-icon";
		el.type = "image/png";
		el.href = appleTouchIconURI;
		document.head.appendChild(el);
	}
})();
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