
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

	setLanguage("en");

	const container: HTMLElement = document.querySelector("language-select");
	const getClone = getTemplateCloner(container);

	for (const language of languages) {
		const clone = getClone({
			languageName: `languages.${language}`,
			languageCode: language.toUpperCase(),
		});

		clone.firstElementChild.addEventListener("click", () => {
			setLanguage(language);
		});

		container.appendChild(clone);
	}
}
