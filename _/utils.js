import translations, { languages } from "./translations.js";
export const storage = {
	get(key) {
		try {
			return JSON.parse(localStorage.getItem(`${new URL(document.baseURI).pathname}:${key}`));
		}
		catch (error) {
			console.info(error);
			return null;
		}
	},
	set(key, value) {
		localStorage.setItem(`${new URL(document.baseURI).pathname}:${key}`, JSON.stringify(value));
	},
	remove(key) {
		localStorage.removeItem(`${new URL(document.baseURI).pathname}:${key}`);
	},
};
let chosenLanguage = storage.get("language") || languages[0];
export const translateElement = (element) => {
	for (const child of [...element.querySelectorAll("[_text]")]) {
		const HTML = child.getAttribute("_text").split(".").reduce((obj, crr) => obj?.[crr], translations)?.[chosenLanguage];
		child.innerHTML = HTML;
	}
	return element;
};
export const getTemplateCloner = (container) => {
	const templateElement = container.querySelector("template");
	return (contentObj) => {
		const clone = templateElement.content.cloneNode(true);
		for (const [key, value] of Object.entries(contentObj ?? {})) {
			if (!value)
				continue;
			let element = clone.querySelector(`[_content="${key}"]`);
			if (element) {
				element.setAttribute("_text", value);
			}
			else {
				element = clone.querySelector(`[_static-text="${key}"]`);
				if (element)
					element.innerHTML = value;
			}
		}
		return translateElement(clone);
	};
};
export const setLanguage = (language) => {
	if (language)
		chosenLanguage = language;
	chosenLanguage = languages.includes(chosenLanguage) ? chosenLanguage : languages[0];
	translateElement(document.body);
	document.title = translations.title[chosenLanguage];
	document.documentElement.lang = chosenLanguage;
	storage.set("language", chosenLanguage);
};
export const setColorScheme = (scheme) => {
	const colorSchemes = ["dark", "light"];
	const colorScheme = scheme ? (colorSchemes.includes(scheme) ? scheme : colorSchemes[0]) : (colorSchemes[+!colorSchemes.indexOf(document.documentElement.getAttribute("color-scheme"))]);
	storage.set("colorScheme", colorScheme);
	document.querySelector("meta[name=color-scheme]").content = colorScheme;
	document.documentElement.setAttribute("color-scheme", colorScheme);
	document.querySelector("meta[name=theme-color]").content = (window.getComputedStyle(document.documentElement)?.getPropertyValue("--background")).trim();
	const event = new CustomEvent("color-scheme-set");
	window.dispatchEvent(event);
};
export const getLanguage = () => chosenLanguage;
export { languages } from "./translations.js";
//# sourceMappingURL=utils.js.map